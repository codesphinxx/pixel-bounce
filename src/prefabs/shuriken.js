import Phaser from 'phaser-ce';

export default class Shuriken extends Phaser.Sprite
{
    /**
     * @param {Phaser.Game} game  
     * @param {String} key 
     */
    constructor(game, key)
    {        
        super(game, 0, 0, key);

        this.ready = false;
        this.movingDown = true;
        this.movingRight = false;
        this.margin = new Phaser.Rectangle(0, 0, 480, 820);
        var pos = this.generatePosition();
        this.x = pos.x;
        this.y = pos.y;

        this.SHURIKEN_MOVE_SPEED = 0.55;
    }

    /**
     * @param {Phaser.Physics.P2.CollisionGroup} collisionGroup 
     * @param {String} collisionCategory 
     */
    createBody(polygonKey, collisionGroup, collidesWith, collisionCategory)
    {
        this.body.static = true;
        this.body.category = collisionCategory;
        this.body.clearShapes();
        this.body.loadPolygon('physicsData', polygonKey);
        this.body.setCollisionGroup(collisionGroup);
        this.body.collides(collidesWith);
    }

    generatePosition()
    {
        this.movingRight = Math.next(0, 10) % 2 != 0 ? true : false;
        var posX = this.movingRight ? this.margin.left - this.width : this.margin.right + (this.width * 2);
        var posY = Math.next(this.margin.top, this.margin.bottom);
        return {x:posX, y:posY};
    }

    activate()
    {
        this.ready = true;
    }

    update()
    {
        if (this.ready)
        {
            var newPosition = {x:Number(this.body.x), y:Number(this.body.y)};

            if (this.movingDown)
            {
                if (newPosition.y >= this.margin.bottom)
                {
                    this.movingDown = false;
                }
            }
            else
            {
                if (newPosition.y <= this.margin.top)
                {
                    this.movingDown = true;
                }
            }

            var posx = this.movingRight ? newPosition.x + this.SHURIKEN_MOVE_SPEED : newPosition.x - this.SHURIKEN_MOVE_SPEED;
            var posy = this.movingDown ? newPosition.y + this.SHURIKEN_MOVE_SPEED : newPosition.y - this.SHURIKEN_MOVE_SPEED;

            if (posx >= this.margin.right) this.movingRight = false;
            else if (posx <= this.margin.left) this.movingRight = true;

            posx = Math.clamp(posx, this.margin.left, this.margin.right);
            posy = Math.clamp(posy, this.margin.top, this.margin.bottom);
            
            this.body.angle += 2;
            this.body.x = posx;
            this.body.y = posy; 
        }
        super.update();
    }
}