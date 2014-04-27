'use strict';


(function(window){

    window.onload = function() {
        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld29'),
            world = new World(game),
            gate = new Gate(game),
            cave = new Cave(game);

        game.state.add('world', world );
        game.state.add('gate', gate );
        game.state.add('cave', cave );

        game.state.start('cave');
    };

}(window));