import Phaser from 'phaser-ce';
import {Config,Assets} from '../const';
import GameManager from '../gamemanager';
import Hero from '../prefabs/hero';
import GameoverPage from '../pages/gameover';
import Spike from '../prefabs/spike';
import Shuriken from '../prefabs/shuriken';

const HARD_MODE_SCORE = 10;
const SHURIKEN_CHANGE_SCORE = 15;
const GRAVITY_DEFAULT = 25;
const GRAVITY_INCREASE_RATE = 1;
const MIN_GRAVITY = 25;
const MAX_GRAVITY = 50;
const MIN_SPIKE = 1;
const MAX_SPIKE = 9;
const SHURIKEN_MIN_SPIKE = 4;
const SHURIKEN_MAX_SPIKE = 8;
const MIN_SHURIKEN = 1;
const MAX_SHURIKEN = 5;
const SHURIKEN_SPEED_INCREASE = 0.05;

export default class Play extends Phaser.State
{
    create()
    {
        this.background = this.add.image(0, 0, Assets.IMAGES.BACKGROUND.key);
        this.background.tint = parseInt(GameManager.backgroundColor.replace('#', '0x'));

        this.playStatus = Config.PLAY_STATE.STARTING;
        this.activeSpikeCount = MIN_SPIKE;
        this.activeShurikenCount = 0;
        this.totalGameTime = 0;

        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.gravity.x = GRAVITY_DEFAULT;
        
        this.heroCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.borderCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.dangerCollisionGroup = this.game.physics.p2.createCollisionGroup();

        var bounds = new Phaser.Rectangle(0, 0, Config.CANVAS_WIDTH, Config.CANVAS_HEIGHT);
        this.borders = { left: null, right: null, top: null, bottom: null };
        this._createworldbounds(bounds.x, bounds.y, bounds.width, bounds.height);
       
        this.hero = new Hero(this.game, Config.HERO_POSITION.x, Config.HERO_POSITION.y, Config.ANIMS.BITME);
        //this.hero.animations.add('idle', [3]);
        this.hero.animations.add('move', [1]);
        this.hero.animations.add('blink', [4,5,6,7]);
        this.hero.animations.add('dblink', [4,5,6,7,8,9,9,10,11]);
        //this.hero.animations.play('idle', 10, false);

        this.floor = this.add.sprite(240, Config.CANVAS_HEIGHT - (Assets.IMAGES.FLOOR.height * 0.5), Assets.IMAGES.FLOOR.key);
        this.ceiling = this.add.sprite(240, 30, Assets.IMAGES.CEILING.key);
        this.game.physics.p2.enable([this.hero, this.floor, this.ceiling]);
        
        this.score = this.add.bitmapText(0, 90, Config.FONT_KEY, 0, 200);
        this.score.centerX = this.world.centerX;
        this.score.visible = false;
        this.score.smoothed = false;
        this.score.alpha = 0.65;

        this.view = this.game.add.group();
        this.view.width = 495;
        this.view.add(this.hero);
                
        this.hero.body.static = true
        this.hero.body.category = Config.PHYSICS.HERO;
        this.hero.body.clearShapes();
        this.hero.body.loadPolygon('physicsData', 'BitMePhysics'); 
        this.hero.body.setCollisionGroup(this.heroCollisionGroup);
        this.hero.body.collides([this.borderCollisionGroup, this.dangerCollisionGroup], this._oncollision, this);
        this.hero.body.onBeginContact.add(this._onphysicscontact, this); 
        
        this.dummy = this.add.sprite(Config.HERO_POSITION.x, Config.HERO_POSITION.y, '');
        this.game.physics.p2.enable([this.dummy]);
        
        this.floor.body.static = true;
        this.floor.body.category = Config.PHYSICS.DEADLY;
        this.floor.body.clearShapes();
        this.floor.body.loadPolygon('physicsData', 'Floor');
        this.floor.body.setCollisionGroup(this.dangerCollisionGroup);
        this.floor.body.collides(this.heroCollisionGroup);
        
        this.ceiling.body.static = true;
        this.ceiling.body.category = Config.PHYSICS.DEADLY;
        this.ceiling.body.clearShapes();
        this.ceiling.body.loadPolygon('physicsData', 'Ceiling'); 
        this.ceiling.body.setCollisionGroup(this.dangerCollisionGroup);  
        this.ceiling.body.collides(this.heroCollisionGroup);

        this.shurikens = [];
        this.leftSpikes = [];
        this.rightSpikes = [];

        for (var i = 0; i < MAX_SPIKE; i++)
        {
            var spike = new Spike(this.game, -15, 0, Assets.IMAGES.LEFT_SPIKE.key, true);
            this.game.physics.p2.enable(spike);
            spike.createBody('LeftSpike', this.dangerCollisionGroup, this.heroCollisionGroup, Config.PHYSICS.DEADLY);
            this.view.add(spike);
            this.leftSpikes.push(spike);
        }
        for (i = 0; i < MAX_SPIKE; i++)
        {
            var rspike = new Spike(this.game, 495, 0, Assets.IMAGES.RIGHT_SPIKE.key, false);
            this.game.physics.p2.enable(rspike);
            rspike.createBody('RightSpike', this.dangerCollisionGroup, this.heroCollisionGroup, Config.PHYSICS.DEADLY);
            this.view.add(rspike);
            this.rightSpikes.push(rspike);
        }
        for (i = 0; i < MAX_SHURIKEN; i++)
        {
            var shuriken = new Shuriken(this.game, Assets.IMAGES.SHURIKEN.key);
            this.game.physics.p2.enable(shuriken);
            shuriken.createBody('Shuriken', this.dangerCollisionGroup, this.heroCollisionGroup, Config.PHYSICS.DEADLY);
            this.view.add(shuriken);
            this.shurikens.push(shuriken);            
        }

        this.version = this.add.bitmapText(10, 8, Config.FONT_KEY, Config.TEXT.VERSION.replace('<0>', __VERSION__), 20);
        this.version.smoothed = false;
        
        this.title = this.add.image(0, 120, Assets.IMAGES.TITLE.key);
        this.title.centerX = this.world.centerX;
        this.title.smoothed = false;
        
        this.playText = this.add.bitmapText(0, 410, Config.FONT_KEY, Config.TEXT.PLAY, 68);
        this.playText.centerX = this.world.centerX;
        
        //create emitter
        this.emitter = this.add.emitter(0, 0, 128);
        this.emitter.makeParticles('particle');
        this.emitter.minSpeed = 25;
        this.emitter.gravity.setTo(0);
        this.emitter.minParticleSpeed.setTo(-60, -60);
        this.emitter.maxParticleSpeed.setTo(60, 60);
        this.emitter.minParticleScale = 0.25;
        this.emitter.maxParticleScale = 0.75;

        this.emitter.setAlpha(0.5, 1);
        this.emitter.setYSpeed(-360, 360);
        this.emitter.setXSpeed(-360, 360);

        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;

        this.tap = this.add.button(0, 0, '');
        this.tap.inputEnabled = true;
        this.tap.width = Config.CANVAS_WIDTH;
        this.tap.height = Config.CANVAS_HEIGHT - 55;
        this.tap.onInputDown.add(this._ontapdown, this);
        this.tap.onInputDown.add(this._ontapup, this);

        //create sounds
        this.sfx_die = this.game.add.sound(Assets.SOUNDS[1].key);
        this.sfx_move = this.game.add.sound(Assets.SOUNDS[2].key);
        this.sfx_point = this.game.add.sound(Assets.SOUNDS[3].key);
        this.sfx_click = this.game.add.sound(Assets.SOUNDS[0].key);
        this.sfx_swooshing = this.game.add.sound(Assets.SOUNDS[4].key);

        this.gameover = new GameoverPage(this.game);

        this.buttonsound = this.add.button(40, Config.CANVAS_HEIGHT - 50, GameManager.sound ? Assets.IMAGES.SOUND_ON.key : Assets.IMAGES.SOUND_OFF.key);
        this.buttonsound.onInputDown.add(this._onsounddown, this);
        this.buttonsound.onInputUp.add(this._onsoundup, this);
        this.buttonsound.onInputOver.add(this._oninputover, this);
        this.buttonsound.onInputOut.add(this._oninputout, this);
        this.buttonsound.anchor.setTo(0.5);
        this.buttonsound.smoothed = false;

        this.buttontwitter = this.add.button(Config.CANVAS_WIDTH - 40, Config.CANVAS_HEIGHT - 50, Assets.IMAGES.TWITTER.key);
        this.buttontwitter.onInputDown.add(this._ontwittertap, this);
        this.buttontwitter.onInputOver.add(this._oninputover, this);
        this.buttontwitter.onInputOut.add(this._oninputout, this);
        this.buttontwitter.anchor.setTo(0.5);
        this.buttontwitter.smoothed = false;

        this._startgame();
    }

