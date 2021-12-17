//scene to inform participants of task instructions. routes to first task stage scene (context A)

//this function extends Phaser.Scene and includes the core logic for the scene
export default class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'InstructionsScene',
            autoStart: true
        });
    }

    preload() {
        //preload underwater image
        this.load.image('background','./assets/imgs/underwater.jpg')
//        //preload text md plugin
//        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js', true);
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
                text: this.add.text(0, 0, 'Welcome!', {
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
            content: this.rexUI.add.BBCodeText(0, 0, 
                      "You have been shipwrecked, and need to try and reach \n" +
                      "the shore with enough pearls to trade for your passage home.\n\n" +

                      "On your way, you will encounter [color=#cb4335]different kinds of sea creatures[/color],\n" +
                      "who you will need to [color=#cb4335]help you carry the pearls[/color].\n\n" +

                      "Unfortunately, [color=#cb4335]some of the sea creatures have slippery claws[/color], so\n" +
                      "there is a chance they will drop and lose your precious pearls!\n\n" +

                      "As you travel through different parts of the ocean, your job\n" +
                      "is to [color=#cb4335]to predict how likely you think it is that each creature\n" +
                      "you meet will be able to safely carry your pearls[/color].\n\n" +
//                      "If you think a creature will keep your pearls safe, you should give\n" +
//                      "them as many pearls as possible. However, if you think a creature\n" +
//                      "will drop your pearls, you should give them as few as possible.\n\n" +

                      "You can swim through the ocean using the [u]arrow keys[/u]\n" +
                      "on your keyboard.\n\n" +               
                      "Swim to the [u]right[/u] to explore!\n\n",
                                   
                    {fontSize: "18px",
                     align: 'center',
                     underline: {color: '#000',
                                 offset: 6,
                                 thickness: 3}}),
            actions: [
                createLabel(this, 'start game')
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
            this.registry.set('expStartTime', this.time.now);  //set start time as global var
            instr.scaleDownDestroy(500);
            let timer = this.time.addEvent({delay: 1000, 
                                            callback: this.nextScene(),
                                            loop: false});
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
        this.scene.start('PlatformerSceneA');
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