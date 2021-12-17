// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.

export default class LoseCoin {
    constructor(scene, x, y, outcomeDuration) {
        this.scene = scene;

        this.sprite = scene.physics.add.group({       //create dynamic physics group
                key: 'pearl',                         //of pearls
                repeat: 12,                           //creates n+1 children
                setXY: { x: x, 
                         y: y, 
                         stepX: 15                     //scatters children along X
                       }                        
                });

        var losePearls = this.sprite;    

        losePearls.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));  //adds random bounce
            child.setScale(Phaser.Math.FloatBetween(0.6, 0.9));      //adds random scaling
            child.setGravityY(Phaser.Math.FloatBetween(0,300));   //adds random gravity
            child.setCollideWorldBounds(true);  //prevent falling off screen
            });

    //        var timeout = this.time.addEvent({delay: outcomeDuration, 
    //                            callback: function() {loseCoins.visible = false;},
    //                            loop: false});    
    }

    update() {
    }
    
    destroy() {
        var lostPearls = this.sprite.getChildren();
        lostPearls.destroy();
    }

}