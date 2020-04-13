import Phaser from 'phaser-ce';
import {Config,Assets} from '../const';
import GameManager from '../gamemanager';

export default class Preload extends Phaser.State
{
    preload() 
    {
        this.load.onFileComplete.add(this._onfilecomplete, this);
        this.background = this.add.image(0, 0, Config.SPLASH_KEY);
        this.background.width = Config.CANVAS_WIDTH;
        this.background.height = Config.CANVAS_HEIGHT;        

        for (var id in Assets.IMAGES)
        {
            this.load.image(Assets.IMAGES[id].key, Assets.IMAGES[id].path);
        }
        for (var k in Assets.JSON)
        {
            this.load.physics(Assets.JSON[k].key, Assets.JSON[k].path);
        }
        for (var i = 0; i < Assets.ANIMATIONS.length; i++)
        {
            var node = Assets.ANIMATIONS[i];
            this.load.spritesheet(node.key, node.path, node.width, node.height, node.count);
        }
        for (i = 0; i < Assets.SOUNDS.length; i++)
        {
            this.load.audio(Assets.SOUNDS[i].key, Assets.SOUNDS[i].path);
        }
        this.load.bitmapFont('Symtext', 'assets/bitmap/symtext_0.png', 'assets/bitmap/symtext.xml');
    }
    
    create()
    {
        GameManager.initGame();
        this.game.time.events.add(Phaser.Timer.SECOND * 1, () => { 
            GameManager.changeBackground(this.game); 
            this.state.start('Play'); 
        }, this);                 
    }

    update()
    {
        this.game.elapsed = (Date.now() - this.game.gametime) * 0.001;
        this.game.gametime = Date.now();
    }

    _onfilecomplete(progress, cacheKey, success, totalLoaded, totalFiles) 
    {
        
    }

    shutdown()
    {
        this.background.destroy();
        this.background = null;
        delete this.background;
    }
}