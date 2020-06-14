import Style from './style.css'

const $ = window.$
const EventBus = {
  on(eventName, handler) {
    $(document).on(eventName, handler)
  },
  trigger(eventName, data) {
    $(document).trigger(eventName, data)
  }
}
const Footer = {
  init() {
    this.$footer = $('footer')
    this.$ul = this.$footer.find('ul')
    this.$coverWrap = this.$footer.find('.cover-wrap')
    this.$leftBtn = this.$footer.find('.icon-left')
    this.$rightBtn = this.$footer.find('.icon-right')
    this.isToEnd = false
    this.isToStart = true
    this.isAnimating = false
    this.bind()
    this.render()
  },
  bind() {
    const _this = this
    this.$rightBtn.on('click', function () {
      if (_this.isAnimating) return
      const itemWidth = _this.$ul.find('li').outerWidth(true)
      const rowCount = Math.floor(_this.$coverWrap.width() / itemWidth)
      if (_this.$ul.find('li').length <= rowCount) return
      if (!_this.isToEnd) {
        _this.isAnimating = true
        _this.$ul.animate({
          left: '-=' + rowCount * itemWidth
        }, 400, function () {
          _this.isToStart = false
          _this.isAnimating = false
          if (-parseFloat(_this.$ul.css('left')) + itemWidth * rowCount >= parseFloat(_this.$ul.width())) {
            _this.isToEnd = true
          }
        })
      }
    })

    this.$leftBtn.on('click', function () {
      if (_this.isAnimating) return
      const itemWidth = _this.$ul.find('li').outerWidth(true)
      const rowCount = Math.floor(_this.$coverWrap.width() / itemWidth)
      if (!_this.isToStart) {
        _this.isAnimating = true
        _this.$ul.animate({
          left: '+=' + rowCount * itemWidth
        }, 400, function () {
          _this.isToEnd = false
          _this.isAnimating = false
          if (parseFloat(_this.$ul.css('left')) + 1 >= 0) {
            _this.isToStart = true
            _this.$ul.css('left', 0)
          }
        })
      }
    })

    this.$footer.on('click', 'li', function () {
      $(this).addClass('active')
        .siblings().removeClass('active')
      EventBus.trigger('album-selected', {
        channelId: $(this).attr('data-channel-id'),
        channelName: $(this).attr('data-channel-name')
      })
    })
    $(window).resize(function () {
      const $vh = $(window).height() / 100
      const $li = _this.$footer.find('li')
      $li.find('.cover').css({width: 20 * $vh})
      const count = $li.length
      const width = $li.outerWidth(true)
      _this.$ul.css({
        width: width * count
      })
    })
  },
  render() {
    const _this = this
    $.getJSON('//jirenguapi.applinzi.com/fm/v2/getChannels.php')
      .done(function (ret) {
        _this.renderFooter(ret.channels)
      })
      .fail(function () {
        console.log('error')
      })
  },
  renderFooter(channels) {
    let html = '<li class="myFavorite"><div class="cover" style="background-image: "></div><h3>我的收藏</h3></li>'
    channels.forEach(function (channel) {
      html += '<li data-channel-id=' + channel.channel_id + ' data-channel-name=' + channel.name + '>'
        + '<div class="cover" style="background-image:url(' + channel.cover_small + ')"></div>'
        + '<h3>' + channel.name + '</h3>'
        + '</li>'
    })
    this.$ul.html(html)
    this.setStyle()
    this.trigger()
  },
  setStyle() {
    const $li = this.$footer.find('li')
    const count = $li.length
    const width = $li.outerWidth(true)
    this.$ul.css({
      width: width * count
    })
  },
  trigger() {
    EventBus.trigger('loaded', {
      channelId: $('footer ul li').first().attr('data-channel-id'),
      channelName: $('footer ul li:first').attr('data-channel-name')
    })
  },
}

