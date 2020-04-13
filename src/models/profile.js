export default class Profile 
{
    constructor()
    {
        this.sound = true;
        this.lastlogin = Date.now();
        this.hiscore = 0;
    }

    clone()
    {
        var cpy = new Profile();
        cpy.hiscore = this.hiscore;
        cpy.lastlogin = this.lastlogin;
        cpy.sound = this.sound;
        return cpy;
    }
}