/**
 * Created by paulusb on 4/27/14.
 */
function GameOver(game) {
    var game = game,
        splashed,
        overText,
        helpText,
        enterKey,
        luddy;
}

GameOver.prototype = {
    preload: function () {

        this.game.world.setBounds(0, 0, 800, 600);
//
//        this.game.width = 800;
//        this.game.height = 600;

        this.game.load.image('splash', 'assets/splash.png');
        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
    },
    create: function () {

        this.splashed = this.game.add.sprite(this.world.centerX, this.world.centerY, 'splash');
        this.splashed.anchor.setTo(0.5, 0.5);

        this.overText = this.game.add.text(this.game.world.centerX, this.game.world.height - 50, 'You WIN! You saved the bats!', { font: "32px Arial", fill: "#ffffff", align: "center"});
        this.overText.anchor.setTo(0.5, 0.5);

        this.helpText = this.game.add.text(this.game.world.centerX, 10, 'use ARROW keys to fly', {font: '10px Arial', fill: "#ffffff", align: "center"});
        this.helpText.anchor.setTo(0.5, 0.5);

        this.luddy = this.game.add.sprite(0, 0, 'player');
        this.luddy.animations.add('fly', [1, 2], 10, true);
        this.luddy.animations.add('fly-away', [3, 4], 10, true);
        this.luddy.animations.add('fly-left', [7, 8], 10, true);
        this.luddy.animations.add('fly-right', [5, 6], 10, true);

        this.game.physics.arcade.enable(this.luddy);
        this.luddy.body.velocity.setTo(200, 200);
        this.luddy.body.bounce.set(0.8);
        this.luddy.body.gravity.set(0, 180);
        this.luddy.body.collideWorldBounds = true;

        this.luddy.animations.play('fly-right');

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);

    },
    update: function () {



//        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
//            this.game.state.start('world');
//        }
        var idleX = true,
            idleY = true;

        if (this.cursors.up.isDown) {
            this.luddy.body.velocity.y = -150;
            this.luddy.animations.play("fly-away");
            idleY = false;
        }
        else if (this.cursors.down.isDown) {
            this.luddy.body.velocity.y = 150;
            this.luddy.animations.play("fly");
            idleY = false;
        }

        if (this.cursors.left.isDown) {
            this.luddy.body.velocity.x = -150;
            this.luddy.animations.play("fly-left");
            idleX = false;
        }
        else if (this.cursors.right.isDown) {
            this.luddy.body.velocity.x = 150;
            this.luddy.animations.play("fly-right");
            idleX = false;
        }

        if (idleX && idleY) {
            this.luddy.animations.play("fly");
        }

    },
}