//scene to hold the task, in second context B. routes to 'end of task' scene

//import js game element modules (sprites, ui, outcome animations)
import Player from "../elements/player.js";
import Robot1 from "../elements/robo1.js";
import Robot2 from "../elements/robo2.js";
import RatingPanel from "../elements/ratingPanel.js";
import KeepCoin from "../elements/keepCoin.js";
import LoseCoin from "../elements/loseCoin.js";

//import some js from Pavlovia lib to enable data saving
import * as data from "../../lib/data-2020.2.js";
import { saveTrialData } from '../util.js';

//initialize sizing vars
var gameHeight;
var gameWidth;
var mapHeight;
var mapWidth;
var sf;
var platforms;
//set some global constants
var roboStop=760;
var outcomeDuration=2000;
//initialize timing and response vars
var trialType;
var trialStartTime;
var roboTriggerTime;
var roboTriggerRT;
var roboEncounterTime;
var roboEncounterRT;
var ratingCompleteTime;
var feedback;
var ratingRT;
var rating;
var trialEndTime;
//initialize task flow vars
let roboTriggered=false;
let roboEncountered=false;
let rateWindow=false;
let rated=false;
let kept=false;
let lost=false;
var robo1On=0;
var robo2On=0;
var keepCoinOn=0;
var trial=0;
var trialExp;
var nTrials;
var nCoins;
var scoreText;

//this function extends Phaser.Scene and includes the core logic for the game
export default class PlatformerSceneB extends Phaser.Scene {
    constructor() {
        super({
            key: 'PlatformerSceneB',
            autoStart: true
        });
    }

    preload() {
        ////////////////////PRELOAD GAME ASSETS///////////////////////////////////
        // load tilemap and tileset created using Tiled 
        this.load.tilemapTiledJSON('map2', './assets/tilemaps/spaceWorldB.json'); 
        this.load.image('tiles2', './assets/tilesets/allTilesB.png');

        // load player sprite
        this.load.spritesheet('player', './assets/spritesheets/astro.png', { 
            frameWidth: 88, 
            frameHeight: 110 
        });
        // load robot sprites
        this.load.spritesheet('robo1', './assets/spritesheets/robo1.png', { 
            frameWidth: 170, 
            frameHeight: 160
        });
        this.load.spritesheet('robo2', './assets/spritesheets/robo2.png', { 
            frameWidth: 170,
            frameHeight: 160
        });
        // load spacecoin sprite
        this.load.spritesheet('coin', './assets/spritesheets/coin.png', { 
            frameWidth: 15.8, 
            frameHeight: 16 
        });
        
        //load trial type info from json array
        this.load.json('trialTypes', './assets/trialTypesTest.json');  //for testing
        //this.load.json('trialTypes', './assets/trialTypes.json');
    
    }
    
