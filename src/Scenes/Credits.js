class Credits extends Phaser.Scene{
    constructor(){
        super("creditsScene");

        this.my = {text: {}};

        // Array to store buttons
        this.buttons = [];
        // Index of currently selected button
        this.selectedButtonIndex = 0;
        // Reference to the button selector image
        this.buttonSelector = null;

    }

    init() {
        // nothing to add in init
    }

    preload() {
        // nothing to add in preload
    }

    create() {
        const { width, height } = this.scale;

        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Cursor
        this.buttonSelector = this.add.image(0, 0, 'cursor');

        // Title text
        const titleText = this.add.bitmapText(width / 2, 100, "pixellari", "Credits").setOrigin(0.5);
        titleText.setFontSize(48); // Set font size to 48 pixels

        // Smaller text under the title
        const thankYouText = this.add.bitmapText(width / 2, 150, "pixellari", "Thank you for playing!").setOrigin(0.5);
        thankYouText.setFontSize(24); // Set font size to 24 pixels

        // Add contributors information
        const creditsText = "Asset Packs Used:\n- Kenny Assets\n\nContributors:\n- Ryo Safadi\n- Mitchell Tai\n- Patrick James Alcantara";
        this.add.bitmapText(game.config.width / 2, game.config.height / 2, "pixellari", creditsText, 32).setOrigin(0.5);

        // Define button dimensions
        const buttonWidth = 200;
        const buttonHeight = 60;

        // Menu button
        const menuButton = this.add.image(width / 2, height - buttonHeight / 2 - 100, 'optionBox').setDisplaySize(buttonWidth, buttonHeight);

        this.add.bitmapText(menuButton.x, menuButton.y, "pixellari", 'Back to Menu').setOrigin(0.5);

        menuButton.setInteractive(); // Ensure interactivity

        // Add the menu button to the buttons array
        this.buttons.push(menuButton);

        // Set the selected button to the menu button
        this.selectButton(0);

        // Handle button click event
        menuButton.on('selected', () => {
            console.log('Back to Menu'); // Debug
            this.scene.switch("menuScene");
        });

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            menuButton.off('selected');
            this.enterKey.destroy();
        }); 

    }

    selectButton(index) {

        const button = this.buttons[index];

        // Move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5;
        this.buttonSelector.y = button.y + 10;

        this.selectedButtonIndex = index;

    }

    confirmSelection() {
        // Get the currently selected button
        const button = this.buttons[this.selectedButtonIndex];

        // Emit the 'selected' event
        button.emit('selected');
    } 

    update(){

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