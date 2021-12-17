//scene to initialize experiment and record participant ID. routes to instructions scene.

//import some js from Pavlovia lib to enable data saving
import * as data from "../../lib/data-2020.2.js";
import { PsychoJS } from '../../lib/core-2020.2.js';

//initialise PsychoJS object for saving task data
window.psychoJS = new PsychoJS({ debug: true });   //attached to window object so as to be globally available (across scenes)

//initialize vars
var subID;

//this function extends Phaser.Scene and includes the core logic for the scene
export default class EnterID extends Phaser.Scene {
    constructor() {
        super({
            key: 'EnterID',
            autoStart: true
        });
        
        (async function startPsychoJS() {
        // The experiment handler needed to save our data would
        // be inaccessible before this call resolves. Because of
        // a bug in PsychoJS, please make `expInfo` an empty object
        // instead of skipping if not required
        await psychoJS.start({ expName: 'study-game-1', expInfo: {} })
        })();
    }

    preload() {
        //load background image
        this.load.image('background','./assets/imgs/underwater.jpg');
//        //load text enter plugin
//        this.load.plugin('rexinputtextplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexinputtextplugin.min.js', true);
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
                text: this.add.text(0, 0, 'Hi!', {
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
                      "Before you start, please enter your unique ID code.\n\n" +
                      "This is a 7 digit code made up of numbers and letters,\n" +
                      "that for the purposes of this demo you can make up!!\n\n\n\n\n" + 
                                   
                      "Please carefully check the code you entered is correct,\n" +
                      "then click the button below to begin!\n",
                                   
                    {fontSize: "18px",
                     align: 'center'}),
            actions: [
                createLabel(this, 'enter ID')
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
        
        //add text input zone:
        var printText = this.add.text(gameWidth/2, gameHeight/2+20, '', {
                                      fixedWidth: 150, 
                                      fixedHeight: 36,
                                      fontSize: '18px',
                                      color: '#000000',
                                      backgroundColor:  '#ffffff',
                                      align: 'center'
                                      })
        .setOrigin(0.5, 0.5)
        .setInteractive().on('pointerdown', () => {
            this.rexUI.edit(printText)
        });
        
        //control action button functionality (click, hover)
        instr
        .on('button.click', function (button) {
            subID = printText.text;
            if (subID.length == 7) { 
                printText.setColor('#000000');
                //this.registry.set('subID', subID);  //store ID in data registry
                instr.scaleDownDestroy(500);
                this.nextScene();
            }
            else {
                printText.setColor('#FF0000');
            }
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
        window.psychoJS.experiment.addData('subID', subID);
        this.scene.start('InstructionsScene');
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