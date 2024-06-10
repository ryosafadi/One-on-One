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
        this.playerHealth = 100;
        this.maxPlayerHealth = 100;
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
        this.slashOverlay = this.add.sprite(this.playerX, this.playerY, 'slash').setScale(0.05,0.10);
        this.slashOverlay.setVisible(false);
        this.hitOverlay = this.add.sprite(this.playerX, this.playerY, 'hit1');
        this.hitOverlay.setVisible(false);
        this.hitSound = this.sound.add('impsound');

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

        my.sprite.heartOuter = this.add.sprite(270, 488, "heartOuter").setOrigin(0, 0);
        my.sprite.heartOuter.setScale(7);
        my.sprite.heartOuter.depth = 10;
        my.sprite.heartOuter.setScrollFactor(0, 0);

        my.sprite.heartInner = this.add.sprite(277, 488, "heartInner").setOrigin(0, 0);
        my.sprite.heartInner.setScale(7);
        my.sprite.heartInner.depth = 11;
        my.sprite.heartInner.setScrollFactor(0);

        let healthStyle = { 
            fontSize: 10,
            color: 'White',
            fontFamily: 'Verdana',
            align: "left"
        };

        my.text.health = this.add.bitmapText(297.5, 510.4, "pixellari", this.playerHealth).setOrigin(0.5, 0.5);
        my.text.health.depth = 12;
        my.text.health.setScrollFactor(0);

        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

         this.turret = this.physics.add.sprite(200, 150, 'turret');
         this.turret.setScale(5);
         this.turret.originalX = this.turret.x; // Store the original position
         this.turret.originalY = this.turret.y;
         //turret bullets
         this.bullets = this.physics.add.group({
             defaultKey: 'turretbullet',
             maxSize: 100
         });
 
         this.time.addEvent({
             delay: 2000,
             callback: this.shootBullet,
             callbackScope: this,
             loop: true
         });

         this.BossPhaseOneTimer = this.time.addEvent({
            delay: 16,
            callback: this.moveBossCircle,
            callbackScope: this,
            loop: true
        });
        // this is a pretty basic collision handler
        this.physics.add.overlap(my.sprite.player, this.bullets, this.handlePlayerHit, null, this);

        console.log(this.playerHealth / this.maxPlayerHealth * my.sprite.heartInner.width);
    }
    update() {
        my.sprite.heartInner.setCrop(0, 0, this.playerHealth / this.maxPlayerHealth * my.sprite.heartInner.width, 8);
        my.text.health.text = this.playerHealth;

        //there is something wrong with this math, it's not quiiiite following the mouse perfectly
        //edit: jk i fixed it, stupid camera
        let slashAngle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y+100, game.input.mousePointer.x + this.cameras.main.scrollX, game.input.mousePointer.y + this.cameras.main.scrollY);
        this.slashOverlay.setRotation(slashAngle - Math.PI/2);
        //halp
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
            if (my.sprite.player.anims.currentAnim.key != "attack") {
            my.sprite.player.play("attack");
            //this.slashOverlay.setRotation(slashAngle);
            this.slashOverlay.setVisible(true);
            this.slashOverlay.play('slash', true);
            this.slashOverlay.on('animationcomplete', () => {
                this.slashOverlay.setVisible(false);
                this.slashOverlay.setPosition(-350, -350);
            }, this);
        }
        }
        this.hitOverlay.setPosition(my.sprite.player.x, my.sprite.player.y);
        this.slashOverlay.setPosition(my.sprite.player.x, my.sprite.player.y);
        
    }

    moveBossCircle() {
        const radius = 50; // Radius of the circular path
        const speed = 0.0005; // Speed of the turret circle
        const angle = this.time.now * speed;
        const wiggleAmp = 0.1; // Amplitude of the wiggle
        const wiggleFreq = 0.02; // Frequency of the wiggle

        this.turret.x = this.turret.originalX + radius * Math.cos(angle);
        this.turret.y = this.turret.originalY + radius * Math.sin(angle);
        this.turret.rotation = Math.sin(this.time.now * wiggleFreq) * wiggleAmp;
    }

//for the turret, can be copied for other things.
shootBullet() {
    const coneAngle = Phaser.Math.DegToRad(45); // 45 degree cone, feel free to edit this, not sure what's a good feel
    const bulletSpeed = 50; // Bullet speed... seems a little too fast still not sure, need to tweak this too
    const sets = 3;
    const bulletsPerSet = 5;
    const delayBetweenSets = 400; 
    for (let set = 0; set < sets; set++) {
        this.time.delayedCall(set * delayBetweenSets, () => {
            for (let i = 0; i < bulletsPerSet; i++) {
                const rawAngle = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, my.sprite.player.x, my.sprite.player.y);
                const angle = rawAngle + Phaser.Math.FloatBetween(-coneAngle / 2, coneAngle / 2);
                const bullet = this.bullets.get(this.turret.x, this.turret.y + 10);

                if((rawAngle >= -Math.PI / 2  && rawAngle <= 0) || (rawAngle >= 0 && rawAngle <= Math.PI / 2)) this.turret.flipX = true;
                else this.turret.flipX = false;

                if (bullet) {
                    bullet.setActive(true);
                    bullet.setVisible(true);
                    this.physics.velocityFromRotation(angle, bulletSpeed, bullet.body.velocity);
                    bullet.rotation = angle - Math.PI / 2;
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
        }, this);
    }
}
    //for some reason this player hit handler will delete the player if i
    //don't leave player in the front.... not sure why, but whatever it works like this.
    handlePlayerHit(player, bullet) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.setPosition(-300, -300);
        this.playerHealth -= 10;
        this.hitOverlay.setVisible(true);
        this.hitOverlay.play('hit', true);
        this.hitSound.play();
        player.setAlpha(0.2);
        this.hitOverlay.on('animationcomplete', () => {
            this.hitOverlay.setVisible(false);
            player.setAlpha(1);
        }, this);
    }
}