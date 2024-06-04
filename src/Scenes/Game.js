class Game extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    init() {
        this.TILESIZE = 8;
        this.SCALE = 3.0;
        this.TILEWIDTH = 16;
        this.TILEHEIGHT = 10;
        this.playerSpeed = 70; // Adjust the speed for velocity
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

        this.playerX = this.map.widthInPixels / 2;
        this.playerY = 3* this.map.heightInPixels / 4;
        my.sprite.player = this.physics.add.sprite(this.playerX, this.playerY).play("idleAnim");
        my.sprite.player.body.setSize(my.sprite.player.body.width/4, my.sprite.player.body.height/4);
        my.sprite.player.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(my.sprite.player, this.backgroundLayer);

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
            my.sprite.player.body.setVelocityX(-this.playerSpeed);
            if (this.wKey.isDown) my.sprite.player.body.setVelocityY(-this.playerSpeed);
            else if (this.sKey.isDown) my.sprite.player.body.setVelocityY(this.playerSpeed);
            else my.sprite.player.body.setVelocityY(0);

            if (my.sprite.player.anims.currentAnim.key != "horiWalk" && !game.input.activePointer.leftButtonDown()) my.sprite.player.play("horiWalk");
        }
        else if(this.dKey.isDown){
            my.sprite.player.body.setVelocityX(this.playerSpeed);
            if (this.wKey.isDown) my.sprite.player.body.setVelocityY(-this.playerSpeed);
            else if (this.sKey.isDown) my.sprite.player.body.setVelocityY(this.playerSpeed);
            else my.sprite.player.body.setVelocityY(0);

            if (my.sprite.player.anims.currentAnim.key != "horiWalk" && !game.input.activePointer.leftButtonDown()) my.sprite.player.play("horiWalk");
        }
        else if(this.wKey.isDown){
            my.sprite.player.body.setVelocity(0);
            my.sprite.player.body.setVelocityY(-this.playerSpeed);
            if (my.sprite.player.anims.currentAnim.key != "vertWalk" && !game.input.activePointer.leftButtonDown()) my.sprite.player.play("vertWalk");
        }
        else if(this.sKey.isDown){
            my.sprite.player.body.setVelocity(0);
            my.sprite.player.body.setVelocityY(this.playerSpeed);
            if (my.sprite.player.anims.currentAnim.key != "vertWalk" && !game.input.activePointer.leftButtonDown()) my.sprite.player.play("vertWalk");
        }
        else{
            my.sprite.player.body.setVelocity(0);
            if(!game.input.activePointer.leftButtonDown()) my.sprite.player.play("idleAnim");
        }

        if(game.input.activePointer.leftButtonDown()){
            if (my.sprite.player.anims.currentAnim.key != "attack") my.sprite.player.play("attack");
        }
    }
}