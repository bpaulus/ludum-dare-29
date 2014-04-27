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