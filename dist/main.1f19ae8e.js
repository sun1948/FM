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
})({"../../../../.config/yarn/global/node_modules/parcel/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../../../.config/yarn/global/node_modules/parcel/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../../../.config/yarn/global/node_modules/parcel/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../../../.config/yarn/global/node_modules/parcel/src/builtins/css-loader.js"}],"main.js":[function(require,module,exports) {
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

      if (!$(this).hasClass('myFavorite')) {
        EventBus.trigger('album-selected', {
          channelId: $(this).attr('data-channel-id'),
          channelName: $(this).attr('data-channel-name')
        });
      } else {
        EventBus.trigger('like-selected', {
          channelId: null,
          channelName: '我的收藏'
        });
      }
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

    $.getJSON('//jirenguapi.applinzi.com/fm/v2/getChannels.php').done(function (ret) {
      _this.renderFooter(ret.channels);
    }).fail(function () {
      console.log('error');
    });
  },
  renderFooter: function renderFooter(channels) {
    var html = '<li class="myFavorite">' + '<div class="cover" style="background-color: chocolate"></div>' + '<h3>我的收藏</h3></li>';
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
    EventBus.trigger('loading', {
      channelId: $('footer ul li').eq(1).attr('data-channel-id'),
      channelName: $('footer ul li').eq(1).attr('data-channel-name')
    });
  }
};
var Fm = {
  init: function init() {
    this.$container = $('#page-music');
    this.audio = new Audio();
    this.clock = null;
    this.localSongArr = JSON.parse(localStorage.getItem('like')) || [];
    this.loading = false;
    this.like = false;
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
    EventBus.on('loading', function (e, channelObj) {
      _this.channelId = channelObj.channelId;
      _this.channelName = channelObj.channelName;
      _this.audioPlay = false;

      _this.loadMusic();
    });
    EventBus.on('like-selected', function (e, channelObj) {
      _this.channelId = channelObj.channelId;
      _this.channelName = channelObj.channelName;
      _this.audioPlay = true;
      _this.like = true;

      _this.loadMusic(_this.like);
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

        if (_this.like) {
          _this.loadMusic(_this.like);
        } else {
          _this.loadMusic();
        }
      }
    });
    this.$container.find('.btn-collect').on('click', function () {
      var $numberSpan = _this.$container.find('.icons li').eq(1).find('span').eq(1);

      if ($(this).hasClass('active')) {
        //取消收藏
        $(this).removeClass('active'); //删除本地数组中对应歌曲对象

        var songIndex;

        _this.localSongArr.forEach(function (song, index) {
          if (song.sid === _this.song.sid) {
            songIndex = index;
          }
        });

        _this.localSongArr.splice(songIndex, 1);

        localStorage.setItem('like', JSON.stringify(_this.localSongArr));
        var val = parseInt($numberSpan.text()) - 1;
        $numberSpan.text(val);
      } else {
        //执行收藏功能
        //亮红心
        $(this).addClass('active'); //收藏+1

        var _val = parseInt($numberSpan.text()) + 1;

        $numberSpan.text(_val); //存储当前歌曲信息到localStorage

        _this.localSongArr.push(_this.song);

        localStorage.setItem('like', JSON.stringify(_this.localSongArr));
      }
    });
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
    this.$container.find('.detail .bar').on('click', function (e) {
      var $bar = _this.$container.find('.detail .bar');

      var $barProgress = _this.$container.find('.detail .bar-progress');

      var barLeft = $bar.offset().left;
      var dif = e.clientX - barLeft;
      $barProgress.css('width', dif / $bar.width() * 100 + '%');
      _this.audio.currentTime = _this.audio.duration * dif / $bar.width();

      _this.audio.play();
    });
  },
  loadMusic: function loadMusic(like) {
    //若点击我的收藏，则从本地读取歌单
    if (like) {
      if (this.localSongArr.length > 0) {
        var index = Math.floor(Math.random() * this.localSongArr.length);
        this.song = this.localSongArr[index];
        this.like = true;
        this.setMusic();
        this.loadLyric();
        this.loading = false;
      } else {
        alert("收藏夹暂为空，请添加～");
      }

      return;
    }

    this.like = false;

    var _this = this;

    $.getJSON('//jirenguapi.applinzi.com/fm/v2/getSong.php', {
      channel: this.channelId
    }).done(function (ret) {
      _this.loading = false; //完成加载，可以点击下一首

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
    var _this = this;

    this.audio.src = this.song.url;
    $('#bg').css('background-image', 'url(' + this.song.picture + ')');
    this.$container.find('main figure').css('background-image', 'url(' + this.song.picture + ')');
    var songName = this.song.title.length < 30 ? this.song.title : this.song.title.substr(0, 30);
    this.$container.find('.detail h1').text(songName);
    this.$container.find('.detail .author').text(this.song.artist);
    this.$container.find('.detail .tag').text(this.channelName);
    if (this.audioPlay) this.audio.play(); //查找本地歌曲信息，判断其是否为收藏曲目，设置红心

    this.checkSong();
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
      this.$container.find('.lyric p').text(lyricLine).lyricAnimate('rollIn');
    }
  },
  checkSong: function checkSong() {
    var _this = this;

    var count = 0;
    this.localSongArr.forEach(function (song) {
      if (song.sid === _this.song.sid) {
        count += 1;
      }
    });

    if (count > 0) {
      _this.$container.find('.actions .icon-heart').addClass('active');
    } else {
      _this.$container.find('.actions .icon-heart').removeClass('active');
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
  var $words = this.find('span').css('opacity', 0);
  var clock = setInterval(function () {
    $words.eq(index).addClass('animate__animated ' + 'animate__' + type).css('opacity', 1);
    index += 1;

    if (index >= $words.length) {
      clearInterval(clock);
    }
  }, 200);
};

Footer.init();
Fm.init();
},{"./style.css":"style.css"}],"../../../../.config/yarn/global/node_modules/parcel/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "54345" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../.config/yarn/global/node_modules/parcel/src/builtins/hmr-runtime.js","main.js"], null)
//# sourceMappingURL=/main.1f19ae8e.js.map