import {Config} from '../const';

export default class HeroData
{
    /**
     * @constructor
     * @param {Number} left 
     * @param {Number} right 
     * @param {Object} position 
     * @param {Number} position.x
     * @param {Number} position.y
     */
    constructor(left, right, position)
    {
        this.position = position;
        this.direction = Config.MOVE_DIRECTION.RIGHT;
        this.resetMove();
    }

    moveDown()
    {
        this.position = {x:this.position.x, y:this.position.y + 2.0};
    }

    resetMove()
    {
        this.currentSpeedDown = 0.0;
        this.currentSpeedUp = 7;
        this.jumpSpeed = 0.25;
        this.jumpSpeedDown = 0.3;
        this.isUp = true;
    }

    move()
    {
        if (this.isUp)
        {
            this.currentSpeedUp -= this.jumpSpeed;
            this.currentSpeedDown = 0.0;
            this.position = {x:this.position.x, y:this.position.y - this.currentSpeedUp};
            if (this.position.y <= 0.0)
                this.position = {x:this.position.x, y:0.0};
        }
        if (!this.isUp)
        {
            this.currentSpeedDown += this.jumpSpeedDown;
            this.position = {x:this.position.x, y:this.position.y + this.currentSpeedDown};
        }
        if (this.currentSpeedUp <= 0.0)
        {
            this.isUp = false;
            this.currentSpeedUp = 5.0;
        }
    }
}