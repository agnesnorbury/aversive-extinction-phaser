// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.

export default class Player {
    constructor(scene, x, y) {
    this.scene = scene;
    
    // Create animations for the player (from sprite sheet frames)
    const anims=scene.anims;
    //run right:
    anims.create({
        key: 'swim',
        frames: anims.generateFrameNumbers('player', { start: 0, end: 9 }),
        frameRate: 10,  //display 10 frames per second
        repeat: -1      //loop animation
    });
    //idle/waiting:
    anims.create({
        key: 'wait',
        frames: [ {key: 'player', frame: 0}],
        frameRate: 20
    });
 
    // Create the physics-based sprite that we will move around and animate
    this.sprite = scene.physics.add
      .sprite(x, y, 'player', 0)
      .setCollideWorldBounds(true)  //prevent running off edges
      .setBounce(0.1)              //bounce values range [0,1]
      .setDrag(1000, 0);
      //.setMaxVelocity(300, 400);
         
    // Track the arrow keys
    var { LEFT, RIGHT, UP, DOWN} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN
    });    
    }
        
    update() {
        const sprite = this.sprite;
        const cursors = this.keys;
        const velocity = 300;
        const worldGravity = 500;
        //update sprite according keyboard input:
        //for running left/right:
        if (cursors.left.isDown) {
            sprite.setGravity(0, -worldGravity); //float in water
            sprite.setVelocityX(-velocity);      //negative horizontal velocity->move L
            sprite.anims.play('swim', true);
            sprite.flipX=true;                   //mirror flip right running frames
            }
        else if (cursors.right.isDown) {
            sprite.setGravity(0, -worldGravity); //float in water
            sprite.setVelocityX(velocity);       //positive horizontal velocity->move R
            sprite.anims.play('swim', true);
            sprite.flipX=false; 
            }
        else if (cursors.up.isDown) {
            sprite.setGravity(0, -worldGravity); //float in water
            sprite.setVelocityY(-velocity);      //move up
            sprite.anims.play('swim', true);
            sprite.flipX=false; 
            }
        else if (cursors.down.isDown) {
            sprite.setGravity(0, -worldGravity); //float in water
            sprite.setVelocityY(velocity);       //move down
            sprite.anims.play('swim', true);
            sprite.flipX=false; 
            }
        else {
            sprite.setGravity(0, -worldGravity); //float in water
            sprite.setVelocityX(0);              //0 horizontal velocity->still
            sprite.anims.play('wait');
            }
    }
    
    destroy() {
        this.sprite.destroy();
    }

}