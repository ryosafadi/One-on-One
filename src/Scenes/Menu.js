class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");

        // Array to store buttons
        this.buttons = [];
        // Index of currently selected button
        this.selectedButtonIndex = 0;
        // Reference to the button selector image
        this.buttonSelector = null;

    }

    init() {
        // Nothing to initialize
    }

    preload() {
        // Nothing to preload
    }

    create() {
        const { width, height } = this.scale;

        console.log("I'm back"); //debug

        // Define keyboard input keys
        this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cursor
        this.buttonSelector = this.add.image(0, 0, 'cursor');

        // Title text
        const titleText = this.add.bitmapText(width / 2, 100, "pixellari", "One on One").setOrigin(0.5);
        titleText.setFontSize(48); // Set font size to 48 pixels

        // Define button dimensions
        const buttonWidth = 200;
        const buttonHeight = 60;
        const buttonSpacing = 20; // Spacing between buttons

        // Calculate total height of buttons
        const totalButtonHeight = (buttonHeight * 3) + (buttonSpacing * 2);

        // Calculate starting y position for the top button
        const startY = (height - totalButtonHeight) / 2;

        // Play button
        const playButton = this.add.image(width / 2, startY, 'optionBox').setDisplaySize(buttonWidth, buttonHeight);

        this.add.bitmapText(playButton.x, playButton.y, "pixellari", 'Play').setOrigin(0.5).setFontSize(24); // Increased font size to 24 pixels

        playButton.setInteractive();

        // Controls button
        const controlsButton = this.add.image(playButton.x, playButton.y + buttonHeight + buttonSpacing, 'optionBox').setDisplaySize(buttonWidth, buttonHeight);

        this.add.bitmapText(controlsButton.x, controlsButton.y, "pixellari", 'Controls').setOrigin(0.5).setFontSize(24); // Increased font size to 24 pixels

        controlsButton.setInteractive();

        // Credits button
        const creditsButton = this.add.image(controlsButton.x, controlsButton.y + buttonHeight + buttonSpacing, 'optionBox').setDisplaySize(buttonWidth, buttonHeight);

        this.add.bitmapText(creditsButton.x, creditsButton.y, "pixellari", 'Credits').setOrigin(0.5).setFontSize(24); // Increased font size to 24 pixels

        creditsButton.setInteractive();

        // Adds buttons to button array
        this.buttons.push(playButton);
        this.buttons.push(controlsButton);
        this.buttons.push(creditsButton);

        // Set to first option
        this.selectButton(0);

        // Each button goes to a different scene
        playButton.on('selected', () => {
            console.log('play'); // Debug
            this.scene.stop("menuScene");
            this.scene.start("gameScene");
        });

        controlsButton.on('selected', () => {
            console.log('controls'); // Debug
            this.scene.switch("controlsScene");
        });

        creditsButton.on('selected', () => {
            console.log('credits'); // Debug
            this.scene.switch("creditsScene");
        });

        // Clean up events when the scene is destroyed
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            playButton.off('selected');
            controlsButton.off('selected');
            creditsButton.off('selected');
            this.wKey.destroy();
            this.sKey.destroy();
            this.enterKey.destroy();
        });

    }

    selectButton(index) {

        const button = this.buttons[index];

        // Move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5;
        this.buttonSelector.y = button.y + 10;

        // Store the new selected index
        this.selectedButtonIndex = index;

    }

    selectNextButton(change = 1) {

        let index = this.selectedButtonIndex + change;

        // Wrap the index to the front or end of the array
        if (index >= this.buttons.length) {
            index = 0;
        } else if (index < 0) {
            index = this.buttons.length - 1;
        }

        this.selectButton(index);

    }

    confirmSelection() {

        // Get the currently selected button
        const button = this.buttons[this.selectedButtonIndex];

        // Emit the 'selected' event
        button.emit('selected');

    }

    update() {

        if (this.wKey.isDown) {
            if (!this.wKeyProcessed) {
                this.sound.play("select");
                this.selectNextButton(-1);
                this.wKeyProcessed = true;
            }
        } else {
            this.wKeyProcessed = false;
        }

        if (this.sKey.isDown) {
            if (!this.sKeyProcessed) {
                this.sound.play("select");
                this.selectNextButton(1);
                this.sKeyProcessed = true;
            }
        } else {
            this.sKeyProcessed = false;
        }

        if (this.enterKey.isDown) {
            if (!this.enterKeyProcessed) {
                this.sound.play("enter");
                this.confirmSelection();
                this.enterKeyProcessed = true;
            }
        } else {
            this.enterKeyProcessed = false;
        }

    }

}
