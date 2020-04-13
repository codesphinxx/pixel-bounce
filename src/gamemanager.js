import {Config} from './const';

class GameManager
{
    constructor()
    {
        if (!GameManager.instance)
        {
            this.ads = 0;
            this.adready = false;
            this.adrequested = false;
            this.ready = false;
            this.sound = true;
            this.hiscore = 0;
            this.player = '';
            this.photo = '';
            this.username = '';
            this.platform = '';
            this.backgroundColor = '';
            this.interstitial = null; 
            this.supportAds = false;
            this.playerImage = new Image(110, 110);
            this.playerImage.crossOrigin = 'anonymous';
            this.shareBackground = new Image(540, 200);
            this.isIOS = false;
            this.context_id = '';
            this.isMobile = (/Android|webOS|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent));
            
            GameManager.instance = this;
        }

        return GameManager.instance;
    }

    initGame()
    {
        let hiscore = localStorage.getItem('pb.score');
        if (hiscore)
        {
            this.hiscore = parseInt(hiscore);
        }
        /*try
        {
            this.context_id = FBInstant.context.getID();
            this.username = FBInstant.player.getName();
            this.photo = FBInstant.player.getPhoto();
            this.playerImage.src = this.photo || Config.PROFILE_IMG;
            this.shareBackground.src = Config.SCORE_SHARE_IMG;
            this.isIOS = FBInstant.getPlatform() === 'IOS';
            this.locale = FBInstant.getLocale();
            var supportedAPIs = FBInstant.getSupportedAPIs();
            this.supportAds = supportedAPIs.includes('getInterstitialAdAsync');
            if (this.isMobile && !this.supportAds)
            {
                this.logError({code:'INTERSTITIAL_NOT_SUPPORTED'}, 3);
            } 
            if (this.platform == 'ANDROID')
            {
                this.createShortcut();
            } 
        }
        catch(ex)
        {
            this.logError({code:'GAME_INIT_ERROR'}, 1);
        }*/    
    }

    saveScore(score)
    {
        if (this.hiscore < score) 
        {
            this.hiscore = score; 
            localStorage.setItem('pb.score', this.hiscore);           
        }        
    }

    /**
     * @param {Number} score 
     */
    shareScore(score)
    {
        try
        {
            var canvas = document.createElement("canvas");        
            canvas.width = 540;
            canvas.height = 200;

            var ctx = canvas.getContext("2d");
            ctx.fillStyle = this.backgroundColor;
            ctx.fillRect(0, 0, 540, 200);

            ctx.drawImage(this.shareBackground, 0, 0);
            ctx.drawImage(this.playerImage, 30, 45, 110, 110);

            ctx.fillStyle = '#FFFFFF';
            ctx.font = '40px Symtext';
            var metrics = ctx.measureText('SCORE');
            ctx.fillText('SCORE', (540 - metrics.width) * 0.5, 80);

            ctx.font = '56px Symtext';
            metrics = ctx.measureText(score.toLocaleString());
            ctx.fillText(score.toLocaleString(), (540 - metrics.width) * 0.5, 140);
                    
            var data_img = canvas.toDataURL();
            var share_txt = Config.SHARE_TEXT[this.locale] ? Config.SHARE_TEXT[this.locale] : Config.SHARE_TEXT.fallback;
            
            
        }
        catch(ex)
        {
            this.logError({code:'SHARE_SCORE_ERROR'}, 1);
        }
    } 

    changeBackground(game)
    {
        var index = game.rnd.integerInRange(0, Config.COLORS.length-1);     
        this.backgroundColor = Config.COLORS[index];
        game.stage.backgroundColor = this.backgroundColor;
    }
}

const instance = new GameManager();

export default instance;