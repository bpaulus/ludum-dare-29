'use strict';


(function(window){

    window.onload = function() {
        var game = new Phaser.Game(800, 600, Phaser.AUTO, 'ld29'),
            world = new World(game),
            well = new Well(game),
            cave = new Cave(game),
            cave2 = new Cave2(game),
            boss = new Boss(game),
            gameOver = new GameOver(game),
            splash = new Splash(game);

        game.state.add('splash', splash);
        game.state.add('world', world );
        game.state.add('well', well );
        game.state.add('cave', cave );
        game.state.add('cave2', cave2 );
        game.state.add('boss', boss );
        game.state.add('game-over', gameOver );

        game.state.start('splash');
    };

}(window));