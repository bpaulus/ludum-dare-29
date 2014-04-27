/**
 * Created by paulusb on 4/26/14.
 */
function Cave(game) {
    var game,
        startingTiles;
};

Cave.prototype = {
    preload: function() {
        this.game.load.tilemap('map', 'assets/cave.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('player', 'assets/player.jpg');
        this.game.load.image('tiles', 'assets/tiles.png');

        this.startingTiles = GameData.startingTiles.cave.point;
        console.log('startingTiles', this.startingTiles);
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
        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);
        this.game.physics.collideWorldBounds = true;

        this.cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function () {

        this.game.physics.arcade.collide(this.player, this.layer);

        this.player.body.velocity.x = 0;
        this.player.body.velocity.y = 0;

        if (this.cursors.up.isDown)
        {
            this.player.body.velocity.y = -150;
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.velocity.y = 150;
        }

        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown) {
            this.player.body.velocity.x = 150;
        }

    },
    render: function () {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        this.game.debug.spriteCoords(this.player, 32, 200);
    },
    toWorld: function() {
        console.log('in to world');
        this.game.state.start('world');
    }
}