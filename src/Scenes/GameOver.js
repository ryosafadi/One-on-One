class GameOver extends Phaser.Scene{
    constructor(){
        super("gameOverScene");

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

        // Add "You Died!" text at the top center
        this.add.bitmapText(width / 2, 50, "pixellari", "You Died!", 48).setOrigin(0.5);

        // Register 'ENTER' key
        this.enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

        // Cursor
        this.buttonSelector = this.add.image(0, 0, 'cursor');

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
      /*  menuButton.on('selected', () => {
            console.log('Back to Menu'); // Debug
        });

      this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            menuButton.off('selected');
            this.enterKey.destroy();
        }); */

    }

    selectButton(index) {

        const button = this.buttons[index];

        // Move the hand cursor to the right edge
        this.buttonSelector.x = button.x + button.displayWidth * 0.5;
        this.buttonSelector.y = button.y + 10;

        this.selectedButtonIndex = index;

    }

    update(){

        if (this.enterKey.isDown) {
            this.sound.play("enter");
            this.scene.switch("menuScene");
        }
    }

}