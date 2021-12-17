// import js modules that hold the game/experiment scenes
import EnterID from "./scenes/enterID.js";
import InstructionsScene from "./scenes/instructionsScene.js";
import PlatformerSceneA from "./scenes/platformerSceneA.js";
import NextStageScene1 from "./scenes/nextStageScene1.js";
import MidTaskQuestions from "./scenes/midTaskQuestions.js";
import NextStageScene2 from "./scenes/nextStageScene2.js";
import PlatformerSceneB from "./scenes/platformerSceneB.js";
import TaskEndScene from "./scenes/taskEndScene.js";
import PostTaskQuestions from "./scenes/postTaskQuestions.js";
import TheEnd from "./scenes/theEnd.js";

// create the phaser game, based on the following config
const config = {
    type: Phaser.AUTO,           //how will this be rendered? webGL if available, otherwise canvas
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',       //add light-weight physics to world
        arcade: {
            gravity: { y: 500 }, //need some gravity for a side-scrolling platformer
            debug: false         //turn on to help debug game physics
        }
    },
    parent: 'game-container',    //ID of the DOM element to add the canvas to
    dom: {
        createContainer: true    //to allow text input DOM element
    },
    backgroundColor: "#222222",
    scene: [EnterID,
            InstructionsScene, 
            PlatformerSceneA, 
            NextStageScene1,
            MidTaskQuestions,
            NextStageScene2,
            PlatformerSceneB, 
            TaskEndScene,
            PostTaskQuestions,
            TheEnd
            ], 
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: rexuiplugin, //load the UI plugins here for all scenes
            mapping: 'rexUI'
        }]
    }
};

var game = new Phaser.Game(config); //create new game with config as above

if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    alert("Sorry, this game does not work on mobile devices");  //test this works!
}
