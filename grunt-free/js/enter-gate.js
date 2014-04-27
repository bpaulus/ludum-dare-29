/**
 * Created by paulusb on 4/26/14.
 */
function Gate(game) {
    var game,
        cursors,
        jumpButton,
        tiles,
        map,
        player,
        jumpTimer;

    this.game = game;
    this.jumpTimer = 0;
}

Gate.prototype = {
    preload: function () {

        this.game.load.image('player', 'assets/player.jpg');
        this.game.load.tilemap('map', 'assets/gate.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/tiles.png');

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
        this.map.setTileIndexCallback(31, this.toWorld, this);

        this.map.setTileIndexCallback(61, this.getItem, this);

        this.game.physics.arcade.gravity.y = 250;

        this.player = this.game.add.sprite(0, 0, 'player');
        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        this.game.physics.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.jumpButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);

        this.player.body.velocity.x = 0;

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
        }

        if (this.jumpButton.isDown && this.player.body.onFloor() && this.game.time.now > this.jumpTimer)
        {
            this.player.body.velocity.y = -250;
            this.jumpTimer = this.game.time.now + 750;
        }

    },
    render: function () {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        this.game.debug.spriteCoords(this.player, 32, 200);
    },
    toWorld: function() {
        this.game.state.start('world');
    },
    getItem: function() {
        this.map.replace(61, 51);
        GameData.player.data.inventory = ['item'];
    }

}