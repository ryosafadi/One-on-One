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
            repeat: -1
        });
    
        // ...and pass to the next Scene
        this.scene.start("gameScene");
    }

    // Never get here since a new scene is started in create()
    update() {
    }
}