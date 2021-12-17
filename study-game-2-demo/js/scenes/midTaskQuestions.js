//scene to hold mid-task questions. routes to 'next stage' scene introducing second stage of task.

//import js game element modules (sprites, ui, outcome animations)
import QuestionPanel from "../elements/questionPanel.js";

//import some js from Pavlovia lib to enable data saving
import * as data from "../../lib/data-2020.2.js";
import { saveTrialData } from '../util.js';

//initialize vars
var img;

//this function extends Phaser.Scene and includes the core logic for the scene
export default class MidTaskQuestions extends Phaser.Scene {
    constructor() {
        super({
            key: 'MidTaskQuestions',
            autoStart: true
        });
    }

    preload() {
        //preload background image
        this.load.image('background','./assets/imgs/underwater.jpg')
        //preload robot and coin sprites
        this.load.spritesheet('robo1', './assets/spritesheets/crab1.png', { 
            frameWidth: 170, 
            frameHeight: 160
        });
        this.load.spritesheet('robo2', './assets/spritesheets/crab2.png', { 
            frameWidth: 170,
            frameHeight: 160
        });
        this.load.spritesheet('pearl', './assets/spritesheets/pearl.png', { 
            frameWidth: 15.8, 
            frameHeight: 16 
        });
    }
    
    create() {
        //load space pic as background and get size vars
        var bg = this.add.sprite(0, 0, 'background')
                         .setOrigin(0, 0);
        var gameHeight = this.sys.game.config.height;
        var gameWidth = this.sys.game.config.width;
        
        //let's do this a long-winded way for easiness...[should be a function]
        var gamePhase = 'midTask';
        ///////////////////QUESTION ONE////////////////////
        var mainTxt = 'What do you think about this creature?\n\n\n\n\n\n\n\n\n\n'+
                      'Please rate them from 0 to 100\n'+ 
                      'on the scale below, where\n\n'+
                      '  0 =            and           100 = \n'+  
                      '"definitely slippery"         "definitely safe"'
        var questionNo = 1;
        
        this.questionPanel = new QuestionPanel(this, gameWidth/2, gameHeight/2, 
                                               gamePhase, questionNo, mainTxt);
        img = this.add.image(gameWidth/2, gameHeight/2-75, 'robo1');
        
        ///////////////////QUESTION TWO////////////////////
        this.events.on(gamePhase+'question1complete', function () {
            saveTrialData(this.registry.get(`${gamePhase}question${questionNo}`));
            img.destroy();
            mainTxt = 'How sure were you about your last answer?\n'+
                      '(whether this creature had slippery claws)\n\n\n\n\n\n\n\n\n'+
                      'Please rate from 0 to 100\n'+ 
                      'on the scale below, where\n\n'+
                      '  0 =            and           100 = \n'+  
                      '"not at all sure"            "completely sure"'
            questionNo = 2;
            
            this.questionPanel = new QuestionPanel(this, gameWidth/2, gameHeight/2, 
                                                   gamePhase, questionNo, mainTxt);
            img = this.add.image(gameWidth/2, gameHeight/2-75, 'robo1');
        }, this);
        
        ///////////////////QUESTION THREE////////////////////
        this.events.on(gamePhase+'question2complete', function () {
            saveTrialData(this.registry.get(`${gamePhase}question${questionNo}`));
            img.destroy();
            mainTxt = 'What do you think about this creature?\n\n\n\n\n\n\n\n\n\n'+
                      'Please rate them from 0 to 100\n'+ 
                      'on the scale below, where\n\n'+
                      '  0 =            and           100 = \n'+  
                      '"definitely slippery"         "definitely safe"'
            questionNo = 3;
            
            this.questionPanel = new QuestionPanel(this, gameWidth/2, gameHeight/2, 
                                                   gamePhase, questionNo, mainTxt);
            img = this.add.image(gameWidth/2, gameHeight/2-75, 'robo2');
        }, this);
        
        ///////////////////QUESTION FOUR////////////////////
        this.events.on(gamePhase+'question3complete', function () {
            saveTrialData(this.registry.get(`${gamePhase}question${questionNo}`));
            img.destroy();
            mainTxt = 'How sure were you about your last answer?\n'+
                      '(whether this creature had slippery claws)\n\n\n\n\n\n\n\n\n'+
                      'Please rate from 0 to 100\n'+ 
                      'on the scale below, where\n\n'+
                      '  0 =            and           100 = \n'+  
                      '"not at all sure"            "completely sure"'
            questionNo = 4;
            
            this.questionPanel = new QuestionPanel(this, gameWidth/2, gameHeight/2, 
                                                   gamePhase, questionNo, mainTxt);
            img = this.add.sprite(gameWidth/2, gameHeight/2-75, 'robo2');
        }, this); 
        
        ///////////////////QUESTION FIVE////////////////////
        this.events.on(gamePhase+'question4complete', function () {
            saveTrialData(this.registry.get(`${gamePhase}question${questionNo}`));
            img.destroy();
            mainTxt = ' How much did you want to avoid losing pearls? \n\n\n\n\n\n'+
                      'Please rate from 0 to 100\n'+ 
                      'on the scale below, where\n\n'+
                      '   0 =              and          100 = \n'+  
                      '"not at all"                     "a lot"  '
            questionNo = 5;
            
            this.questionPanel = new QuestionPanel(this, gameWidth/2, gameHeight/2, 
                                                   gamePhase, questionNo, mainTxt);
            img = this.add.image(gameWidth/2, gameHeight/2-75, 'pearl')
                           .setScale(0.9);
        }, this);
        
        //end scene
        this.events.on(gamePhase+'question5complete', function () {
            img.destroy();
            saveTrialData(this.registry.get(`${gamePhase}question${questionNo}`));
            this.nextScene();
        }, this);
        
    }
        
    update(time, delta) {
    }
    
    nextScene() {
        this.scene.start('NextStageScene2');
    } 
}
