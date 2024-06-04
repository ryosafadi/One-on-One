class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.TILESIZE = 8;
        this.SCALE = 3.0;
        this.TILEWIDTH = 16;
        this.TILEHEIGHT = 10;
        this.playerX = game.config.width / 2 / this.SCALE;
        this.playerY = game.config.height / 2 / this.SCALE;
        this.playerSpeed = 0.3;
    }

    preload() {

    }

    create() {
        this.map = this.add.tilemap("OneOnOneArena", this.TILESIZE, this.TILESIZE, this.TILEHEIGHT, this.TILEWIDTH);

        this.tileset = this.map.addTilesetImage("colored_tilemap_packed", "tilemap_tiles");

        this.backgroundLayer = this.map.createLayer("Background", this.tileset, 0, 0);

        this.backgroundLayer.forEachTile(tile => {
            if(tile.properties["wall"]){
                tile.setCollision(true);
            }
        });

        my.sprite.player = this.physics.add.sprite(this.playerX, this.playerY).play("idleAnim");
        my.sprite.player.body.setSize(my.sprite.player.body.width/4, my.sprite.player.body.height/4);
        my.sprite.player.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(my.sprite.player.body, this.backgroundLayer, (obj1, obj2) => {
            this.ping("yippee!");
        });

        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player);
        this.cameras.main.followOffset.set(0, 50);

        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        if(this.aKey.isDown){
            if(this.wKey.isDown) my.sprite.player.y -= this.playerSpeed;
            if(this.sKey.isDown) my.sprite.player.y += this.playerSpeed;

            if(my.sprite.player.anims.currentAnim.key != "horiWalk") my.sprite.player.play("horiWalk");
            my.sprite.player.x -= this.playerSpeed;
        }
        else if(this.dKey.isDown){
            if(this.wKey.isDown) my.sprite.player.y -= this.playerSpeed;
            if(this.sKey.isDown) my.sprite.player.y += this.playerSpeed;

            if(my.sprite.player.anims.currentAnim.key != "horiWalk") my.sprite.player.play("horiWalk");
            my.sprite.player.x += this.playerSpeed;
        }
        else if(this.wKey.isDown){
            if(my.sprite.player.anims.currentAnim.key != "vertWalk") my.sprite.player.play("vertWalk");
            my.sprite.player.y -= this.playerSpeed;
        }
        else if(this.sKey.isDown){
            if(my.sprite.player.anims.currentAnim.key != "vertWalk") my.sprite.player.play("vertWalk");
            my.sprite.player.y += this.playerSpeed;
        }
        else{
            my.sprite.player.play("idleAnim");
        }
    }
}