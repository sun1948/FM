// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"iMte":[function(require,module,exports) {

},{}],"epB2":[function(require,module,exports) {
"use strict";

var _style = _interopRequireDefault(require("./style.css"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = window.$;
var EventBus = {
  on: function on(eventName, handler) {
    $(document).on(eventName, handler);
  },
  trigger: function trigger(eventName, data) {
    $(document).trigger(eventName, data);
  }
};
var Footer = {
  init: function init() {
    this.$footer = $('footer');
    this.$ul = this.$footer.find('ul');
    this.$coverWrap = this.$footer.find('.cover-wrap');
    this.$leftBtn = this.$footer.find('.icon-left');
    this.$rightBtn = this.$footer.find('.icon-right');
    this.isToEnd = false;
    this.isToStart = true;
    this.isAnimating = false;
    this.bind();
    this.render();
  },
  bind: function bind() {
    var _this = this;

    this.$rightBtn.on('click', function () {
      if (_this.isAnimating) return;

      var itemWidth = _this.$ul.find('li').outerWidth(true);

      var rowCount = Math.floor(_this.$coverWrap.width() / itemWidth);
      if (_this.$ul.find('li').length <= rowCount) return;

      if (!_this.isToEnd) {
        _this.isAnimating = true;

        _this.$ul.animate({
          left: '-=' + rowCount * itemWidth
        }, 400, function () {
          _this.isToStart = false;
          _this.isAnimating = false;

          if (-parseFloat(_this.$ul.css('left')) + itemWidth * rowCount >= parseFloat(_this.$ul.width())) {
            _this.isToEnd = true;
          }
        });
      }
    });
    this.$leftBtn.on('click', function () {
      if (_this.isAnimating) return;

      var itemWidth = _this.$ul.find('li').outerWidth(true);

      var rowCount = Math.floor(_this.$coverWrap.width() / itemWidth);

      if (!_this.isToStart) {
        _this.isAnimating = true;

        _this.$ul.animate({
          left: '+=' + rowCount * itemWidth
        }, 400, function () {
          _this.isToEnd = false;
          _this.isAnimating = false;

          if (parseFloat(_this.$ul.css('left')) + 1 >= 0) {
            _this.isToStart = true;

            _this.$ul.css('left', 0);
          }
        });
      }
    });
    this.$footer.on('click', 'li', function () {
      $(this).addClass('active').siblings().removeClass('active');
      EventBus.trigger('album-selected', {
        channelId: $(this).attr('data-channel-id'),
        channelName: $(this).attr('data-channel-name')
      });
    });
    $(window).resize(function () {
      var $vh = $(window).height() / 100;

      var $li = _this.$footer.find('li');

      $li.find('.cover').css({
        width: 20 * $vh
      });
      var count = $li.length;
      var width = $li.outerWidth(true);

      _this.$ul.css({
        width: width * count
      });
    });
  },
  render: function render() {
    var _this = this;

    $.getJSON('//api.jirengu.com/fm/v2/getChannels.php').done(function (ret) {
      _this.renderFooter(ret.channels);
    }).fail(function () {
      console.log('error');
    });
  },
  renderFooter: function renderFooter(channels) {
    var html = '';
    channels.forEach(function (channel) {
      html += '<li data-channel-id=' + channel.channel_id + ' data-channel-name=' + channel.name + '>' + '<div class="cover" style="background-image:url(' + channel.cover_small + ')"></div>' + '<h3>' + channel.name + '</h3>' + '</li>';
    });
    this.$ul.html(html);
    this.setStyle();
    this.trigger();
  },
  setStyle: function setStyle() {
    var $li = this.$footer.find('li');
    var count = $li.length;
    var width = $li.outerWidth(true);
    this.$ul.css({
      width: width * count
    });
  },
  trigger: function trigger() {
    EventBus.trigger('loaded', {
      channelId: $('footer ul li').first().attr('data-channel-id'),
      channelName: $('footer ul li:first').attr('data-channel-name')
    });
  }
};
var Fm = {
  init: function init() {
    this.$container = $('#page-music');
    this.audio = new Audio();
    this.clock = null;
    this.flag = false;
    this.loading = false;
    this.bind();
  },
  bind: function bind() {
    var _this = this;

    EventBus.on('album-selected', function (e, channelObj) {
      _this.channelId = channelObj.channelId;
      _this.channelName = channelObj.channelName;
      _this.audioPlay = true;

      _this.loadMusic();
    });
    EventBus.on('loaded', function (e, channelObj) {
      _this.channelId = channelObj.channelId;
      _this.channelName = channelObj.channelName;
      _this.audioPlay = false;

      _this.loadMusic();
    });
    this.$container.find('.btn-play').on('click', function () {
      if ($(this).hasClass('icon-play')) {
        _this.audio.play();

        $(this).removeClass('icon-play').addClass('icon-pause');
      } else {
        _this.audio.pause();

        $(this).removeClass('icon-pause').addClass('icon-play');
      }
    });
    this.$container.find('.btn-next').on('click', function () {
      _this.audioPlay = true;

      if (!_this.loading) {
        _this.loading = true;

        _this.loadMusic();
      }
    });
    this.$container.find('.btn-collect').on('click', function () {});
    this.audio.addEventListener('play', function () {
      _this.$container.find('.btn-play').removeClass('icon-play').addClass('icon-pause');

      clearInterval(_this.clock);
      _this.clock = setInterval(function () {
        _this.updateStatus();
      }, 1000);
    });
    this.audio.addEventListener('pause', function () {
      _this.$container.find('.btn-play').removeClass('icon-pause').addClass('icon-play');

      clearInterval(_this.clock);
    });
    this.audio.addEventListener('ended', function () {
      _this.audioPlay = true;

      _this.loadMusic();
    });
    this.$container.find('.actions .icon-heart').on('click', function () {
      if (!_this.flag) {
        _this.flag = true;
        $(this).css('color', 'red');
        var val = parseInt(_this.$container.find('.icons li').eq(1).find('span').eq(1).text()) + 1;

        _this.$container.find('.icons li').eq(1).find('span').eq(1).text(val);
      } else {
        _this.flag = false;
        $(this).css('color', 'rgba(255, 255, 255, 0.4)');

        var _val = parseInt(_this.$container.find('.icons li').eq(1).find('span').eq(1).text()) - 1;

        _this.$container.find('.icons li').eq(1).find('span').eq(1).text(_val);
      }
    });
  },
  loadMusic: function loadMusic() {
    var _this = this;

    $.getJSON('//jirenguapi.applinzi.com/fm/v2/getSong.php', {
      channel: this.channelId
    }).done(function (ret) {
      _this.loading = false;

      if (ret['song'].length !== 0) {
        _this.song = ret['song'][0];

        _this.setMusic();

        _this.loadLyric();
      } else {
        _this.loadMusic();
      }
    });
  },
  setMusic: function setMusic() {
    this.audio.src = this.song.url;
    $('#bg').css('background-image', 'url(' + this.song.picture + ')');
    this.$container.find('main figure').css('background-image', 'url(' + this.song.picture + ')');
    this.$container.find('.detail h1').text(this.song.title);
    this.$container.find('.detail .author').text(this.song.artist);
    this.$container.find('.detail .tag').text(this.channelName);
    if (this.audioPlay) this.audio.play();
  },
  loadLyric: function loadLyric() {
    var _this = this;

    this.$container.find('.lyric p').text('');
    $.getJSON(this.song.lrc).done(function (ret) {
      _this.lyricObj = {};
      var lyricArr = ret.lyric.split('\n');
      lyricArr.forEach(function (line) {
        var times = line.match(/\d{2}:\d{2}/g);
        var lyricLine = line.replace(/\[.*\]/g, '');

        if (times) {
          times.forEach(function (time) {
            _this.lyricObj[time] = lyricLine;
          });
        }
      });

      if (Object.keys(_this.lyricObj).length === 0) {
        _this.$container.find('.lyric p').text('暂无歌词');
      }
    });
  },
  updateStatus: function updateStatus() {
    var totalTime = this.audio.duration;
    var currentTime = this.audio.currentTime;
    var resTime = this.audio.duration - currentTime;
    var min = Math.floor(resTime / 60) + '';
    var sec = Math.floor(resTime % 60) + '';
    sec = sec.length === 2 ? sec : '0' + sec;
    resTime = min + ':' + sec;
    this.$container.find('.current-time').text(resTime);
    var percent = this.audio.currentTime / totalTime * 100 + '%';
    this.$container.find('.bar-progress').css('width', percent);
    var musicMin = '0' + Math.floor(currentTime / 60);
    var musicSec = Math.floor(currentTime % 60) + '';
    musicSec = musicSec.length === 2 ? musicSec : '0' + musicSec;
    var musicTime = musicMin + ':' + musicSec;
    var lyricLine = this.lyricObj[musicTime];

    if (lyricLine) {
      this.$container.find('.lyric p').text(lyricLine).lyricAnimate('animate__flipInX');
    }
  }
};

$.fn.lyricAnimate = function (type) {
  type = type || 'bounce';
  var lyricStr;

  if (this.text().indexOf(' ') !== -1) {
    lyricStr = this.text().split(' ').map(function (word) {
      return '<span style="display: inline-block">' + word + '</span>';
    }).join(' ');
  } else {
    lyricStr = this.text().split('').map(function (word) {
      return '<span style="display: inline-block">' + word + '</span>';
    }).join('');
  }

  this.html(lyricStr);
  var index = 0;
  var $words = this.find('span');
  var clock = setInterval(function () {
    $words.eq(index).addClass('animate__animated ' + type);
    index += 1;

    if (index >= $words.length) {
      clearInterval(clock);
    }
  }, 300);
};

Footer.init();
Fm.init();
},{"./style.css":"iMte"}]},{},["epB2"], null)
//# sourceMappingURL=main.044e66d4.js.map