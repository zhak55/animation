+function() {        

function extend(dest, source) {
   if(!dest) return dest;
     for (var property in source) if( source.hasOwnProperty( property ) ) { 
       dest[property] = source[property];
     }
     return dest;
   };

function forEach( array , callback ) {
   var i = 0, interim;
     for( ; i < array.length; i++ ) callback( i, array[i] );
    return array;
   }

var DeferredNames = { 
      resolve : "done",
      reject  : "fail",
      progress: "notify"
}

var slice = Array.prototype.slice;

function $deferred() {
    this.stack = {
        "done"    : null,
        "fail"    : null,
        "notify"  : null
    }
 };

forEach(["done", "fail", "notify"], function( index, name ) {
    $deferred.prototype[name] = function() {
      var args = slice.call(arguments);
        this.stack[name] = args;
     return this; 
    }
  });

forEach(["resolve", "reject", "progress"], function( index, name ) {
  $deferred.prototype[name] = function( data ) {
    var fn = this.stack[DeferredNames[name]]
    if( fn ) {
      var length = fn.length;
        while( length-- ) fn[length].call( this, data );
     }
     return this;
   }
});

var Easings = {
     swing : function( step ) {
      return 0.5 - Math.cos( step * Math.PI ) / 2;  
    },
     linear: function( step ) {
       return step;  
     },
     bounce : function( step ) {
      for (var a = 0, b = 1, result; 1; a += b, b /= 2) if (step >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * step) / 4, 2) + Math.pow(b, 2);
      }
    }
  };


function Animation( callback, options ) {
  var  time = +(new Date())
     , options = extend({       
           duration : 400 ,
           easings  : "swing" ,
           speed    : 13 
       }, options || {} )
     , normalize , intvalId
     , defer = new $deferred;
  
     extend( defer , {
         stop : function() {
           clearInterval( intvalId );
           defer.reject( normalize )
         } ,
         props : function( $el, styles ) {
           extend( $el.style, styles );  
         } ,
         each : forEach
       })
     
    intvalId = setInterval(function() {
      normalize = 1 - Math.max(0, options.duration + time - +(new Date())) / options.duration;
       if( normalize >= 1 ) ( normalize = 1 ) && defer.resolve() &&
         clearInterval(intvalId);
       ( callback ||  
            defer.progress ).call( defer , Easings[options.easings](normalize) );
     }, options.speed );
  return defer;
};
        
Animation.$defer = function() {
    return new $deferred;
}

// expose the plugin 
 this["Animation"] = Animation;

}.call(this);
