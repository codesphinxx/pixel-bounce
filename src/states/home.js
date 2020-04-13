import Phaser from 'phaser-ce';
import {Config,Assets} from '../const';
import GameManager from '../gamemanager';

export default class Home extends Phaser.State
{
    create()
    {
        this.background = this.add.image(0, 0, Assets.IMAGES.BACKGROUND.key);
        this.background.tint = parseInt(GameManager.backgroundColor.replace('#', '0x'));

        this.version = this.add.bitmapText(10, 10, Config.FONT_KEY, Config.TEXT.VERSION.replace('<0>', __VERSION__), 20);
        this.version.smoothed = false;
        
        this.title = this.add.image(0, 120, Assets.IMAGES.TITLE.key);
        this.title.centerX = this.world.centerX;
        this.title.smoothed = false;
        
        this.buttonsound = this.add.button(445, 40, GameManager.sound ? Assets.IMAGES.SOUND_ON.key : Assets.IMAGES.SOUND_OFF.key);
        this.buttonsound.onInputDown.add(this._onsounddown, this);
        this.buttonsound.onInputUp.add(this._onsoundup, this);
        this.buttonsound.onInputOver.add(this._oninputover.bind(this.buttonsound), this);
        this.buttonsound.onInputOut.add(this._oninputout.bind(this.buttonsound), this);
        this.buttonsound.anchor.setTo(0.5);
        this.buttonsound.smoothed = false;
        this.buttonsound.visible = false;

        this.bitme = this.add.sprite(0, 235, Config.ANIMS.BITAVATAR);
        this.bitme.centerX = this.world.centerX;
        this.bitme.animations.add('idle', [0]);
        this.bitme.animations.add('blink', [1,2,3,4]);
        this.bitme.animations.add('dblink', [1,2,3,4,5,6,7,0]);
        this.bitme.animations.play('idle', 10, true);
        this.bitme.smoothed = false;
        this.bitme.inputEnabled = true;
        this.bitme.events.onInputDown.add(this._onbitmetap, this);

        this.playgame = this.add.button(0, 510, Assets.ANIMATIONS[3].key, null, null, 0, 0, 1);
        this.playgame.onInputDown.add(this._onplay, this);
        this.playgame.centerX = this.world.centerX;
        this.playgame.smoothed = false;

        this.twitter = this.add.button(480, 40, Assets.IMAGES.TWITTER.key);
        this.twitter.onInputDown.add(this._ontwitter, this);
        this.twitter.centerX = this.world.centerX;
        this.twitter.onInputOver.add(this._oninputover.bind(this.twitter), this);
        this.twitter.onInputOut.add(this._oninputout.bind(this.twitter), this);
        this.twitter.anchor.setTo(0.5);
        this.twitter.smoothed = false;

        this.sfx_click = this.game.add.sound(Assets.SOUNDS[0].key);
        this.game.time.events.loop(3000, this._onblink, this);
    }

    update()
    { 
        this.game.elapsed = (Date.now() - this.game.gametime) * 0.001;
        this.game.gametime = Date.now();
    }  
    
    _onbitmetap()
    {
        GameManager.changeBackground(this.game);
        this.background.tint = parseInt(GameManager.backgroundColor.replace('#', '0x'));
    }

    _onblink()
    {
        var rvalue = this.game.rnd.integerInRange(0, 10);
        if (rvalue % 2 !== 0)
            this.bitme.animations.play('blink', 10, false);
        else
            this.bitme.animations.play('dblink', 10, false);
    }    

    _onsounddown()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        GameManager.sound = !GameManager.sound;
        GameManager.saveProfile();
    }

    _onsoundup()
    {
        this.buttonsound.loadTexture(GameManager.sound ? Assets.IMAGES.SOUND_ON.key : Assets.IMAGES.SOUND_OFF.key);
    }   

    _oninputover(button)
    {
        button.scale.setTo(1.1);
    }

    _oninputout(button)
    {
        button.scale.setTo(1);
    }

    _onplay()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        setTimeout(()=>{
            this.state.start('Play');
        },300);        
    }

    _ontwitter()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        let url = 'https://twitter.com/intent/follow?original_referer=http%3A%2F%2Fcyclewars.io%2Fsocial-box%2F&ref_src=twsrc%5Etfw&screen_name=codesphinx';
        window.open(url,'cyclewars.io (@codesphinx)','toolbar=0,status=0,width=500,height=600');
    }

    shutdown()
    {
        this.sfx_click.destroy();
        this.sfx_click = null;
        delete this.sfx_click;

        this.version.destroy();
        this.version = null;
        delete this.version;

        this.title.destroy();
        this.title = null;
        delete this.title;

        this.bitme.destroy();
        this.bitme = null;
        delete this.bitme;

        this.buttonsound.destroy();
        this.buttonsound = null;
        delete this.buttonsound;

        this.playgame.destroy();
        this.playgame = null;
        delete this.playgame;

        this.twitter.destroy();
        this.twitter = null;
        delete this.twitter;

        super.shutdown(this.game);
    }
}