(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a)return a(o, !0);
        if (i)return i(o, !0);
        throw new Error("Cannot find module '" + o + "'")
      }
      var f = n[o] = {exports: {}};
      t[o][0].call(f.exports, function (e) {
        var n = t[o][1][e];
        return s(n ? n : e)
      }, f, f.exports, e, t, n, r)
    }
    return n[o].exports
  }

  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++)s(r[o]);
  return s
})({1: [function (require, module, exports) {
  'use strict';

//global variables
  window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld29');

    // Game States
    game.state.add('boot', require('./states/boot'));
    game.state.add('gameover', require('./states/gameover'));
    game.state.add('menu', require('./states/menu'));
    game.state.add('play', require('./states/play'));
    game.state.add('preload', require('./states/preload'));


    game.state.start('boot');
  };
}, {"./states/boot": 2, "./states/gameover": 3, "./states/menu": 4, "./states/play": 5, "./states/preload": 6}], 2: [function (require, module, exports) {

  'use strict';

  function Boot() {
  }

  Boot.prototype = {
    preload: function () {
    },
    create: function () {
      this.game.input.maxPointers = 1;
      this.game.state.start('preload');
    }
  };

  module.exports = Boot;

}, {}], 3: [function (require, module, exports) {
  'use strict';
  function GameOver() {
  }

  GameOver.prototype = {
    preload: function () {

    },
    create: function () {
    },
    update: function () {
      if (this.game.input.activePointer.justPressed()) {
        this.game.state.start('play');
      }
    }
  };
  module.exports = GameOver;

}, {}], 4: [function (require, module, exports) {
  'use strict';
  function Menu() {
  }

  Menu.prototype = {
    preload: function () {

    },
    create: function () {
    },
    update: function () {
      if (this.game.input.activePointer.justPressed()) {
        this.game.state.start('play');
      }
    }
  };

  module.exports = Menu;

}, {}], 5: [function (require, module, exports) {
  'use strict';
  function Play() {
  }

  Play.prototype = {
    create: function () {

      // make the world bigger than the stage
      this.game.world.setBounds(0, 0, 1400, 1400);

      // add a background
      this.game.add.sprite(0, 0, 'background');


    },
    update: function () {

    },
    clickListener: function () {
      this.game.state.start('gameover');
    }
  };

  module.exports = Play;
}, {}], 6: [function (require, module, exports) {
  'use strict';
  function Preload() {
    this.ready = false;
  }

  Preload.prototype = {
    preload: function () {
      this.load.image('background', 'assets/quick-bg.jpg');
    },
    create: function () {
    },
    update: function () {
      this.game.state.start('play');
    }
  };

  module.exports = Preload;

}, {}]}, {}, [1])