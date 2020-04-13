Array.prototype.distinct = function () {
    var derivedArray = [];
    for (var i = 0; i < this.length; i += 1) {
        if (!derivedArray.contains(this[i])) {
            derivedArray.push(this[i]);
        }
    }
    return derivedArray;
};

Array.prototype.swap = function (index_A, index_B) {
    var temp = this[index_A];
    this[index_A] = this[index_B];
    this[index_B] = temp;
};

Array.prototype.shuffle = function () {
    var i = 0, j = 0, temp = null;
  
    for (i = this.length - 1; i > 0; i -= 1) 
    {
      j = Math.floor(Math.random() * (i + 1));
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
};

Array.shuffle = function (list) {
    var i = 0, j = 0, temp = null;
  
    for (i = list.length - 1; i > 0; i -= 1) 
    {
      j = Math.floor(Math.random() * (i + 1));
      temp = list[i];
      list[i] = list[j];
      list[j] = temp;
    }
    return list;
};

if (!Array.prototype.includes) 
{
    Object.defineProperty(Array.prototype, 'includes', {
      value: function(searchElement, fromIndex) {
  
        if (this === null) 
        {
          throw new TypeError('"this" is null or not defined');
        }
  
        var o = Object(this);
  
        var len = o.length >>> 0;
  
        if (len === 0) 
        {
          return false;
        }
  
        var n = fromIndex | 0;
  
        var k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
  
        function sameValueZero(x, y) 
        {
          return x === y || (typeof x === 'number' && typeof y === 'number' && isNaN(x) && isNaN(y));
        }
  
        while (k < len) {
          if (sameValueZero(o[k], searchElement)) 
          {
            return true;
          }
          k++;
        }
  
        return false;
      }
    });
}

if (!Array.prototype.findIndex) {
    Object.defineProperty(Array.prototype, 'findIndex', {
      value: function(predicate) {
        if (this === null) 
        {
          throw new TypeError('"this" is null or not defined');
        }
  
        var o = Object(this);
  
        var len = o.length >>> 0;
  
        if (typeof predicate !== 'function') 
        {
          throw new TypeError('predicate must be a function');
        }
  
        var thisArg = arguments[1];  
        var k = 0;
  
        while (k < len) 
        {
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) 
          {
            return k;
          }
          k++;
        }
  
        return -1;
      }
    });
}

if (!Number.prototype.pad) 
{
    Object.defineProperty(Number.prototype, 'pad', {
        value: function(len, str) {
            if (this === null || this === undefined)
                return '';
    
            var s = this.toString();
            str = str || "0";
            while (s.length < (len || 2)) {s = str + s;}
            return s;
        }
    });
}

String.prototype.isNullOrEmpty = function () {
    if (this === null || this === undefined)
        return true;

    var text = this.replace('/ /g', '');

    if (text.length === 0)
        return true;    
};

String.isNullOrEmpty = function (str) {
    if (str === null || str === undefined)
        return true;

    var text = str.replace('/ /g', '');

    if (text.length === 0)
        return true;    
};

String.random = function(length)
{
    length = length || Math.next(32);
    var charset = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var str = '';

    var max = charset.length - 1;
    for (var i = 0; i < length; i++)
    {
        str += charset[Math.next(max)];
    }
    return str;
};

if (!Math.clamp) 
{
    Object.defineProperty(Math, 'clamp', {
        value: function (value, min, max) 
        {
            return Math.max(min, Math.min(max, value));
        }
    });
}

Object.defineProperty(Math, 'TwoPi', {
  enumerable: false,
  configurable: false,
  writable: false,
  value: 6.283185
});

Object.assign(Math, {
    toRadians(degrees)
    {
        var pi = Math.PI;
        return degrees * (pi/180);
    }
});

Object.assign(JSON, {
    deepCopy(object) 
    {
        return JSON.parse(JSON.stringify(object));
    }
});

Object.assign(Math, {
    next(min, max)
    {
        min = Math.ceil(min || 0);
        max = Math.floor(max || 32767);
        return Math.floor(Math.random() * (max - min)) + min;
    }
});

if (!window.webCache) 
{
    Object.defineProperty(window, "webCache", new (function () {
        var useLocalStorage = (typeof (Storage) !== "undefined");
        var webstore = {};

        Object.defineProperty(webstore, "getItem", {
            value: function (key) {
                if (!useLocalStorage)
                {
                    var tmp = JSON.parse(decodeURIComponent(document.cookie));
                    return JSON.stringify(tmp[key]);
                }

                return localStorage.getItem(key);
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(webstore, "hasKey", {
            value: function (key) {
                if (!useLocalStorage)
                {
                    var tmp = JSON.parse(decodeURIComponent(document.cookie));
                    return (tmp[key] !== undefined);
                }

                return (localStorage.getItem(key) !== undefined);
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(webstore, "setItem", {
            value: function (key, data) {
                if (!key) { return; }
                var sValue = (typeof data === 'string') ? data : JSON.stringify(data);
                
                if (useLocalStorage)
                {
                    localStorage.setItem(key, sValue);
                }
                else
                {
                    var tmpJSON = {};
                    var tmp = decodeURIComponent(document.cookie);
                    if (tmp)
                    {
                        tmpJSON = JSON.parse(tmp);
                    }
                    tmpJSON[key] = sValue;
                    document.cookie = encodeURIComponent(JSON.stringify(tmpJSON));
                }
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(webstore, "length", {
            get: function () {
                if (!useLocalStorage)
                {
                    var tmp = JSON.parse(decodeURIComponent(document.cookie));
                    if (tmp)
                        return Object.keys(data).length;
                    else
                        return 0;
                }

                return localStorage.length;
            },
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(webstore, "removeItem", {
            value: function (key) {
                if (!key) { return; }
                if (!useLocalStorage)
                {
                    var tmp = JSON.parse(decodeURIComponent(document.cookie));
                    delete tmp[key];
                    document.cookie = JSON.stringify(tmp);
                }
                else
                {
                    return localStorage.removeItem(key);
                }
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        Object.defineProperty(webstore, "clear", {
            value: function () {
                if (!useLocalStorage)
                    document.cookie = '';
                else
                    localStorage.clear();
            },
            writable: false,
            configurable: false,
            enumerable: false
        });
        this.get = function () {            
            return webstore;
        };
        this.configurable = false;
        this.enumerable = true;
  })());
}