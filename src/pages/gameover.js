import Phaser from 'phaser-ce';
import {Config,Assets} from '../const';
import UIPage from './uipage';
import GameManager from '../gamemanager';

export default class GameoverPage extends UIPage
{
    /**
     * @constructor
     * @param {Phaser.Game} game
     */
    constructor(game)
    {
        super(game);

        this.bmd = game.add.bitmapData(Config.CANVAS_WIDTH, Config.CANVAS_HEIGHT);
        this.bmd.rect(0, 0, Config.CANVAS_WIDTH, Config.CANVAS_HEIGHT, 'rgba(0,0,0,0.45)');
        this.background = game.add.image(0, 0, this.bmd);

        /*this.back = game.add.button(10, 20, Assets.ANIMATIONS[6].key, null, null, 0, 0, 1);
        this.back.onInputDown.add(this._onbackpressed, this);
        this.back.smoothed = false;*/

        this.gameover = game.add.bitmapText(0, 80, Config.FONT_KEY, Config.TEXT.GAMEOVER, 80);
        this.gameover.centerX = game.world.centerX;
        
        var posy = this.gameover.y + this.gameover.height + 30;
        this.score_label = game.add.bitmapText(0, posy, Config.FONT_KEY, Config.TEXT.SCORE, 54);
        this.score_label.centerX = game.world.centerX;

        posy = this.score_label.y + this.score_label.height + 15;
        this.score_value = game.add.bitmapText(0, posy, Config.FONT_KEY, '0', 100);
        this.score_value.centerX = game.world.centerX;
        
        posy = this.score_value.y + this.score_value.height + 55;
        this.hiscore_label = game.add.bitmapText(0, posy, Config.FONT_KEY, Config.TEXT.HISCORE, 54);
        this.hiscore_label.centerX = game.world.centerX;

        posy = this.hiscore_label.y + this.hiscore_label.height + 15;
        this.hiscore_value = game.add.bitmapText(0, posy, Config.FONT_KEY, '0', 100);
        this.hiscore_value.centerX = game.world.centerX;

        this.playagain = game.add.button(0, 520, Assets.ANIMATIONS[2].key, null, null, 0, 0, 1);
        this.playagain.onInputDown.add(this._onplaypressed, this);
        this.playagain.centerX = game.world.centerX;
        this.playagain.smoothed = false;

        this.share = game.add.button(0, 620, Assets.ANIMATIONS[1].key, null, null, 0, 0, 1);
        this.share.onInputDown.add(this._onsharepressed, this);
        this.share.centerX = game.world.centerX;
        this.share.smoothed = false;

        this.sfx_click = game.add.sound(Assets.SOUNDS[0].key);

        this.add(this.background, false, 0);
        this.addMultiple([this.gameover, this.score_label, this.score_value, this.hiscore_label, this.hiscore_value]);
        this.addMultiple([this.playagain,this.share]);
        this.visible = false;        
    }

    start(score, hiscore)
    {
        this.score_value.text = score;
        this.score_value.centerX = this.game.world.centerX;

        this.hiscore_value.text = hiscore;
        this.hiscore_value.centerX = this.game.world.centerX;

        this.show();
    }

    _onbackpressed()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        setTimeout(()=>{ this.game.state.start('Home'); },300);
    }

    _onplaypressed()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        GameManager.changeBackground(this.game);
        setTimeout(()=>{ this.game.state.restart(true);  },300);
    }

    _onsharepressed()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        var url = 'https://twitter.com/intent/tweet?text=';
        url += `Check out my score on Pixel Bounce ${this.score_value.text}!&hashtags=pixelbounce,html5game`;
        url += '&url=' + window.location.href;

        window.open(url,'tweet','toolbar=0,status=0,width=580,height=325');
    }

    destroy()
    {
        this.gameover.destroy();
        this.gameover = null;
        delete this.gameover;

        this.score_label.destroy();
        this.score_label = null;
        delete this.score_label;

        this.score_value.destroy();
        this.score_value = null;
        delete this.score_value;

        this.hiscore_label.destroy();
        this.hiscore_label = null;
        delete this.hiscore_label;

        this.hiscore_value.destroy();
        this.hiscore_value = null;
        delete this.hiscore_value;

        this.playagain.destroy();
        this.playagain = null;
        delete this.playagain;

        this.share.destroy();
        this.share = null;
        delete this.share;

        this.bmd.destroy();
        this.bmd = null;
        delete this.bmd;

        this.background.destroy();
        this.background = null;
        delete this.background;

        super.destroy();
    }
}