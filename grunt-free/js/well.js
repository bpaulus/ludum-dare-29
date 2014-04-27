/**
 * Created by paulusb on 4/26/14.
 */
function Well(game) {
    var game,
        cursors,
        jumpButton,
        tiles,
        map,
        player,
        jumpTimer,
        wellbugs,
        special;

    this.game = game;
    this.jumpTimer = 0;
}

Well.prototype = {
    preload: function () {

        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
        this.game.load.tilemap('map', 'assets/well.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('bug', 'assets/enemies.png', 32, 32);

    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');

        this.layer = this.map.createLayer('base');
        this.layer.resizeWorld();

        // collide with the ground
        this.map.setCollisionBetween(21, 29);

        // collide with the door...
        this.map.setTileIndexCallback(63, this.toWorld, this);
        this.map.setTileIndexCallback(61, this.getItem, this);

        this.player = this.game.add.sprite(0, 0, 'player');
        this.player.animations.add('fly', [1, 2], 10, true);
        this.player.animations.add('fly-away', [3, 4], 10, true);
        this.player.animations.add('fly-left', [7, 8], 10, true);
        this.player.animations.add('fly-right', [5, 6], 10, true);

        this.wellbugs = this.game.add.group();
        this.wellbugs.enableBody = true;
        this.wellbugs.physicsBodyType = Phaser.Physics.ARCADE;

        this.map.createFromObjects('wellbugs', 61, 'bug', 0, true, false, this.wellbugs);
        //  Add animations to all of the coin sprites
        this.wellbugs.callAll('animations.add', 'animations', 'wellbugs', [0, 1], 10, true);
        this.wellbugs.callAll('animations.play', 'animations', 'wellbugs');

        this.special = this.game.add.group();
        this.special.enableBody = true;
        this.special.physicsBodyType = Phaser.Physics.ARCADE;

        this.map.createFromObjects('special', 31, 'bug', 0, true, false, this.special);
        //  Add animations to all of the coin sprites
        this.special.callAll('animations.add', 'animations', 'wellbugs', [2, 3], 10, true);
        this.special.callAll('animations.play', 'animations', 'wellbugs');


        this.game.camera.follow(this.player);

        this.game.physics.arcade.enable(this.player);
        this.player.body.velocity.setTo(200, 200);
        this.player.body.bounce.set(0.8);
        this.player.body.gravity.set(0, 180);
        this.player.body.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();


        this.scoreText = this.game.add.text(this.game.world.centerX, 10, 'SCORE: ' + GameData.player.data.score, {font: '20px Arial', fill: "#ffffff", align: "left"});
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.fixedToCamera = true;

    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.wellbugs, this.bugCollectHandler, null, this);
        this.game.physics.arcade.collide(this.player, this.special, this.getItem, null, this);

//
//        this.player.body.velocity.x = 0;
//        this.player.body.velocity.y = 0;
        var idleX = true,
            idleY = true;


        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -150;
            this.player.animations.play("fly-away");
            idleY = false;
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 150;
            this.player.animations.play("fly");
            idleY = false;
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play("fly-left");
            idleX = false;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play("fly-right");
            idleX = false;
        }

        if (idleX && idleY) {
            this.player.animations.play("fly");
        }

    },
    render: function () {
//        this.game.debug.cameraInfo(this.game.camera, 32, 32);
//        this.game.debug.spriteCoords(this.player, 32, 200);
        this.game.debug.bodyInfo(this.player, 32, 32);

    },
    toWorld: function () {
        this.game.state.start('world');
    },
    getItem: function (player, bug) {
        GameData.player.data.inventory = ['item'];
        bug.kill();
    },
    bugCollectHandler: function (player, bug) {
        bug.kill();
        GameData.player.data.score += 1;
        this.scoreText.setText('SCORE: ' + GameData.player.data.score );
    }

}