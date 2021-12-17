//task end scene to inform participants they have finished the task, and route them to the post-task questions

//import some js from Pavlovia lib to enable data saving
import * as data from "../../lib/data-2020.2.js";

//this function extends Phaser.Scene and includes the core logic for the scene
export default class TaskEndScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'TaskEndScene',
            autoStart: true
        });
    }

    preload() {
        this.load.image('background','./assets/imgs/shore.jpg')
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
                text: this.add.text(0, 0, 'Congratulations!', {
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
                      "You managed to reach the shore with enough pearls to trade \n"+
                      "for your passage home!\n\n" +

                      "Thank you for playing.\n\n" +

                      "We will now ask you to answer a few short questions about \n" +
                      "the game.\n\n" +

                      "Press next to answer the questions and finish up the task.\n\n" ,        
                    {fontSize: "18px",
                     align: 'center'}),
            actions: [
                createLabel(this, 'next')
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
            instr.scaleDownDestroy(500);
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
        //console.log(psychoJS);         //check passing PsychoJS exp object between scenes worked
        this.scene.start('PostTaskQuestions');
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