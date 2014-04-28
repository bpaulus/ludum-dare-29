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
        scoreText,
        jumpTimer,
        wellbugs,
        special,
        bullets,
        bullet,
        bulletTime,
        firebutton,
        explosions,
        facingDirection,
        sfx;

    this.game = game;
    this.jumpTimer = 0;
    this.bulletTime = 0;

}

Well.prototype = {
    preload: function () {


        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
        if (GameData.well.id === 1) {
            this.game.load.tilemap('map', 'assets/well.json', null, Phaser.Tilemap.TILED_JSON);
        } else {
            this.game.load.tilemap('map', 'assets/well2.json', null, Phaser.Tilemap.TILED_JSON);
        }
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('bug', 'assets/enemies.png', 32, 32);

        this.game.load.spritesheet('explosions', 'assets/explosion.png', 32, 32);
        this.game.load.spritesheet('poop', 'assets/weapons.png', 32, 32);
        this.game.load.image('bullet', 'assets/bullet.png');

        this.game.load.audio('sfx', 'assets/Hit_Hurt.mp3');

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

        // collide with something?
        this.map.setTileIndexCallback(61, this.getItem, this);

        this.player = this.game.add.sprite(0, 0, 'player');
        this.player.anchor.setTo(0.5, 0.5);

        this.player.animations.add('fly', [1, 2], 10, true);
        this.player.animations.add('fly-away', [3, 4], 10, true);
        this.player.animations.add('fly-left', [7, 8], 10, true);
        this.player.animations.add('fly-right', [5, 6], 10, true);

        this.wellbugs = this.game.add.group();
        this.wellbugs.enableBody = true;
        this.wellbugs.physicsBodyType = Phaser.Physics.ARCADE;

        this.wellbugs.setAll('anchor.x', 0.5);
        this.wellbugs.setAll('anchor.y', 0.5);

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

        this.game.camera.follow(this.player);

        this.game.physics.arcade.enable(this.player);
        this.player.body.velocity.setTo(200, 200);
        this.player.body.bounce.set(0.8);
        this.player.body.gravity.set(0, 180);
        this.player.body.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT,Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);

        this.scoreText = this.game.add.text(10, 10, 'SCORE: ' + GameData.player.data.score, {font: '20px Arial', fill: "#ffffff", align: "left"});
        this.scoreText.fixedToCamera = true;

        // sound
        this.sfx = this.game.add.audio('sfx');
        this.sfx.addMarker('shoot', 0, 1);

    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.bullets, this.layer, this.bulletEnvironmentHandler, null, this);
        this.game.physics.arcade.collide(this.player, this.wellbugs, this.bugCollectHandler, null, this);
        this.game.physics.arcade.collide(this.player, this.special, this.getItem, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.wellbugs, this.bulletHandler, null, this);


        this.facingDirection = 'down';
        var idleX = true,
            idleY = true;

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
//        this.game.debug.bodyInfo(this.player, 32, 32);

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