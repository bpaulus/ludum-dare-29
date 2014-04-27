/**
 * Created by paulusb on 4/26/14.
 */


function World(game) {
    var game,
        cursors,
        background,
        player,
        map,
        tileset,
        layer;

    this.game = game;
    this.cursors;
}

World.prototype = {

    preload: function () {
        this.game.load.tilemap('map', 'assets/tiles.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('player', 'assets/player.jpg');
        this.game.load.image('tiles', 'assets/tiles.png');
    },
    create: function () {

        console.log('create')
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('tiles')
        this.map.setCollisionBetween(31, 50);
        this.map.setTileIndexCallback(56, this.gate, this);

        if (GameData.player.data.inventory.indexOf('item') === -1) {
            // sloppy hack, i need to find a way to get the index of the 21
            // with the index i can tell it to replace a tile with the original
            this.map.replace(22, 42);
        } else {
            console.log('in else');
            this.map.replace(42, 22);
            this.map.setTileIndexCallback(22, this.cave, this);
        }

        this.layer = this.map.createLayer('base');
        this.layer.resizeWorld();

        this.player = this.game.add.sprite(300, 300, 'player');

        this.game.physics.arcade.enable(this.player);
        this.game.camera.follow(this.player);

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

        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -150;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 150;
        }

    },
    render: function() {
        this.game.debug.cameraInfo(this.game.camera, 32, 32);
        this.game.debug.spriteCoords(this.player, 32, 200);
    },
    gate: function() {
        this.game.state.start('gate');
    },
    cave: function() {
        this.game.state.start('cave');
    }

}