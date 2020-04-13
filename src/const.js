export const Config = {
    CANVAS_WRAPPER:'app',
    CANVAS_WIDTH:480,
    CANVAS_HEIGHT:900,
    AD_FREQUENCY:5,
    COLORS:['#F71D4E', '#0099FF', '#FF0000', '#33CCCC', '#FFC40D', '#7F66FF', '#FF00DC', '#FE642E'],
    TEXT:{
        GAME_TITLE:'PIXEL BOUNCE',
        VERSION:'ver: <0>',
        PLAY:'TAP TO PLAY',
        GAMEOVER:'GAME OVER',
        SCORE:'SCORE',
        HISCORE:'HI-SCORE'
    },
    SHARE_TEXT:{
        en_US:'Can you top my score?',
        ca_ES:'Pot superar la meva puntuació?',
        de_DE:'Kannst du meine Punktzahl schlagen?',
        es_ES:'¿Puedes superar mi puntaje?',
        fr_FR:'Pouvez-vous battre mon score?',
        fallback:'Can you top my score?'
    },
    ANIMS:{
        BITME:'bitme',
        BITAVATAR:'bitmeanim'
    },
    MOVE_DIRECTION:{
        LEFT:-1, 
        RIGHT:1
    },
    PLAY_STATE:{
        STARTING:0,
        READY:1,
        PLAYING:2,
        GAMEROVER:3
    },
    PHYSICS:{
        HERO:'hero',
        BORDER:'border',
        DEADLY:'deadly'
    },
    HERO_POSITION:{x:240, y:310},
    ACTION_RESP:{
        SUCCESS:200,
        FAIL:500
    },
    SPLASH_KEY:'splash',
    FONT_KEY:'Symtext',
};

export const Assets = {
    IMAGES: {        
        SOUND_ON: { 
            key:'soundon',
            path:'assets/img/soundon.png',
            width:100,
            height:100
        },
        SOUND_OFF: { 
            key:'soundoff',
            path:'assets/img/soundoff.png',
            width:100,
            height:100
        },
        TWITTER: { 
            key:'twitter',
            path:'assets/img/twitter.png',
            width:60,
            height:60
        },
        FLOOR: { 
            key:'floor',
            path:'assets/img/floor.png',
            width:500,
            height:130
        },
        CEILING: { 
            key:'ceiling',
            path:'assets/img/ceiling.png',
            width:500,
            height:60
        },
        PARTICLE: { 
            key:'particle',
            path:'assets/img/particle.png',
            width:20,
            height:20
        },
        LEFT_SPIKE: { 
            key:'leftspike',
            path:'assets/img/leftspike.png',
            width:30,
            height:60
        },
        RIGHT_SPIKE: { 
            key:'rightspike',
            path:'assets/img/rightspike.png',
            width:30,
            height:60
        },
        SHURIKEN: { 
            key:'shuriken',
            path:'assets/img/shuriken.png',
            width:26,
            height:26
        },
        TITLE: { 
            key:'title',
            path:'assets/img/title.png',
            width:480,
            height:100
        },
        BACKGROUND: { 
            key:'bg',
            path:'assets/img/bg.png',
            width:480,
            height:850
        }
    },
    ANIMATIONS: [
        { 
            key:'bitme',
            path:'assets/img/bitme.png',
            width:32,
            height:32,
            count:12
        },
        { 
            key:'share',
            path:'assets/img/share.png',
            width:322,
            height:72,
            count:2
        },
        { 
            key:'restart',
            path:'assets/img/restart.png',
            width:322,
            height:72,
            count:2
        }
    ],
    SOUNDS: [
        {
            key:'sfx_click',
            path:'assets/audio/sfx_click.m4a'
        },
        {
            key:'sfx_die',
            path:'assets/audio/sfx_die.m4a'
        },
        {
            key:'sfx_move',
            path:'assets/audio/sfx_move.m4a'
        },
        {
            key:'sfx_point',
            path:'assets/audio/sfx_point.m4a'
        },
        {
            key:'sfx_swooshing',
            path:'assets/audio/sfx_swooshing.m4a'
        }
    ],
    JSON:{
        PHYSICS:{
            key:'physicsData',
            path:'assets/data/physicsData.json'
        }
    }
};