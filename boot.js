/*
 * boot.js - A JavaScript loader for speed addicts
 * ©2010 Micah Snyder <micah.snyder@gmail.com>
 */

(function(){

[].indexOf || (Array.prototype.indexOf = function(v, n){
    n = (n == null) ? 0 : n; var m = this.length;
    for(var i = n; i < m; i++) {
        if(this[i] == v) return i;
    }
    return -1;
});

var doc = document, win = window, ga = 'getAttribute', sa = 'setAttribute', hp = 'hasOwnProperty', ad = 'addEventListener', at = 'attachEvent';

boot = function(url, callback) {
    boot.inject(url, callback);
}

boot.loaded = [];

boot.watch = function(e) {
    e = e || window.event;

    if(e.button == 2 || e.ctrlKey || e.metaKey) return;

    var type = e.type, target = e.target || e.srcElement;
    
    var bubble = function(el) {
        var flag = el[ga]('data-boot-' + type.replace('on', ''));
        
        if(flag) {
            if(flag.charAt(0) == '[') {
                flag = eval(flag);
            }
            
            boot.inject(flag);
        }
        var parent = el.parentNode;
        if(parent && parent != doc) bubble(parent);
    }
    
    bubble(target);
}

boot.inject = function(url, callback) {
    callback = callback || function(){};
    var _boot = this;
    
    //this will result in too many calls to callback. fix it.
    if(url.constructor == Array) {
        var _callback = callback;
        
        callback = function() {
            var fire = true;
            for(var i = 0; i < url.length; i++) {
                if(!_boot.loaded[url[i]]) {
                    //console.log('no');
                    return false;
                } else {
                    //console.log('yes', _boot.loaded[url[i]]);
                }
            }
            
            _callback();
        }
        
        for(var i = 0; i < url.length; i++) this.inject(url[i], callback);
        return;
    }
    
    if(this.loaded[url]) return;
    
    var tag = doc.createElement('script');
    tag[sa]('type', 'text/javascript');
    tag[sa]('src', url);
    
    tag.onload = function() {
        _boot.loaded[url] = true;
        callback();
    }
    tag.onerror = function() {
        _boot.loaded[url] = false;
        throw "UTTER FAILURE: " + url;
    }
    
    
    doc.body.appendChild(tag);
}

if(doc[hp]('addEventListener')) {
    doc[ad]('click', boot.watch, false);
} else if(doc[hp]('attachEvent')) {
    doc[at]('click', boot.watch);
}

})();