    create() {
        ////////////////////////CREATE WORLD//////////////////////////////////////
        //game world created in Tiled (https://www.mapeditor.org/) using pixel art sourced from from Open Game Art (https://opengameart.org/)
        // create tilemap
        var map = this.make.tilemap({ key: "map2" });
        var tileset = map.addTilesetImage("tileset2", "tiles2"); //first arg is name you gave the tileset in Tiled

        // set some size scaling variables
        gameHeight = this.sys.game.config.height;
        gameWidth = this.sys.game.config.width;
        mapHeight = map.heightInPixels;
        mapWidth = map.widthInPixels;
        sf = mapHeight/gameHeight;

        // set up scene layers using names set up in Tiled
        const background = map.createDynamicLayer("background", tileset, 0, 0)
        background.displayHeight = gameHeight;
        background.displayWidth = mapWidth/sf;
        platforms = map.createDynamicLayer("platforms", tileset, 0, 0)
        platforms.displayHeight = gameHeight;
        platforms.displayWidth = mapWidth/sf;
        const decs = map.createDynamicLayer("decos", tileset, 0, 0)
        decs.displayHeight = gameHeight;
        decs.displayWidth = mapWidth/sf;
        
        // set up 'collides' property for platform tiles (set in Tiled)
        platforms.setCollisionByProperty({ collides: true });

        // set up object layers using names set in Tiled
        //robot entry point, just spawn location so doesn't need sprite properties:
        const roboEntryPoint = map.findObject("Object Layer 1", 
                                              obj => obj.name === "robo_enter");
        //the other two locations need to collide with player, so need converting to sprites (we want these to span whole height of the game and not move):
        const rTP = map.findObject("Object Layer 1", 
                                   obj => obj.name === "robo_trigger");
        this.roboTriggerPoint = this.physics.add.sprite(rTP.x/sf, rTP.y/sf);
        this.roboTriggerPoint.displayHeight = gameHeight*2; //hack
        this.roboTriggerPoint.immovable = true;
        this.roboTriggerPoint.body.moves = false;
        this.roboTriggerPoint.allowGravity = false;
        //
        const tEP = map.findObject("Object Layer 1", 
                                   obj => obj.name === "trial_end");
        this.trialEndPoint = this.physics.add.sprite(tEP.x/sf, tEP.y/sf);
        this.trialEndPoint.displayHeight = gameHeight*2; //hack
        this.trialEndPoint.immovable = true;
        this.trialEndPoint.body.moves = false;
        this.trialEndPoint.allowGravity = false;
        
        // set the boundaries of the world
        this.physics.world.bounds.width = mapWidth/sf;
        this.physics.world.bounds.height = gameHeight;

        //////////////ADD PLAYER SPRITE////////////////////
        this.player = new Player(this, 0, 300); //(this, spawnPoint.x, spawnPoint.y);
        this.physics.add.collider(this.player.sprite, platforms); //player walks on platforms

        //////////////CONTROL CAMERA///////////////////////
        this.cameras.main.startFollow(this.player.sprite);  //camera follows player
        this.cameras.main.setBounds(0, 0, mapWidth/sf, gameHeight);
        
        /////////////ADD ROBOT SPRITES/////////////////////
        //load these invisibly, then turn on per trial type
        this.robo1 = new Robot1(this, roboEntryPoint.x/sf, roboEntryPoint.y/sf, 
                                robo1On, roboStop); 
        this.physics.add.collider(this.robo1.sprite, platforms);
        this.robo2 = new Robot2(this, roboEntryPoint.x/sf, roboEntryPoint.y/sf, 
                                robo2On, roboStop);
        this.physics.add.collider(this.robo2.sprite, platforms);
        
        ////////////RATINGS ENTRY SLIDER///////////////////
        //UI functionality built using Rex UI plugins for phaser 3 (see https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/). 
        //NB plugins are globally loaded from local min.js src in index.html
        //don't need to preload this, as single event, not animation requiring update()
        //this.ratingsScene = new RatingsScene(this, sliderX, sliderY);
        
        /////////////KEEP COINS ANIMATION//////////////////
        //load invisibly, then turn on per trial type outcome
        this.keepCoins = new KeepCoin(this, roboStop, 160, keepCoinOn);
        
        /////////////LOSE COINS ANIMATION//////////////////
        //don't need to preload this, as single event, not animation requiring update()
        //this.loseCoins = new LoseCoin(this, sliderX, sliderY);

        ///////////FIXED INSTRUCTIONS TEXT/////////////////
        //add help text that has a "fixed" position on the screen
        this.add
            .text(16, 16, "move right to explore the ship!", {
                font: "18px monospace",
                fill: "#ffffff",
                padding: { x: 20, y: 10 },
                backgroundColor: "#000000"
            })
            .setScrollFactor(0);
        //add coin count text that has a "fixed" position on the screen
        if (trial == 0) {
            nCoins = this.registry.get('AcoinsTotal');    //import total from SceneA
        }
//        scoreText = this.add
//            .text(gameWidth-160, 16, "coins: " +nCoins, {
//                font: "18px monospace",
//                fill: "#FFD700",
//                padding: { x: 20, y: 10 },
//                backgroundColor: "#000000"
//            })
//            .setScrollFactor(0);
        
        //////////////////////////CONTROL GAME SEQUENCE///////////////////////////
        //1. check for collision between player and robot trigger point (invisible):
        this.physics.add.collider(this.player.sprite, this.roboTriggerPoint, 
                                  robotEnter, null, this); //if player collides with roboTriggerPoint, perform robotEnter
        
        //2. check for overlap between player and robots:
        this.physics.add.overlap(this.player.sprite, this.robo1.sprite, 
                                  robotEncounter, null, this); //if player overlaps with robo1 sprite, perform robotEncounter
        this.physics.add.overlap(this.player.sprite, this.robo2.sprite, 
                                  robotEncounter, null, this); //if player overlaps with robo2 sprite, perform robotEncounter
        
        //3. check for collsion between player and trial end point (invisible):
        this.physics.add.collider(this.player.sprite, this.trialEndPoint, 
                                  trialEnd, null, this); //if player collides with trialEndPoint, perform trialEnd
        
        //4. also vanish robot sprites when they hit trial end point (invisible):
        this.physics.add.collider(this.robo1.sprite, this.trialEndPoint, 
                                  function(){robo1On = 0;}, null, this);
        this.physics.add.collider(this.robo2.sprite, this.trialEndPoint, 
                                  function(){robo2On = 0;}, null, this);
        
        //set trial type from trial number
        let trialTypes = this.cache.json.get('trialTypes');
        trialType = trialTypes.trialTypesB[trial];
        nTrials = trialTypes.trialTypesB.length;
        
        ///log trial start time
        trialStartTime=this.time.now;

    }
    
