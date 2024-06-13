class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        this.load.image("idle", "idle.png");
        this.load.image("vert1", "vert1.png");
        this.load.image("vert2", "vert2.png");
        this.load.image("hori1", "hori1.png");
        this.load.image("hori2", "hori2.png");
        this.load.image("attack1", "attack1.png");
        this.load.image("attack2", "attack2.png");
        this.load.image("slash", "slash.png");
        this.load.image("slash1", "slash1.png");
        this.load.image("slash2", "slash2.png");
        this.load.image("slash3", "slash3.png");
        this.load.image("hit1", "hit1.png");
        this.load.image("hit2", "hit2.png");
        this.load.image("hit3", "hit3.png");
        this.load.image("turret", "turret.png");
        this.load.image("turret2", "turret2.png");
        this.load.image("turretbullet", "turretbullet.png");
        this.load.image("heartOuter", "heartOuter.png");
        this.load.image("heartInner", "heartInner.png");
        this.load.audio('impsound', 'impsound.ogg');
        this.load.audio('lose', 'losesound.wav');
        this.load.audio('boss', 'bosshitsound.wav');
        this.load.audio('hit', 'hitsound.wav');
        this.load.audio('attack', 'wave.wav');

        this.load.bitmapFont("pixellari", "pixellari.png", "pixellari.fnt");

        // Menu assets
        this.load.image("optionBox", "optionBox1.png");
        this.load.image("cursor", "cursor1.png");
        this.load.audio("select", "select_001.ogg");
        this.load.audio("enter", "select_008.ogg");
        

        // Load tilemap information
        this.load.image("tilemap_tiles", "colored_tilemap_packed.png");
        this.load.tilemapTiledJSON("OneOnOneArena", "OneOnOneArena.json");
    }

    create() {
        this.anims.create({
            key: 'idleAnim',
            frames: [
                {key: "idle"}
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'vertWalk',
            frames: [
                {key: "vert1"},
                {key: "vert2"}
            ],
            duration: 300,
            repeat: -1
        });

        this.anims.create({
            key: 'horiWalk',
            frames: [
                {key: "hori1"},
                {key: "hori2"}
            ],
            duration: 300,
            repeat: -1
        });

        this.anims.create({
            key: 'attack',
            frames: [
                {key: "attack1"},
                {key: "attack2"}
            ],
            duration: 300,
            repeat: 0
        });
        this.anims.create({
            key: 'hit',
            frames: [
                {key: "hit1"},
                {key: "hit2"},
                {key: "hit3"}
            ],
            duration: 150,
            repeat: 1
        });
        this.anims.create({
            key: 'change',
            frames: [
                {key: "turret2"},
                {key: "turret"}
            ],
            duration: 800,
            repeat: 3
        });
        /*this.anims.create({
            key: 'slash',
            frames: [
                {key: "slash1"},
                {key: "slash2"},
                {key: "slash3"}
            ],
            duration: 150,
            repeat: 0,
        });*/
        // ...and pass to the next Scene
        this.scene.start("menuScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}