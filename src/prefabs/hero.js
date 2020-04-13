import Phaser from 'phaser-ce';
import HeroData from '../models/herodata';

const VELOCITY = 225; 

export default class Hero extends Phaser.Sprite
{
    /**
     * @param {Phaser.Game} game 
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} key 
     */
    constructor(game, x, y, key)
    {        
        super(game, x, y, key);

        this.smoothed = false;
        this.score = 0;
        this.ready = false;
        this.model = new HeroData(0, 480, {x:x, y:y});
    }

    update()
    {   
        if (this.ready && this.body)
        {
            this.model.move();
            this.body.y = this.model.position.y;
            this.body.velocity.x = VELOCITY * this.model.direction;
        }
        super.update();        
    }

    doom()
    {
        this.alive = false;
        this.ready = false;
        this.frame = 2;
        this.alpha = 0;        
    }

    flip()
    {
        this.scale.x *=-1;
        this.score++;
        this.body.velocity.y = 0;
        this.model.direction *= -1; 
    }

    /**
     * @param {Object} position 
     * @param {Number} position.x
     * @param {Number} position.y 
     */
    refresh(position)
    {
        this.alive = true;       
        this.score = 0;
        this.scale.x *=-1;
        this.frame = 3;
        this.x = position.x;
        this.y = position.y;
        this.body.angularVelocity = 0;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }
}