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
        this.load.image("slash1", "slash.png");
        this.load.image("hit1", "hit1.png");
        this.load.image("hit2", "hit2.png");
        this.load.image("hit3", "hit3.png");
        this.load.image("turret", "turret.png");
        this.load.image("turretbullet", "turretbullet.png");
        this.load.audio('impsound', 'impsound.ogg');
        

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
            duration: 150,
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
            key: 'slash',
            frames: [
                {key: "slash1"}
            ],
            duration: 150,
            repeat: 0,
        });
        // ...and pass to the next Scene
        this.scene.start("gameScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}