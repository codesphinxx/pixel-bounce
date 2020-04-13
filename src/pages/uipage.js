import Phaser from 'phaser-ce';
import {Config,Assets} from '../const';
import Util from '../util';

export default class UIPage extends Phaser.Group
{
    /**
     * @constructor
     * @param {Phaser.Game} game 
     * @param {String} bgimg
     */
    constructor(game, bgimg)
    {
        super(game);
        this.x = 0;
        this.y = 0;
        this.width = Config.CANVAS_WIDTH;
        this.height = Config.CANVAS_HEIGHT;        
    }    

    show()
    {
        this.visible = true;
    }

    hide()
    {
        this.visible = false;
    }
}