    update(time, delta) {
        ///////SPRITES THAT REQUIRE TIME-STEP UPDATING FOR ANIMATION////////
        // allow the player to respond to key presses and move around
        this.player.update();  
        // enable robot animation
        this.robo1.update(robo1On, roboStop);
        this.robo2.update(robo2On, roboStop);
        // enable keep coin animation
        this.keepCoins.update(keepCoinOn);
        
        ////////////MOVE ON TO NEXT SCENE WHEN ALL TRIALS HAVE RUN////////////////
        if (trial == nTrials) {
            this.nextScene();
        }
    }
    
    nextScene() {
        this.registry.set('BcoinsTotal', nCoins);
        this.registry.set('BtrialsTotal', nTrials);
        this.scene.start('TaskEndScene');
    }
    
}

///////////////DEFINE GAME SEQUENCE FUNCTIONS/////////////////////////////////////
//1. when player hits robo trigger point, enter robot
var robotEnter = function () {
    if (!roboTriggered) {
        //get cursor data and RT to trigger robot:
        roboTriggerTime = this.time.now;
        roboTriggerRT = Math.round(roboTriggerTime - trialStartTime);
        roboTriggered=true; //only allow one trigger per trial
        let roboEncountered=false; //make doubly sure this properly reset
        
        //if trial type 3 [CS-], or trial type 4 [CS- cach trial]
        if (trialType == 3 || trialType == 4) {
            robo1On = 1;  //make robot 1 (CS-) sprite visible and moving
        }  
        //if trial type 1 or 2 [CS+], or trial type 5 [CS+ catch trial]
        else if (trialType == 1 || trialType == 2 || trialType == 5) {
            robo2On = 1;  //make robot 2 (CS+) sprite visible and moving
        }
    }       
};