    update()
    { 
        this.totalGameTime += Date.now() - this.game.gametime;
        this.game.elapsed = (Date.now() - this.game.gametime) * 0.001;
        this.game.gametime = Date.now();

        if (this.playStatus == Config.PLAY_STATE.READY)
        {
            this.playText.alpha = (this.totalGameTime % 1000 < 500) ? 1 : 0;            
        }
    }  
    
    _createworldbounds(x, y, w, h) 
    {
        var sim = this.game.physics.p2;    
    
        this.borders.left = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: 1.5707963267948966 });
        this.borders.left.addShape(new p2.Plane());
        this.borders.left.category = Config.PHYSICS.BORDER;
        this.borders.left.shapes[0].collisionGroup = this.borderCollisionGroup.mask;
        this.borders.left.shapes[0].collisionMask = this.heroCollisionGroup.mask;

        this.borders.right = new p2.Body({ mass: 0, position: [ sim.pxmi(x + w), sim.pxmi(y) ], angle: -1.5707963267948966 });
        this.borders.right.addShape(new p2.Plane());
        this.borders.right.category = Config.PHYSICS.BORDER;
        this.borders.right.shapes[0].collisionGroup = this.borderCollisionGroup.mask;
        this.borders.right.shapes[0].collisionMask = this.heroCollisionGroup.mask;

        this.borders.top = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y) ], angle: -3.141592653589793 });
        this.borders.top.addShape(new p2.Plane());
        this.borders.top.category = Config.PHYSICS.BORDER;
        this.borders.top.shapes[0].collisionGroup = this.borderCollisionGroup.mask;
        this.borders.top.shapes[0].collisionMask = this.heroCollisionGroup.mask;
    
        this.borders.bottom = new p2.Body({ mass: 0, position: [ sim.pxmi(x), sim.pxmi(y + h) ] });
        this.borders.bottom.addShape(new p2.Plane());
        this.borders.bottom.category = Config.PHYSICS.BORDER;
        this.borders.bottom.shapes[0].collisionGroup = this.borderCollisionGroup.mask;
        this.borders.bottom.shapes[0].collisionMask = this.heroCollisionGroup.mask;
    
        sim.world.addBody(this.borders.left);
        sim.world.addBody(this.borders.right);
        sim.world.addBody(this.borders.top);
        sim.world.addBody(this.borders.bottom); 
    }

    _startgame()
    {
        this.playStatus = Config.PLAY_STATE.READY; 
        this.hero.body.fixedRotation = true;       
        this.hero.refresh(Config.HERO_POSITION);
        this.tap.inputEnabled = true;
        this.game.physics.p2.resume();
        this.playText.alpha = 1;
        this.playText.visible = true;
        this.game.time.events.loop(3000, this._onblink, this);
    }

    _onblink()
    {
        var rvalue = this.game.rnd.integerInRange(0, 10);
        if (rvalue % 2 !== 0)
            this.hero.animations.play('blink', 10, false);
        else
            this.hero.animations.play('dblink', 10, false);
    }

    _oncollision(bodyA, bodyB)
    {
        if (!this.hero.alive) return;
        if (GameManager.sound) this.sfx_die.play('', 0, 1);

        this.playStatus = Config.PLAY_STATE.GAMEROVER
        this.tap.inputEnabled = false;
        GameManager.saveScore(this.hero.score);
        this.hero.doom();
        this.emitter.x = this.hero.x;
        this.emitter.y = this.hero.y;
        this.emitter.start(true, 800, null, 50);   
        this.game.physics.p2.pause(); 
        setTimeout(()=>{
            this.score.visible = false;
            this.gameover.start(this.hero.score, GameManager.hiscore);
        }, 500); 
    }  
    
    _onphysicscontact(bodyA, bodyB)
    {
        if (!this.hero.alive) return;
        if (bodyB && bodyB.category && bodyB.category === 'border')
        {
            this._ondirectionchanged();
        }
    }

     _onsounddown()
    {        
        GameManager.sound = !GameManager.sound;
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        GameManager.saveProfile();
    }

    _onsoundup()
    {
        this.buttonsound.loadTexture(GameManager.sound ? Assets.IMAGES.SOUND_ON.key : Assets.IMAGES.SOUND_OFF.key);
    }      

    _ontwittertap()
    {
        if (GameManager.sound) this.sfx_click.play('', 0, 1);
        let url = 'https://twitter.com/intent/follow?original_referer=http%3A%2F%2Fcyclewars.io%2Fsocial-box%2F&ref_src=twsrc%5Etfw&screen_name=codesphinx';
        window.open(url,'cyclewars.io (@codesphinx)','toolbar=0,status=0,width=500,height=600');
    }

    _oninputover(button)
    {
        button.scale.setTo(1.1);
    }

    _oninputout(button)
    {
        button.scale.setTo(1);
    }

    _ontapdown()
    {
        if (this.playStatus == Config.PLAY_STATE.READY)
        {
            this.dummy.destroy();
            this.game.time.events.removeAll();
            this.playText.visible = false;
            this.title.visible = false;
            this.version.visible = false;
            this.score.visible = true;
            this.tap.inputEnabled = true;
            this.playStatus = Config.PLAY_STATE.PLAYING;
            this.hero.body.static = false
            this.hero.ready = true;
            this.hero.animations.stop();
            this.hero.frame = 1;
        }
        if (this.playStatus == Config.PLAY_STATE.PLAYING && !this.game.paused)
        {
            this.hero.model.resetMove();
            if (GameManager.sound) this.sfx_move.play('', 0, 1);
        }       
    }

    _ontapup()
    {
        if (this.playStatus != Config.PLAY_STATE.PLAYING || this.game.paused) return;        
    }

    _ondirectionchanged()
    {
        this.hero.flip();
        this.score.text = this.hero.score;
        this.score.centerX = this.world.centerX;

        if (GameManager.sound) this.sfx_point.play('', 0, 1);
       
        if (this.hero.score % 5 == 0)
        {
            var velocityX = Math.clamp(Math.abs(this.game.physics.p2.gravity.x) + GRAVITY_INCREASE_RATE, MIN_GRAVITY, MAX_GRAVITY);

            this.game.physics.p2.gravity.x = velocityX * this.hero.model.direction;
            GameManager.changeBackground(this.game);
            this.background.tint = parseInt(GameManager.backgroundColor.replace('#', '0x'));
        }
        else
        {
            this.game.physics.p2.gravity.x *= -1;
        }        
        var newMinSpike = this.hero.score<5 ? MIN_SPIKE : MIN_SPIKE+1;
        if (this.hero.score < HARD_MODE_SCORE)
        {
            if (this.hero.score % 2 == 0)
            {
                this.activeSpikeCount = Math.clamp(this.activeSpikeCount + 2, MIN_SPIKE, MAX_SPIKE);
            }
        }
        else
        {
            if (this.hero.score % 5 == 0 && this.activeShurikenCount < MAX_SHURIKEN)
            {
                this._activateshurikens();
            }
            if (this.hero.score % 2 == 0 && this.hero.score >= SHURIKEN_CHANGE_SCORE)
            {
                for (var i = 0; i < this.activeShurikenCount; i++)
                {
                    if (!this.shurikens[i].ready) continue;
                    this.shurikens[i].SHURIKEN_MOVE_SPEED += SHURIKEN_SPEED_INCREASE;
                }
            }
            if (this.hero.score % 3 == 0)
            {
                this.activeSpikeCount = Math.clamp(this.activeSpikeCount + 1, SHURIKEN_MIN_SPIKE, SHURIKEN_MAX_SPIKE);
            }
            newMinSpike = Math.clamp(newMinSpike, SHURIKEN_MIN_SPIKE, SHURIKEN_MAX_SPIKE);
            if (this.activeSpikeCount == newMinSpike) this.activeSpikeCount++;
        }
        this._generatespikes(Math.next(newMinSpike, this.activeSpikeCount), this.hero.model.direction);
    }

    _generatespikes(spikeCount, direction)
    {
        for (let i = 0; i < this.leftSpikes.length; i++)
        {
            this.leftSpikes[i].hidden = true;
        }
        for (let i = 0; i < this.rightSpikes.length; i++)
        {
            this.rightSpikes[i].hidden = true;
        }

        var positions = Array.shuffle([90, 150, 210, 270, 330, 390, 450, 510, 570, 630, 690]);

        for (let i = 0; i <= spikeCount; i++)
        {
            var index = this.game.rnd.integerInRange(0, positions.length-1);
            var dy = positions[index];
            positions.slice(index, 1);

            if (direction == Config.MOVE_DIRECTION.LEFT)
            {
                this.leftSpikes[i].body.y = dy;
                this.leftSpikes[i].hidden = false;
            }
            else
            {
                this.rightSpikes[i].body.y = dy;
                this.rightSpikes[i].hidden = false;
            }
        }
    }

    _activateshurikens()
    {
        this.activeShurikenCount = Math.clamp(this.activeShurikenCount + 1, MIN_SHURIKEN, MAX_SHURIKEN);
        for (var i = 0; i < this.activeShurikenCount; i++)
        {
            this.shurikens[i].activate();
        }
    }

    _onleaderboardtap()
    {
        GameManager.getLeaderboard(function(scores, me){  
            var content = '';
            var printed = false;
            var length = Math.min(scores.length, 20);

            for (var i = 0; i < length; i++)
            {
                content += '<div class="rank-list-item">';
                if (scores[i].id==me.id)
                {    
                    content += '<div class="item-rank-me">'+scores[i].rank+'</div>';
                    content += '<div class="item-info-me">';
                    printed = true;
                }
                else
                {
                    content += '<div class="item-rank">'+scores[i].rank+'</div>';
                    content += '<div class="item-info">';   
                }
                content += '<img src="'+scores[i].photo+'">';
                content += '<div class="item-name">'+scores[i].name+'</div>';
                content += '<div class="item-score">'+scores[i].score+'</div>';
                content += '</div></div>';
            }
            if(!printed)
            {
                content += '<div class="rank-list-item">';
                content += '<div class="item-rank-me">'+me.rank+'</div>';
                content += '<div class="item-info-me">';
                content += '<img src="'+me.photo+'">';
                content += '<div class="item-name">'+me.name+'</div>';
                content += '<div class="item-score">'+me.score+'</div>';
                content += '</div></div>';
            }          
            $('#leaderboard-panel').html(content);
            $('#webviewModal').modal();
        });
    }

    shutdown()
    {
        this.score.destroy();
        this.score = null;
        delete this.score;

        this.playText.destroy();
        this.playText = null;
        delete this.playText;

        this.floor.destroy();
        this.floor = null;
        delete this.floor;

        this.ceiling.destroy();
        this.ceiling = null;
        delete this.ceiling;

        this.hero.destroy();
        this.hero = null;
        delete this.hero;

        this.view.destroy();
        this.view = null;
        delete this.view;

        this.borders = null;
        delete this.borders;

        this.emitter.destroy();
        this.emitter = null;
        delete this.emitter;

        this.gameover.destroy();
        this.gameover = null;
        delete this.gameover;

        this.sfx_die.destroy();
        this.sfx_die = null;
        delete this.sfx_die;

        this.sfx_move.destroy();
        this.sfx_move = null;
        delete this.sfx_move;

        this.sfx_point.destroy();
        this.sfx_point = null;
        delete this.sfx_point;

        this.sfx_click.destroy();
        this.sfx_click = null;
        delete this.sfx_click;

        this.sfx_swooshing.destroy();
        this.sfx_swooshing = null;
        delete this.sfx_swooshing;

        for (let i = 0; i < this.leftSpikes.length; i++)
        {
            this.leftSpikes[i].destroy();
            this.leftSpikes[i] = null;
        }
        for (let i = 0; i < this.rightSpikes.length; i++)
        {
            this.rightSpikes[i].destroy();
            this.rightSpikes[i] = null;
        }

        this.game.physics.p2.clear();
        super.shutdown(this.game);
    }
}