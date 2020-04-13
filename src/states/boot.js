import Phaser from 'phaser-ce';
import GameManager from '../gamemanager';

export default class Boot extends Phaser.State 
{
    preload() 
    {        
        this.load.image('splash', 'assets/img/splash.png');
    }

    create() 
    {
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        this.game.stage.disableVisibilityChange = true;
        this.game.input.mouse.capture = true;
        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.restitution = 0.8;

        this.game.time.advancedTiming = true;
        this.game.time.desiredFps = 60;
        
        this.state.start('Preload');        
    }

    update()
    {
        this.game.elapsed = (Date.now() - this.game.gametime) * 0.001;
        this.game.gametime = Date.now();
    }
}
