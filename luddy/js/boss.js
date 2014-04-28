/**
 * Created by paulusb on 4/26/14.
 */
function Boss(game) {
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
        sfx,
        boss,
        bossLife,
        bossLifeText;

    this.game = game;
    this.jumpTimer = 0;
    this.bulletTime = 0
    this.bossLife = 100;

}

Boss.prototype = {
    preload: function () {

        this.game.load.spritesheet('player', 'assets/player.png', 32, 32);
        this.game.load.tilemap('map', 'assets/boss.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');
        this.game.load.spritesheet('boss', 'assets/boss.png', 128, 128);

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


        this.boss = this.game.add.group();
        this.boss.enableBody = true;
        this.boss.physicsBodyType = Phaser.Physics.ARCADE;

        this.boss.setAll('anchor.x', 0.5);
        this.boss.setAll('anchor.y', 0.5);

        this.map.createFromObjects('special', 31, 'boss', 0, true, false, this.boss);
        //  Add animations to all of the coin sprites
        this.boss.callAll('animations.add', 'animations', 'boss', [0], 10, true);
        this.boss.callAll('animations.play', 'animations', 'boss');

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
        this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP, Phaser.Keyboard.DOWN, Phaser.Keyboard.SPACEBAR ]);

        this.scoreText = this.game.add.text(10, 10, 'SCORE: ' + GameData.player.data.score, {font: '20px Arial', fill: "#ffffff", align: "left"});
        this.scoreText.fixedToCamera = true;

        this.bossLifeText = this.game.add.text(this.game.width - 150, 10, 'Boss Life: ' + this.bossLife, {font: '20px Arial', fill: "#ffffff", align: "left"});
        this.bossLifeText.fixedToCamera = true;

        // sound
        this.sfx = this.game.add.audio('sfx');
        this.sfx.addMarker('shoot', 0, 1);

    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);
        this.game.physics.arcade.collide(this.bullets, this.layer, this.bulletEnvironmentHandler, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.boss, this.bulletHandler, null, this);

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
        if (this.bossLife <=  0) {

            this.game.state.start('game-over');
        }
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
    bulletHandler: function (bullet, boss) {
        bullet.kill();
        if (this.bossLife <= 0) {
            boss.kill();
        }
        this.bossLife -= 5;
        this.bossLifeText.setText('Boss Life: ' + this.bossLife);

        var explosion = this.explosions.getFirstExists(false);
        explosion.reset(boss.body.x, boss.body.y);
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
        explosion.animations.add('explosions');
    }

}