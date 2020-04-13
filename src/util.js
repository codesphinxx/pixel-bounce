export default class Util
{
    constructor()
    {
        throw new Error('Statis class cannot be initialized');
    }

    static shuffle (array) 
    {
        var i = 0, j = 0, temp = null;
      
        for (i = array.length - 1; i > 0; i -= 1) 
        {
          j = Math.floor(Math.random() * (i + 1));
          temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
        return array;
    }

    /**
     * @param {Phaser.Text} label 
     * @param {String} text 
     * @param {String} defaultColor
     */
    static formatTextColor(label, text, defaultColor)
    {
        var words = text.split(' ');
        var result = '';
        var colorlist = [];
        
        for (var i=0; i < words.length; i++)
        {
            if (words[i].indexOf('<c:') === -1 && words[i].indexOf('<c>') === -1)
            {
                result += words[i] + ' ';
            }
            else if (words[i].indexOf('<c:') === -1 && words[i].indexOf('<c>') !== -1)
            {
                var ntext = words[i].replace('<c>', '');
                result += ntext + ' ';
                colorlist.push({color:defaultColor, position:result.length-1});
            }
            else if (words[i].indexOf('<c:') !== -1)
            {
                var color = words[i].substring(0,11).substring(3,10);
                var stext = words[i].slice(11, words[i].length);
                colorlist.push({color:color, position:result.length-1});
                result += stext + ' ';
                
                if (result.indexOf('<c>') !== -1)
                {
                    var position = result.indexOf('<c>');
                    result = result.replace('<c>', '');
                    colorlist.push({color:defaultColor, position:position});
                }
            }
        }
        label.text = result.trim();
        for (var k=0; k<colorlist.length;k++)
        {
            label.addColor(colorlist[k].color, colorlist[k].position);
        }
    }

    /**
     * Post an ajax request.
     * @param {String} url 
     * @param {String} data 
     * @param {Function} callback 
     */
    static send(url, data, callback)
    {
        $.ajax({url: url, type:'POST', dataType:'json', data:data, contentType:'application/json', success: callback});
    }

    static mergeObjetcs(target, modifier) 
    {
        for (var i in modifier) 
        {
            try 
            {
                target[i] = modifier[i].constructor==Object ? mergeObjetcs(target[i], modifier[i]) : modifier[i];
            } 
            catch(e) 
            {
                target[i] = modifier[i];
            }
        }
        return target;
    }

    static attachLengthProperty(obj)
    {
        if (!obj.length)
        {
            Object.defineProperty(obj, 'length', {
                get: function() { 
                    var size = 0, key;
                    for (key in obj) 
                    {
                        if (obj.hasOwnProperty(key)) size++;
                    }
                    return size;
                },
            });
        }
    }

    static getPlugins() 
    {
        var pluginsList = "";
  
        for (var i = 0; i < navigator.plugins.length; i++) 
        {
          if (i == navigator.plugins.length - 1) 
          {
            pluginsList += navigator.plugins[i].name;
          } 
          else 
          {
            pluginsList += navigator.plugins[i].name + ", ";
          }
        }
        return pluginsList;
    }

    static isLocalStorage() 
    {
        try 
        {
          return !!window.localStorage;
        } 
        catch (e) 
        {
          return true; 
        }
    }
  
    static isSessionStorage() 
    {
        try 
        {
          return !!window.sessionStorage;
        } 
        catch (e) 
        {
          return true;
        }
    }

    static getTimeZone()
    {
        return String(String(new Date()).split("(")[1]).split(")")[0];
    }

    static getScreenPrint()
    {
        return "Current Resolution: " + screen.width + "x" + screen.height 
        + ", Available Resolution: " + screen.availWidth + "x" + screen.availHeight 
        + ", Color Depth: " + screen.colorDepth + ", Device XDPI: " + screen.deviceXDPI + 
        ", Device YDPI: " + screen.deviceYDPI;
    }
}