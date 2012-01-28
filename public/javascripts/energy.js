(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var context = $('#canvas')[0].getContext('2d');
  var items = [];
  var items_length = 0;
  var positions = [];
  var edges = [];
  var edges_length = 0;
  var extension = {
    init: function(){
      this.x = Math.floor(Math.random()*global_height+1);
      this.y = Math.floor(Math.random()*global_width+1);
      this.height = this.height();
      this.width = this.width();
      this.children = [];
      this.children_length = 0;
      this.flag = (Math.random() > 0.7);
    },
    transform: function(){
      return new (function(obj){
        this.x = obj.x;
        this.y = obj.y;
        this.width = obj.width;
        this.height = obj.height;
      })(this);
    },
    reposition: function(x,y){
      this.x = x;
      this.y = y;
      this.cx = this.x + this.width/2;
      this.cy = this.y + this.height/2;
      this.css({
        left : this.x,
        top : this.y
      });
    },
    add_edge: function(other){
      this.children_length += 1;
      this.children.push(other);
    },
    draw_edges: function(rate){
      for(var i=0;i<this.children_length;i++){
        var child = this.children[i];
        this.flag = this.flag || child.flag;
        this.draw_edge(child,rate);
      }
    },
    draw_edge: function(other, rate){
      context.beginPath();
      context.strokeStyle = 'rgb(0,0,0)';
      context.moveTo(this.cx, this.cy);
      context.lineTo(other.cx, other.cy);
      context.closePath();
      context.stroke();

      if(other.flag){
        context.beginPath();
        context.fillStyle = 'rgb(255, 128, 0)';
        context.arc(rate*this.cx+(1-rate)*other.cx, rate*this.cy+(1-rate)*other.cy, 5, 0,  Math.PI*2, true);
        context.closePath();
        context.fill();
      }
    },
    draw: function(){
      context.beginPath();
      context.fillStyle = 'rgb(255, 255, 255)';
      context.arc(this.cx, this.cy, 10, 0,  Math.PI*2, true);
      context.closePath();
      context.fill();
    }
  };
  var timer_id;
  var checker = new Worker("/javascripts/ball_collision.js");
  checker.onmessage = function(event){
    positions = event.data['positions'];
    if(event.data['energys'] < 1.0){
      clearInterval(timer_id);
      timer_id = undefined;
    }
  };
  var initialize = function(){
    $('.item').each(function(i){
      $(this).draggable({
        stop : function(){
          var idx = $('.item').index(this);
          items[idx].flag = !items[idx].flag;
          if(typeof timer_id == 'undefined'){
            timer_id = setInterval(update, 1000/30);
          }
        },
        drag : function(e, ui){
          var idx = $('.item').index(this);
          checker.postMessage({
            type: 'refresh',
            param: {
              id: idx,
              x: ui.position.left,
              y: ui.position.top
            }
          });
        }
      });
      items.push($.extend($(this), extension));
    });
    positions = $.map(items, function(n,i){
      n.init();
      return n.transform();
    });
    var edge_nos = [];
    $('.edge').each(function(i){
      var from = parseInt($(this).attr('from'));
      var to = parseInt($(this).attr('to'));
      items[from].add_edge(items[to]);
      edge_nos.push(from);
      edge_nos.push(to);
    });
    var brother_nos = [];
    $('.brother').each(function(i){
      brother_nos.push(parseInt($(this).attr('from')));
      brother_nos.push(parseInt($(this).attr('to')));
    });
    items_length = items.length;
    edges_length = edge_nos.length;
    checker.postMessage({
      type: 'init',
      param: {
        global_width: global_width,
        global_height: global_height,
        items: positions,
        edges: edge_nos,
        brothers : brother_nos
      }
    });
  }

  var update = function(){
    checker.postMessage({
      type:'check'
    });
  };

  var time_div = 0.0;
  var time_quota = 1000;
  var draw = function(){
    for(var i=0;i<items_length;++i){
      var point = positions[i];
      items[i].reposition(point.x, point.y);
    }
    context.clearRect(0,0,global_width,global_height);
    for(var i=0;i<items_length;++i){
      time_div = (++time_div) % time_quota;
      items[i].draw_edges(time_div/time_quota);
    }
    for(var i=0;i<items_length;++i){
      items[i].draw();
    }
  };

  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/60);
    setInterval(draw, 1000/30);
  });
})(jQuery);
