import Phaser from 'phaser-ce';

const SPIKE_MOVE_SPEED = 8;

export default class Spike extends Phaser.Sprite
{
    /**
     * @param {Phaser.Game} game 
     * @param {Number} x 
     * @param {Number} y 
     * @param {String} key 
     */
    constructor(game, x, y, key, isLeft)
    {        
        super(game, x, y, key);
        
        this.lefty = isLeft || false;
        this.visibleX = isLeft ? 15 : 465;
        this.hiddenX = isLeft ? -20 : 500;
        this.hidden = true;
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

    update()
    {
        if (this.hidden && this.body.x != this.hiddenX)
        {
            this.body.x += ((this.hiddenX - this.body.x) * SPIKE_MOVE_SPEED * this.game.elapsed);            
        }
        else if (!this.hidden && this.body.x != this.visibleX)
        {
            this.body.x += ((this.visibleX - this.body.x) * SPIKE_MOVE_SPEED * this.game.elapsed);
        }
        super.update();
    }

    move(x, y)
    {   
        if (!this.body) return;
        this.body.x = x;
        this.body.y = y;
    }

    hide()
    {
        this.hidden = true;
        this.body.x = this.lefty ? -20 : 500;
    }
}