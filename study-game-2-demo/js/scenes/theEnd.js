//end scene to thank participants for their time

//this function extends Phaser.Scene and includes the core logic for the scene
export default class NextStageScene2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'TheEnd',
            autoStart: true
        });
    }

    preload() {
        this.load.image('shore','./assets/imgs/shore.png');
        this.load.image('boat','./assets/imgs/boat.png');
        
    }
    
    create() {
        //load space pic as background
        var bg = this.add.sprite(0, 0, 'shore')
                          .setOrigin(0,0);
        
        //add popup dialogue box with instructions text
        var instr = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x2F4F4F),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, 'Thank you for your time', {
                    fontSize: '24px'
                    }),
                align: 'center',
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),
            content: this.add.text(0, 0, 
                      "You have now completed this part of the study.\n\n\n\n\n\n\n\n\n\n\n\n" +
                      "Please press the button below to finish.\n",        
                    {fontSize: "18px",
                     align: 'center'}),
            actions: [
                createLabel(this, 'finish game!')
            ],
            space: {
                title: 25,
                content: 10,
                action: 10,
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
            },
            align: {
                actions: 'center',
            },
            expand: {
                content: false, 
            }
            });
        
        //control panel position and layout
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        instr
        .setPosition(gameWidth/2, gameHeight/2)
        .layout()
        .popUp(500);
        
        //add img
        var img = this.add.image(gameWidth/2, gameHeight/2, 'boat');
        
        //control action button functionality (click, hover)
        instr
        .on('button.click', function (button) {
            instr.scaleDownDestroy(500);
            img.destroy();
        }, this)
        .on('button.over', function (button) {
            button.getElement('background').setStrokeStyle(2, 0xffffff);
        })
        .on('button.out', function (button) {
            button.getElement('background').setStrokeStyle();
        });
    }
    
    update(time, delta) {
    }
    
    nextScene() {
    } 
}

//generic function to create button labels
var createLabel = function (scene, text) {
    return scene.rexUI.add.label({
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 40, 20, 0x778899),
        text: scene.add.text(0, 0, text, {
            fontSize: '20px',
            fill: "#000000"
        }),
        align: 'center',
        width: 40,
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
};