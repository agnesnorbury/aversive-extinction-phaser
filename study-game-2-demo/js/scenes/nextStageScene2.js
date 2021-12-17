//scene to inform participant they can now progress to the second (final) task stage. routes to second task scene (context B)

//this function extends Phaser.Scene and includes the core logic for the scene
export default class NextStageScene2 extends Phaser.Scene {
    constructor() {
        super({
            key: 'NextStageScene2',
            autoStart: true
        });
    }

    preload() {
        this.load.image('background','./assets/imgs/underwater.jpg')
    }
    
    create() {
        //load space pic as background
        var bg = this.add.sprite(0, 0, 'background')
                          .setOrigin(0,0);
        
        //add popup dialogue box with instructions text
        var instr = this.rexUI.add.dialog({
            background: this.rexUI.add.roundRectangle(0, 0, 400, 400, 20, 0x2F4F4F),
            title: this.rexUI.add.label({
                background: this.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x000000),
                text: this.add.text(0, 0, 'Thank you!', {
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
                      "Press continue to move on to the final underwater zone, \n" +
                      "which leads to the sea shore.\n\n",        
                    {fontSize: "18px",
                     align: 'center'}),
            actions: [
                createLabel(this, 'continue game')
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
        
        //control action button functionality (click, hover)
        instr
        .on('button.click', function (button) {
            this.nextScene();
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
        this.scene.start('PlatformerSceneB');
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