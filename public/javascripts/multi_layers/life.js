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
    this.r = 128;
    this.g = 64;
    this.b = 0;
    this.x = 0;
    this.y = 0;
    this.height = 0;
    this.radius = w_unit / (2 * Math.cos(Math.PI/6));
    this.cnt = Math.floor(Math.random()*6);
    var cos30 = this.radius * Math.cos(Math.PI/6);
    var sin30 = this.radius * Math.sin(Math.PI/6);
    this.colors = [
      '#ffffff',
      '#ff0000',
      '#ff8000',
      '#FBB917',
      '#009900',
      '#AF7817',
      '#0000cc',
      '#6600cc'
    ];
    this.replace = function(x,y){
      if (y % 2 == 0){
        this.x = w_unit * x;
      } else {
        this.x = w_unit * x + cos30;
      }
      this.y = sin30 * y * 3;
    };
    this.show = function(){
      var num_of_screens = contexts.length;
      var rate = 0.95
      var cos30 = this.radius*rate * Math.cos(Math.PI/6);
      var sin30 = this.radius*rate * Math.sin(Math.PI/6);
      for(var i=0;i<num_of_screens;i++){
        //var ratio = (i+1)/num_of_screens;
        var ratio = 2;
        var ctx = contexts[i];
        if(this.flag){
          if(this.cnt > 3 && this.cnt < 6){
            ctx.fillStyle = this.colors[3];
          } else {
            ctx.fillStyle = this.colors[2];
          }
          ctx.beginPath();
          ctx.moveTo(this.x, this.y+this.radius*rate);
          ctx.lineTo(this.x+cos30, this.y+sin30);
          ctx.lineTo(this.x+cos30, this.y-sin30);
          ctx.lineTo(this.x, this.y-this.radius*rate);
          ctx.lineTo(this.x-cos30, this.y-sin30);
          ctx.lineTo(this.x-cos30, this.y+sin30);
          ctx.closePath();
          ctx.fill();
        } else {
          if(this.cnt > 3 && this.cnt < 6){
            ctx.fillStyle = this.colors[5];
            ctx.beginPath();
            ctx.moveTo(this.x, this.y+this.radius*rate);
            ctx.lineTo(this.x+cos30, this.y+sin30);
            ctx.lineTo(this.x+cos30, this.y-sin30);
            ctx.lineTo(this.x, this.y-this.radius*rate);
            ctx.lineTo(this.x-cos30, this.y-sin30);
            ctx.lineTo(this.x-cos30, this.y+sin30);
            ctx.closePath();
            ctx.fill();
          }
        }
      }
    };
    this.update = function(){
      if(this.cnt > 2 && this.cnt < 6){
        this.flag = true;
      } else {
        this.flag = false;
      }
      this.cnt = 0;
    };
  };

  var items = [];
  var initialize = function(){
    for(var i=0;i<items_length;++i){
      var elem = new item();
      elem.replace(i%width, Math.floor(i/width));
      elem.update();
      items.push(elem);
    }
  };

  var timer_id;
  var pos = width * 2 - 1 ;
  var adj = function(position){
    var x = position % width;
    var y = Math.floor(position / width);
    var adjs = [];
    if (x > 0){
      adjs.push((x-1) + y*width);
    }
    if (x < width-1){
      adjs.push((x+1) + y*width);
    }
    if(y%2 == 0){
      if (y>0){
        adjs.push(x + (y-1)*width);
        if(x > 0){
          adjs.push(x - 1 + (y-1)*width);
        }
      }
      if (y<height-1){
        adjs.push(x + (y+1)*width);
        if(x > 0){
          adjs.push(x - 1 + (y+1)*width);
        }
      }
    } else {
      if (y>0){
        adjs.push(x + (y-1)*width);
        if (x < width - 1){
          adjs.push(x + 1 + (y-1)*width);
        }
      }
      if(y<height-1){
        adjs.push(x + (y+1)*width);
        if (x < width - 1){
          adjs.push(x + 1 + (y+1)*width);
        }
      }
    }
    return adjs;
  };
  var update = function(){
    var num_of_screens = contexts.length;
    for(var i=0;i<num_of_screens;i++){
      contexts[i].clearRect(0,0,global_width,global_height);
    }
    for(var i=0;i<items_length;i++){
      var elem = items[i];
      var adjs = adj(i);
      for(var j=0;j<adjs.length;j++){
        var adj_elem = items[adjs[j]];
        if(adj_elem.flag){
          elem.cnt++;
        }
      }
      if(elem.flag){
        elem.cnt++;
      }
      elem.show();
    }
    for(var i=0;i<items_length;++i){
      var elem = items[i];
      elem.update();
    }
  };

  $(document).ready(function(){
    initialize();
    //update();
    timer_id = setInterval(update, 2000);
  });
})(jQuery);