//2. when player encounters robot, pop up ratings dialog
var robotEncounter = function () {
    if (!roboEncountered) {
        //get RT to encounter:
        roboEncounterTime = this.time.now;
        roboEncountered=true; //only allow one encounter per trial
        roboEncounterRT = Math.round(roboEncounterTime - roboTriggerTime);
        //this.player.sprite.body.moves = false;  //freeze player during rating 

        //pop up ratings panel:
        if (!rateWindow) {
          this.ratingPanel = new RatingPanel(this, roboStop, 215, trialType);
          rateWindow = true;                       //only pops up once per trial 

          //display outcome after ratings completed:
          this.events.once('ratingcomplete', function () {
            ratingCompleteTime = this.time.now; 

            //if trial type 3 [CS-]
            if (trialType == 3 && !kept) {
                robo1On = 2;          //robot holds coins
                keepCoinOn = 1;       //and rotating big coin appears
                kept = true;          //only run this sequence once per trial
                feedback = this.add.text(roboStop-160, 215, 
                                             "Great!\nThose coins are safe!", {
                                    font: "24px monospace",
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#000000"
                                });
                rating = this.registry.get('rating');
                nCoins = nCoins + rating;
                rateWindow = false;
                //scoreText.setText('coins: ' + nCoins); //update coin total
            }
            //if trial type 1 [CS+ noUS]
            else if (trialType == 1 && !kept) {
                robo2On = 2;        //robot holds coins
                keepCoinOn = 1;     //and rotating big coin appears
                kept=true;          //only run this sequence once per trial
                feedback = this.add.text(roboStop-160, 215, 
                                             "Great!\nThose coins are safe!", {
                                    font: "24px monospace",
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#000000"
                                });
                rating = this.registry.get('rating');
                nCoins = nCoins + rating;
                rateWindow = false;
                //scoreText.setText('coins: ' + nCoins); //update coin total
            }
            //if trial type 2 [CS+ US]
            else if (trialType == 2 && !lost) {
                //outcome animations:
                robo2On = 5;    //robot turns red and coin loss animation runs
                this.loseCoins = new LoseCoin(this, roboStop-70, 215, outcomeDuration);
                this.physics.add.collider(this.loseCoins.sprite, platforms);
                lost=true;      //only run this sequence once per trial
                feedback = this.add.text(roboStop-240, 215, 
                                             "Oh no!\nYou lost those coins!", {
                                    font: "24px monospace",
                                    fill: "#ffffff",
                                    align: 'center',
                                    padding: { x: 20, y: 10 },
                                    backgroundColor: "#ff0000"
                                });
                rating = this.registry.get('rating');
                rateWindow = false;
            }
            //if trial type 4 [CS- catch trial]
            else if (trialType == 4) {
                rating = this.registry.get('rating');
                rateWindow = false;
            }
            //if trial type 5 [CS+ catch trial]
            else if (trialType == 5) {
                rating = this.registry.get('rating');
                rateWindow = false;
            }   

            //get RT to enter rating
            ratingRT = Math.round(ratingCompleteTime - roboEncounterTime);  

            //with time delay, disappear robot sprites and outcomes:
            let timer = this.time.addEvent({delay: outcomeDuration, 
                                callback: endRoboEncounter,
                                args: [this.player, this.robo1, this.robo2, 
                                       this.keepCoins, this.loseCoins, trialType],
                                loop: false});
          }, this);
        }
    }
};

//2.5 after rating entered and outcome displayed, wrap things up
var endRoboEncounter = function(player, robo1, robo2, keepCoins, loseCoins, trialType) {
    //finish trial with relevant robot animation
    if (trialType == 3) {               //for CS- trial, 
        robo1On = 3;                    //robot runs off R carrying coins
    } 
    if (trialType == 1) {               //for CS+-noUS trial, 
        robo2On = 3;                    //robot runs off R carrying coins
    } 
    if (trialType == 2) {               //for CS+-US trial, 
                                        //do nothing (robot stays where it is)
    }
    if (trialType == 4) {               //for CS- catch trial,
        robo1On = 4;                    //robot runs off R (not carrying coins)
    }
    if (trialType == 5) {               //for CS+ catch trial,
        robo1On = 4;                    //robot runs off R (not carrying coins)
    }
    //destroy feedback and keep outcome sprites
    feedback.destroy();
    keepCoins.destroy();
    //allow trial to end 
    rated = true;                         
    //player.sprite.body.moves = true;    //player can move about again
};
    
//3. when player hits end of scene, start next trial
var context = 'B';
var trialEnd = function () {
    if (rated) {           //only if already entered their rating and seen outcome
        trialEndTime = this.time.now;
        trialExp = trial + this.registry.get('AtrialsTotal');  //convert to whole exp trial no.
        this.registry.set("trial"+trialExp, {trialNo: trialExp, 
                                             trialType: trialType,
                                             context: context,
                                             trialStartTime: trialStartTime,
                                             roboTriggerRT: roboTriggerRT,
                                             roboEncounterRT: roboEncounterRT,
                                             rating: rating,
                                             ratingRT: ratingRT,
                                             trialEndTime: trialEndTime
                                            }); 
        //console.log(this.registry.getAll()); //for debugging
        
        // For the sake of simplicity save data for each trial separately. Operating
        // on the results of `this.registry.getAll()` would require a more involved
        // version of `saveTrialData()` to deal with an extra level of nesting
        saveTrialData(this.registry.get(`trial${trialExp}`));
        
        //iterate trial number
        trial++;                
        
        //reset other trial vars
        roboTriggered=false;    
        roboEncountered=false;
        rateWindow=false;       
        rated=false;
        kept = false;
        lost=false;
        robo1On = 0;          
        robo2On = 0;          
        keepCoinOn = 0;       
        //move to next trial:
        if (!roboTriggered && !roboEncountered && !rateWindow && !rated) {    //safety device to make sure these key variables reset before moving on, otherwise task flow can get stuck on slower internet connections...
            this.scene.restart();
        }
    }   
};