const Fm = {
  init() {
    this.$container = $('#page-music')
    this.audio = new Audio()
    this.clock = null
    this.flag = false
    this.loading = false

    this.bind()
  },
  bind() {
    const _this = this
    EventBus.on('album-selected', function (e, channelObj) {
      _this.channelId = channelObj.channelId
      _this.channelName = channelObj.channelName
      _this.audioPlay = true
      _this.loadMusic()
    })
    EventBus.on('loaded', function (e, channelObj) {
      _this.channelId = channelObj.channelId
      _this.channelName = channelObj.channelName
      _this.audioPlay = false
      _this.loadMusic()
    })
    this.$container.find('.btn-play').on('click', function () {
      if ($(this).hasClass('icon-play')) {
        _this.audio.play()
        $(this).removeClass('icon-play').addClass('icon-pause')
      } else {
        _this.audio.pause()
        $(this).removeClass('icon-pause').addClass('icon-play')
      }
    })
    this.$container.find('.btn-next').on('click', function () {
      _this.audioPlay = true
      if (!_this.loading) {
        _this.loading = true
        _this.loadMusic()
      }
    })
    this.$container.find('.btn-collect').on('click', function () {
    })
    this.audio.addEventListener('play', function () {
      _this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause')
      clearInterval(_this.clock)
      _this.clock = setInterval(function () {
        _this.updateStatus()
      }, 1000)
    })
    this.audio.addEventListener('pause', function () {
      _this.$container.find('.btn-play').removeClass('icon-pause').addClass('icon-play')
      clearInterval(_this.clock)
    })
    this.audio.addEventListener('ended', function () {
      _this.audioPlay = true
      _this.loadMusic()
    })
    this.$container.find('.actions .icon-heart').on('click', function () {
      if (!_this.flag) {
        _this.flag = true
        $(this).css('color', 'red')
        const val = parseInt(_this.$container.find('.icons li').eq(1).find('span').eq(1).text()) + 1
        _this.$container.find('.icons li').eq(1).find('span').eq(1).text(val)
      } else {
        _this.flag = false
        $(this).css('color', 'rgba(255, 255, 255, 0.4)')
        const val = parseInt(_this.$container.find('.icons li').eq(1).find('span').eq(1).text()) - 1
        _this.$container.find('.icons li').eq(1).find('span').eq(1).text(val)
      }
    })
    this.$container.find('.detail .bar').on('click', function (e) {
      const $bar = _this.$container.find('.detail .bar')
      const $barProgress = _this.$container.find('.detail .bar-progress')
      const barLeft = $bar.offset().left
      const dif = e.clientX - barLeft
      $barProgress.css('width', dif / $bar.width() * 100 + '%')
      _this.audio.currentTime = _this.audio.duration * dif / $bar.width()
    })
  },
  loadMusic() {
    const _this = this
    $.getJSON('//jirenguapi.applinzi.com/fm/v2/getSong.php', {channel: this.channelId})
      .done(function (ret) {
        _this.loading = false
        if (ret['song'].length !== 0) {
          _this.song = ret['song'][0]
          _this.setMusic()
          _this.loadLyric()
        } else {
          _this.loadMusic()
        }
      })
  },
  setMusic() {
    this.audio.src = this.song.url
    $('#bg').css('background-image', 'url(' + this.song.picture + ')')
    this.$container.find('main figure').css('background-image', 'url(' + this.song.picture + ')')
    const songName = this.song.title.length < 30 ? this.song.title : this.song.title.substr(0, 30)
    this.$container.find('.detail h1').text(songName)
    this.$container.find('.detail .author').text(this.song.artist)
    this.$container.find('.detail .tag').text(this.channelName)
    if (this.audioPlay) this.audio.play()
  },
  loadLyric() {
    const _this = this
    this.$container.find('.lyric p').text('')
    $.getJSON(this.song.lrc).done(function (ret) {
      _this.lyricObj = {}
      const lyricArr = ret.lyric.split('\n')
      lyricArr.forEach(function (line) {
        const times = line.match(/\d{2}:\d{2}/g)
        const lyricLine = line.replace(/\[.*\]/g, '')
        if (times) {
          times.forEach(function (time) {
            _this.lyricObj[time] = lyricLine
          })
        }
      })
      if (Object.keys(_this.lyricObj).length === 0) {
        _this.$container.find('.lyric p').text('暂无歌词')
      }
    })
  },
  updateStatus() {
    const totalTime = this.audio.duration
    const currentTime = this.audio.currentTime
    let resTime = this.audio.duration - currentTime
    const min = Math.floor(resTime / 60) + ''
    let sec = Math.floor(resTime % 60) + ''
    sec = sec.length === 2 ? sec : '0' + sec
    resTime = min + ':' + sec
    this.$container.find('.current-time').text(resTime)

    const percent = this.audio.currentTime / totalTime * 100 + '%'
    this.$container.find('.bar-progress').css('width', percent)

    const musicMin = '0' + Math.floor(currentTime / 60)
    let musicSec = Math.floor(currentTime % 60) + ''
    musicSec = musicSec.length === 2 ? musicSec : '0' + musicSec
    const musicTime = musicMin + ':' + musicSec
    const lyricLine = this.lyricObj[musicTime]
    if (lyricLine) {
      this.$container.find('.lyric p').text(lyricLine).lyricAnimate('rollIn')
    }
  },
}

$.fn.lyricAnimate = function (type) {
  type = type || 'bounce'
  let lyricStr
  if (this.text().indexOf(' ') !== -1) {
    lyricStr = this.text().split(' ')
      .map(function (word) {
        return '<span style="display: inline-block">' + word + '</span>'
      }).join(' ')
  } else {
    lyricStr = this.text().split('')
      .map(function (word) {
        return '<span style="display: inline-block">' + word + '</span>'
      }).join('')
  }
  this.html(lyricStr)
  let index = 0
  const $words = this.find('span').css('opacity',0)
  const clock = setInterval(function () {
    $words.eq(index).addClass('animate__animated ' + 'animate__' + type).css('opacity',1)
    index += 1
    if (index >= $words.length) {
      clearInterval(clock)
    }
  }, 200)
}

Footer.init()
Fm.init()
