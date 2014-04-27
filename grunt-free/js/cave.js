/**
 * Created by paulusb on 4/26/14.
 */
function Cave(game) {
    var game,
        bugs,
        startingTiles,
        bullets;
};

Cave.prototype = {
    preload: function () {
        this.game.load.tilemap('map', 'assets/cave.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('bug', 'assets/enemies.png', 32, 32);

        this.startingTiles = GameData.startingTiles.cave.point;
    },
    create: function () {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles');

        this.layer = this.map.createLayer('base');
        this.layer.resizeWorld();

        // collide with the ground
        this.map.setCollisionBetween(21, 30);
        this.map.setCollisionBetween(41, 50);

        this.map.setTileIndexCallback(11, this.toWorld, this);

        this.player = this.game.add.sprite(this.startingTiles.x, this.startingTiles.y, 'player');

        this.player.animations.add('fly', [1, 2], 10, true);
        this.player.animations.add('fly-away', [3, 4], 10, true);
        this.player.animations.add('fly-left', [7, 8], 10, true);
        this.player.animations.add('fly-right', [5, 6], 10, true);

        this.bugs = this.game.add.group();
        this.bugs.enableBody = true;
        this.bugs.physicsBodyType = Phaser.Physics.ARCADE;

        this.map.createFromObjects('bugs', 61, 'bug', 0, true, false, this.bugs);
        //  Add animations to all of the coin sprites
        this.bugs.callAll('animations.add', 'animations', 'bugs', [0, 1], 10, true);
        this.bugs.callAll('animations.play', 'animations', 'bugs');

        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        this.game.physics.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();


        this.scoreText = this.game.add.text(this.game.world.centerX, 10, 'SCORE: ' + GameData.player.data.score, {font: '20px Arial', fill: "#ffffff", align: "left"});
        this.scoreText.anchor.setTo(0.5, 0.5);
        this.scoreText.fixedToCamera = true;

    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.bugs, this.bugCollectHandler, null, this);


        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
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
    },
    toWorld: function () {
        this.game.state.start('world');
    },
    bugCollectHandler: function (player, bug) {
        bug.kill();
        GameData.player.data.score += 1;
        this.scoreText.setText('SCORE: ' + GameData.player.data.score );
    }
}