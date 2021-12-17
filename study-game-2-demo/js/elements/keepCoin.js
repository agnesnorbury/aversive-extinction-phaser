// Creates, animates and moves a sprite in response to arrow keys. Call its update method from the scene's update and call its destroy method when you're done with the player.

export default class KeepCoin {
    constructor(scene, x, y, keepCoinOn) {
        this.scene = scene;

        scene.anims.create({
            key: 'openShell',
            frames: scene.anims.generateFrameNumbers('clam', { start: 0, end: 3 }),
            frameRate: 10,  //display 10 frames per second
            repeat: -1      //loop animation
        });

        this.sprite = scene.add.sprite(x, y, 'clam')
            .setScale(2)
            .setDepth(1000)
            //.setScrollFactor(0)
            .play('openShell');
    }

    update(keepCoinOn) {
        const openClam = this.sprite;
        openClam.visible = false;   
        
        if (keepCoinOn == 1 ) {
            openClam.visible = true;          
            }
    }
    
    destroy() {
        this.sprite.destroy();
    }

}