# animation
Very simple JS-animation
```

// e.g.: http://jsfiddle.net/88y41282/1/

var vanilla = document.getElementById("vanilla");

Animation( null, {duration: 1300})
  .done(function() {
    
     var style = window.getComputedStyle( vanilla, null )
      var o = {};
       this.each(["height", "width", "left", "top"], function( index, name ) {
         o[name] = +style
          .getPropertyValue( name )
          .slice(0, -2)  
       });
    
      Animation(function(step){
        this.props( vanilla, {
          width  : ( 150 * step + o.width ) + "px",
          height : ( 150 * step + o.height ) + "px",
        });
      })
       .done(function(){
          Animation(function(step){
            this.props( vanilla, {left: ( 350 * step + o.left ) + "px" }) 
          }, {
           easings  : "bounce" ,
           duration : 1000
          }) 
            .done(function() {
              Animation(function(step){
                this.props( vanilla, { top: ( 350 * step + o.top ) + "px" }); 
              })
          })
      })
  }) 
  .notify(function(step){
      vanilla.style.opacity = step;
      console.log(step)
  })
  .fail(function(){
    alert("Animation is stopped!")
  });
```
