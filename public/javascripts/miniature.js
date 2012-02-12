(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  var contexts = [];
  var num_of_screens = 1;
  for(var i=0;i<num_of_screens;i++){
    $('#content').append('<canvas id="canvas'+i+'" width="'+global_width+'" height="'+global_height+'" />');
    contexts[i] = $('#canvas'+i)[0].getContext('2d');
  }
  var items_length = 480;
  var width = 24;
  var height = items_length/width;
  var w_unit = Math.floor(global_width / width);
  var item = function(){
    this.r = 0;
    this.g = 192;
    this.b = 64;
    this.x = 0;
    this.y = 0;
    this.height = Math.floor(Math.random()*3);
    this.radius = w_unit / (2 * Math.cos(Math.PI/6));
    var cos30 = this.radius * Math.cos(Math.PI/6);
    var sin30 = this.radius * Math.sin(Math.PI/6);
    this.replace = function(x,y){
      if (y % 2 == 0){
        this.x = w_unit * x;
      } else {
        this.x = w_unit * x + cos30;
      }
      this.y = sin30  * y + global_height/3;
    };
    this.grow = function(h){
      if (h < 0){
        this.height = 0;
      } else {
        this.height = Math.floor(h);
      }
    };
    this.show = function(){
      var num_of_screens = contexts.length;
      for(var i=0;i<num_of_screens;i++){
        //var ratio = (i+1)/num_of_screens;
        var ratio = 2;
        var ctx = contexts[i];
        var ceil = this.y - this.height * sin30;
        ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        ctx.fillStyle = 'rgba('+this.r+','+this.g+','+this.b+','+ratio*0.5+')';
        ctx.beginPath();
        ctx.moveTo(this.x, ceil-this.radius);
        ctx.lineTo(this.x+cos30, ceil-sin30);
        ctx.lineTo(this.x, ceil);
        ctx.lineTo(this.x-cos30, ceil-sin30);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'rgba('+this.r+','+this.g*0.5+','+this.b*0.5+','+ratio*0.5+')';
        ctx.beginPath();
        ctx.lineTo(this.x+cos30, ceil-sin30);
        ctx.lineTo(this.x+cos30, this.y+sin30);
        ctx.lineTo(this.x, this.y+this.radius);
        ctx.lineTo(this.x, ceil);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = 'rgba('+this.r+','+this.g+50+','+this.b+','+ratio*0.5+')';
        ctx.beginPath();
        ctx.lineTo(this.x, this.y+this.radius);
        ctx.lineTo(this.x-cos30, this.y+sin30);
        ctx.lineTo(this.x-cos30, ceil-sin30);
        ctx.lineTo(this.x, ceil);
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
      }
    };

  };

  var items = [];
  var initialize = function(){
    for(var i=0;i<items_length;++i){
      var elem = new item();
      elem.replace(i%width, Math.floor(i/width));
      items.push(elem);
    }
  }

  var timer_id;
  var pos = 0;
  var update = function(){
    var num_of_screens = contexts.length;
    for(var i=0;i<num_of_screens;i++){
      contexts[i].clearRect(0,0,global_width,global_height);
    }
    for(var i=0;i<items_length;++i){
      var elem = items[i];
      if (i%width == pos){
        elem.grow(elem.height+Math.random()*10);
      } else {
        if(Math.random() > 0.6){
          elem.grow(elem.height-1);
        }
      }
      elem.show();
    }
    pos = (pos+1)%width;
  };

  $(document).ready(function(){
    initialize();
    //update();
    timer_id = setInterval(update, 1000/5);
  });
})(jQuery);
