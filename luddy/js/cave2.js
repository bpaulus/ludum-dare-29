/**
 * Created by paulusb on 4/26/14.
 */
function Cave2(game) {
    var game,
        bugs,
        startingTiles,
        bullets,
        bullet,
        bulletTime,
        firebutton,
        explosions,
        facingDirection,
        sfx;

    this.bulletTime = 0;

};

Cave2.prototype = {
    preload: function () {
        this.game.load.tilemap('map', 'assets/cave2.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('bug', 'assets/enemies.png', 32, 32);


        this.game.load.spritesheet('explosions', 'assets/explosion.png', 32, 32);
        this.game.load.spritesheet('poop', 'assets/weapons.png', 32, 32);
        this.game.load.image('bullet', 'assets/bullet.png');

        this.game.load.audio('sfx', 'assets/Hit_Hurt.mp3');

        this.startingTiles = GameData.startingTiles.cave2.point;
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
        this.map.setTileIndexCallback(63, this.boss, this);

        this.player = this.game.add.sprite(this.startingTiles.x, this.startingTiles.y, 'player');
        this.player.anchor.setTo(0.5, 0.5);

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


        this.bugs.setAll('anchor.x', 0.5);
        this.bugs.setAll('anchor.y', 0.5);


        //  Our bullet group
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('outOfBoundsKill', true);

        //  An explosion pool
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'explosions');
        this.explosions.forEach(this.setupExplosion, this);

        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        this.game.physics.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);
        // sound
        this.sfx = this.game.add.audio('sfx');
        this.sfx.addMarker('shoot', 0, 1);

        this.scoreText = this.game.add.text(10, 10, 'SCORE: ' + GameData.player.data.score, {font: '20px Arial', fill: "#ffffff", align: "left"});
        this.scoreText.fixedToCamera = true;


    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.player, this.bugs, this.bugCollectHandler, null, this);
        this.game.physics.arcade.collide(this.bullets, this.layer, this.bulletEnvironmentHandler, null, this);

        this.game.physics.arcade.overlap(this.bullets, this.bugs, this.bulletHandler, null, this);
        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;
        var idleX = true,
            idleY = true;

        this.facingDirection = 'down';


        if (this.cursors.up.isDown) {
            this.player.body.velocity.y = -150;
            this.player.animations.play("fly-away");
            idleY = false;
            this.facingDirection = 'up';
        }
        else if (this.cursors.down.isDown) {
            this.player.body.velocity.y = 150;
            this.player.animations.play("fly");
            idleY = false;
            this.facingDirection = 'down';
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
            this.player.animations.play("fly-left");
            idleX = false;

            this.facingDirection = 'left';
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
            this.player.animations.play("fly-right");
            idleX = false;
            this.facingDirection = 'right';
        }

        if (idleX && idleY) {
            this.player.animations.play("fly");
            this.facingDirection = 'down';
        }

        if (this.fireButton.isDown) {
            this.fireBullet(this.facingDirection);
            this.sfx.play('shoot');
        }

    },
    render: function () {
//        this.game.debug.cameraInfo(this.game.camera, 32, 32);
//        this.game.debug.spriteCoords(this.player, 32, 200);
    },
    toWorld: function () {
        this.game.state.start('world');
    },
    boss: function () {
        this.game.state.start('boss');
    },
    bugCollectHandler: function (player, bug) {
        bug.kill();
        GameData.player.data.score += 1;
        this.scoreText.setText('SCORE: ' + GameData.player.data.score);
    },

    bulletEnvironmentHandler: function (bullet) {
        bullet.kill();
    },
    bulletHandler: function (bullet, bug) {
        bullet.kill();
        bug.kill();
        GameData.player.data.score += 1;
        this.scoreText.setText('SCORE: ' + GameData.player.data.score);

        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(bug.body.x, bug.body.y);
        explosion.play('explosions', 30, false, true);

    },
    fireBullet: function (dir) {

        if (this.game.time.now > this.bulletTime) {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet) {
                //  And fire it
                this.bullet.reset(this.player.x, this.player.y);
                switch (dir) {
                    case "up":
                        this.bullet.body.velocity.y = -400;
                        break;
                    case "down":
                        this.bullet.body.velocity.y = 400;
                        break;
                    case "left":
                        this.bullet.body.velocity.x = -400;
                        break;
                    case "right":
                        this.bullet.body.velocity.x = 400;
                        break;
                }
                this.bulletTime = this.game.time.now + 200;
            }
        }
    },
    setupExplosion: function (explosion) {
        //        explosion.anchor.y = 0.5;
        //        explosion.anchor.x = 0.5;
        explosion.animations.add('explosions');
    }
}