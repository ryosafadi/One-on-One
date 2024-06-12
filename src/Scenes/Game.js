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
        this.bossHealth = 100;
        this.maxBossHealth = 100;
        this.slashCooldown = 0;
        this.slashTime = 0;
        this.target = new Phaser.Math.Vector2();
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

        this.hitOverlay = this.add.sprite(this.playerX, this.playerY, 'hit1');
        this.hitOverlay.setVisible(false);
        this.hitSound = this.sound.add('impsound');

        this.playerX = this.map.widthInPixels / 2;
        this.playerY = 3 * this.map.heightInPixels / 4;
        my.sprite.player = this.physics.add.sprite(this.playerX, this.playerY).play("idleAnim");
        my.sprite.player.body.setSize(my.sprite.player.body.width/4, my.sprite.player.body.height/4);
        my.sprite.player.body.setCollideWorldBounds(true);
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);

        this.physics.add.collider(my.sprite.player, this.backgroundLayer);

        this.cameras.main.setZoom(this.SCALE);
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player);
        this.cameras.main.followOffset.set(0, 50);

        my.sprite.slash = this.physics.add.sprite(-350, -350, 'slash').setScale(0.05,0.10);
        my.sprite.slash.setVisible(false);

        my.sprite.heartOuter = this.add.sprite(270, 488, "heartOuter").setOrigin(0, 0);
        my.sprite.heartOuter.setScale(7);
        my.sprite.heartOuter.depth = 10;
        my.sprite.heartOuter.setScrollFactor(0, 0);

        my.sprite.heartInner = this.add.sprite(277, 488, "heartInner").setOrigin(0, 0);
        my.sprite.heartInner.setScale(7);
        my.sprite.heartInner.depth = 11;
        my.sprite.heartInner.setScrollFactor(0);

        my.text.playerHealth = this.add.bitmapText(297.5, 510.4, "pixellari", this.playerHealth).setOrigin(0.5, 0.5);
        my.text.playerHealth.depth = 12;
        my.text.playerHealth.setScrollFactor(0);

        this.bossHealthOutline = this.drawBar(299, 269, 202, 8, 0xc2c2d1);
        this.bossHealthOutline.depth = 10;
        this.bossHealthOutline.setScrollFactor(0);

        this.bossHealthBG = this.drawBar(300, 270, 200, 6, 0x222323);
        this.bossHealthBG.depth = 11;
        this.bossHealthBG.setScrollFactor(0);

        this.bossHealthBar = this.drawBar(300, 270, 200, 6, 0xeb564b);
        this.bossHealthBar.depth = 12;
        this.bossHealthBar.setScrollFactor(0);

        my.text.bossHealth = this.add.bitmapText(400, 273.5, "pixellari", "Giant Crab").setFontSize(6).setOrigin(0.5, 0.5);
        my.text.bossHealth.depth = 13;
        my.text.bossHealth.setScrollFactor(0);

        this.input.setPollAlways();

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
            maxSize: 500
        });

        this.BossAttackTimer = this.time.addEvent({
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
        this.physics.add.overlap(this.turret, my.sprite.slash, this.handleBossHit, null, this);
    }
    update(time, delta) {
        this.slashCooldown -= delta;
        this.slashTime -= delta;
        if(this.slashTime <= 0){
            my.sprite.slash.setVisible(false);
            my.sprite.slash.setPosition(-350, -350);
        }

        this.rawAngle = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, my.sprite.player.x, my.sprite.player.y);
        if((this.rawAngle >= -Math.PI / 2  && this.rawAngle <= 0) || (this.rawAngle >= 0 && this.rawAngle <= Math.PI / 2)) this.turret.flipX = true;
        else this.turret.flipX = false;

        my.sprite.heartInner.setCrop(0, 0, this.playerHealth / this.maxPlayerHealth * my.sprite.heartInner.width, 8);
        my.text.playerHealth.text = this.playerHealth;

        this.bossHealthBar.scaleX = this.bossHealth / this.maxBossHealth;

        game.input.mousePointer.updateWorldPoint(this.cameras.main);
        this.slashAngle = Phaser.Math.Angle.Between(my.sprite.player.x, my.sprite.player.y, game.input.mousePointer.worldX, game.input.mousePointer.worldY);
        
        if(this.aKey.isDown){
            my.sprite.player.body.setVelocityX(-this.playerSpeed);
            if (this.wKey.isDown) my.sprite.player.body.setVelocityY(-this.playerSpeed);
            else if (this.sKey.isDown) my.sprite.player.body.setVelocityY(this.playerSpeed);
            else my.sprite.player.body.setVelocityY(0);

            if (my.sprite.player.anims.currentAnim.key != "horiWalk" && my.sprite.player.anims.currentAnim.key != "attack") my.sprite.player.play("horiWalk");
        }
        else if(this.dKey.isDown){
            my.sprite.player.body.setVelocityX(this.playerSpeed);
            if (this.wKey.isDown) my.sprite.player.body.setVelocityY(-this.playerSpeed);
            else if (this.sKey.isDown) my.sprite.player.body.setVelocityY(this.playerSpeed);
            else my.sprite.player.body.setVelocityY(0);

            if (my.sprite.player.anims.currentAnim.key != "horiWalk" && my.sprite.player.anims.currentAnim.key != "attack") my.sprite.player.play("horiWalk");
        }
        else if(this.wKey.isDown){
            my.sprite.player.body.setVelocity(0);
            my.sprite.player.body.setVelocityY(-this.playerSpeed);
            if (my.sprite.player.anims.currentAnim.key != "vertWalk" && my.sprite.player.anims.currentAnim.key != "attack") my.sprite.player.play("vertWalk");
        }
        else if(this.sKey.isDown){
            my.sprite.player.body.setVelocity(0);
            my.sprite.player.body.setVelocityY(this.playerSpeed);
            if (my.sprite.player.anims.currentAnim.key != "vertWalk" && my.sprite.player.anims.currentAnim.key != "attack") my.sprite.player.play("vertWalk");
        }
        else{
            my.sprite.player.body.setVelocity(0);
            if(my.sprite.player.anims.currentAnim.key != "attack") my.sprite.player.play("idleAnim");
        }

        if(game.input.activePointer.leftButtonDown()){
            this.playerAttack();
        }

        this.hitOverlay.setPosition(my.sprite.player.x, my.sprite.player.y);
    }

    drawBar(x, y, width, height, color){
        let bar = this.add.graphics();
        bar.fillStyle(color, 1);
        bar.fillRect(0, 0, width, height);

        bar.x = x;
        bar.y = y;

        return bar;
    }

    moveBossCircle() {
        let radius = 100; // Radius of the circular path
        const speed = 0.0005; // Speed of the turret circle
        const angle = this.time.now * speed;
        const wiggleAmp = 0.1; // Amplitude of the wiggle
        const wiggleFreq = 0.02; // Frequency of the wiggle
        const wobble = Math.sin(this.time.now * 0.03) * 4;
        if (this.bossHealth<75)
            {
        if (radius>50)
            {
                radius-=5;
            }
        }
        this.turret.x = this.turret.originalX + radius * Math.cos(angle);
        this.turret.y = this.turret.originalY + radius * Math.sin(angle);
        if (this.bossHealth<75)
            {
                this.turret.x = this.turret.originalX + radius * Math.cos(angle)+wobble;
                this.turret.y = this.turret.originalY + radius * Math.sin(angle)+wobble;
            }
        this.turret.rotation = Math.sin(this.time.now * wiggleFreq) * wiggleAmp;
    }

    //for the turret, can be copied for other things.
    shootBullet() {
        let coneAngle = Phaser.Math.DegToRad(45); // 45 degree cone, feel free to edit this, not sure what's a good feel
        let bulletSpeed = 50; // Bullet speed... seems a little too fast still not sure, need to tweak this too
        let sets = 3;
        let bulletsPerSet = 5;
        let delayBetweenSets = 400; 
        if (this.bossHealth<75)
            {
            coneAngle= Phaser.Math.DegToRad(300);
            sets = 1;
            bulletsPerSet = 40;
            }
        for (let set = 0; set < sets; set++) {
            this.time.delayedCall(set * delayBetweenSets, () => {
                for (let i = 0; i < bulletsPerSet; i++) {
                    //const rawAngle = Phaser.Math.Angle.Between(this.turret.x, this.turret.y, my.sprite.player.x, my.sprite.player.y);
                    let angle = this.rawAngle + Phaser.Math.FloatBetween(-coneAngle / 2, coneAngle / 2);
                    if (this.bossHealth<75)
                        {
                            angle = Phaser.Math.DegToRad(Phaser.Math.Between(0, 360)+ Phaser.Math.FloatBetween(-coneAngle / 2, coneAngle / 2));
                        }
                    const bullet = this.bullets.get(this.turret.x, this.turret.y+10);

                    //if((rawAngle >= -Math.PI / 2  && rawAngle <= 0) || (rawAngle >= 0 && rawAngle <= Math.PI / 2)) this.turret.flipX = true;
                    //else this.turret.flipX = false;

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

    playerAttack(){
    if(this.slashCooldown <= 0){
            my.sprite.player.play("attack");
            my.sprite.player.on('animationcomplete', () => {
                my.sprite.player.play("idleAnim");
            }, this);

            this.slashCooldown = 600;
            this.slashTime = 300;
            my.sprite.slash.setPosition(my.sprite.player.x, my.sprite.player.y);
            my.sprite.slash.setRotation(this.slashAngle - Math.PI/2);
            my.sprite.slash.setVisible(true);
            my.sprite.slash.setVelocity(Math.cos(this.slashAngle) * 200, Math.sin(this.slashAngle) * 200);
    }
    }

    handleBossHit(){
        my.sprite.slash.setPosition(-300, -300);
        my.sprite.slash.setVisible(false);
        my.sprite.slash.setVelocity(0);
        this.bossHealth -= 5;
    }
}