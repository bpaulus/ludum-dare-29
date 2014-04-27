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
