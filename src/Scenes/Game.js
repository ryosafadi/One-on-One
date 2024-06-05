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

         this.turret = this.physics.add.sprite(200, 200, 'turret');
         this.turret.setImmovable(true);
 
         //turret bullets
         this.bullets = this.physics.add.group({
             defaultKey: 'turretbullet',
             maxSize: 10
         });
 
         this.time.addEvent({
             delay: 3000,
             callback: this.shootBullet,
             callbackScope: this,
             loop: true
         });
        // this is a pretty basic collision handler
        this.physics.add.overlap(this.bullets, my.sprite.player, this.handlePlayerHit, null, this);
    
        this.hitOverlay = this.add.sprite(this.playerX, this.playerY, 'hit1');
        this.hitOverlay.setVisible(false);
        this.hitSound = this.sound.add('impsound');
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
        this.hitOverlay.setPosition(my.sprite.player.x, my.sprite.player.y);
        
    }
//for the turret, can be copied for other things.
    shootBullet() {
        const bullet = this.bullets.get(this.turret.x, this.turret.y);
        if (bullet) {
            bullet.setActive(true);
            bullet.setVisible(true);
            bullet.body.velocity.y = 300; //this just shoots straight down, but we can make it track the player too
            bullet.body.setCollideWorldBounds(true);
            bullet.body.onWorldBounds = true;
            bullet.body.world.on('worldbounds', (body) => {
                if (body.gameObject === bullet) {
                    bullet.setActive(false);
                    bullet.setVisible(false);
                }
            });
        }
    }
    //for some reason this player hit handler will delete the player if i
    //don't leave player in the front.... not sure why, but whatever it works like this.
    handlePlayerHit(player, bullet) {
        bullet.setActive(false);
        bullet.setVisible(false);
        this.hitOverlay.setVisible(true);
        this.hitOverlay.play('hit', true);
        this.hitSound.play();
        this.hitOverlay.on('animationcomplete', () => {
            this.hitOverlay.setVisible(false);
        }, this);
    }
}