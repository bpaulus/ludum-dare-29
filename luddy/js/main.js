'use strict';


(function(window){

    window.onload = function() {
        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld29'),
            world = new World(game),
            well = new Well(game),
            cave = new Cave(game),
            splash = new Splash(game);

        game.state.add('splash', splash);
        game.state.add('world', world );
        game.state.add('well', well );
        game.state.add('cave', cave );

        game.state.start('splash');
    };

}(window));