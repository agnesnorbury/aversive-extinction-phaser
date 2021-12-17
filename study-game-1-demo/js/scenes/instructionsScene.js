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
        //space background
        this.load.image('background','./assets/imgs/space.jpg')
//        //preload text md plugin
//        this.load.plugin('rexbbcodetextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/1f62ca72baa7b3ae6c21e61463db15035b744861/dist/rexbbcodetextplugin.min.js', true);
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
                      "You are stranded on a spaceship, and need to reach your escape\n" +
                      "pod with enough space coins to power your journey back to Earth.\n\n" +

                      "On your way, you will encounter [color=#f57f17]different kinds of robot[/color], who\n" +
                      "you will need to [color=#f57f17]help you transport the coins[/color].\n\n" +

                      "Unfortunately, [color=#f57f17]some of the robots are faulty[/color], meaning there is\n" +
                      "a chance they will drop and lose the precious coins!\n\n" +

                      "As you travel through different parts of the ship,\n" +
                      "[color=#f57f17]your job is to predict how likely you think\n" +
                      "each robot is to keep the coins safe.[/color]\n\n" +

                      "You can move about the ship [u]using the arrow keys[/u] on your keyboard.\n\n" +
                      "Move [u]right[/u] to explore!\n\n", 
                                            
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