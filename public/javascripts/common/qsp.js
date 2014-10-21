(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var context = $('#canvas')[0].getContext('2d');

  var qps_env = function(width, height, depth){
    this.idx = 0;
    this.width = width;
    this.height = height;
    this.depth = depth;
    if(this.depth > 15){
      this.depth = 15;
    }
    this.max_morton = (Math.pow(4, this.depth+1)-1)/3;
    this.w_unit = this.width / Math.pow(2, this.depth);
    this.h_unit = this.height / Math.pow(2, this.depth);
    this.cells = new Array(this.max_morton);

    this.morton_position = function(obj){
      var left_top = this.get_morton(obj.x-obj.range, obj.y-obj.range);
      var right_bottom = this.get_morton(obj.x+obj.range, obj.y+obj.range);
      if (right_bottom >= this.max_morton){
        right_bottom = left_top;
      }
      var pos = left_top ^ right_bottom;
      var hi_level = 0;
      for(var i=0;i<this.depth;i++){
        var check = (pos >> (i*2)) & 0x3;
        if (check !== 0){
          hi_level = i+1;
        }
      }
      return (right_bottom >> (hi_level*2)) + (Math.pow(4, this.depth-hi_level)-1)/3;
    };
    this.get_morton = function(x, y){
      return this.bit_separate((x/this.w_unit)|0) | (this.bit_separate((y/this.h_unit)|0) << 1);
    };
    this.bit_separate = function(num){
      num = (num|(num<<8)) & 0x00ff00ff;
      num = (num|(num<<4)) & 0x0f0f0f0f;
      num = (num|(num<<2)) & 0x33333333;
      return (num|(num<<1)) & 0x55555555;
    };

    this.register_cells = function(items){
      this.cells = new Array(this.max_morton);
      for (var i=0,items_length=items.length;i<items_length;i++){
        var item = items[i];
        var pos = this.morton_position(item);
        if (this.cells[pos] === undefined){
          this.cells[pos] = [];
        }
        this.cells[pos].push(item);
      }
    };

    this.traverse_cells = function(root_idx, objs){
      var result = [];
      var elems = this.cells[root_idx] || [];
      var elems_length = elems.length;
      var objs_length = objs.length;
      for (var i=0;i<elems_length;i++){
        var elem1 = elems[i];
        for (var j=i+1;j<elems_length;j++){
          result.push([elem1, elems[j]]);
        }
        for (var j=0;j<objs_length;j++){
          result.push([elem1, objs[j]]);
        }
      }
      var next_objs = objs.concat(elems);
      for(var i=1;i<=4;i++){
        var idx = root_idx*4+i;
        if(idx < this.max_morton){
          result = result.concat(this.traverse_cells(idx, next_objs));
        }
      }
      return result;
    };

    this.draw = function(){
      var num_of_cell = Math.pow(2, this.depth);
      context.beginPath();
      context.strokeStyle = 'rgba(0,0,0,0.5)';
      for (var i=0;i<=num_of_cell;i++){
        context.moveTo(i*this.w_unit,0);
        context.lineTo(i*this.w_unit,this.height);
        context.moveTo(0,i*this.h_unit);
        context.lineTo(this.width,i*this.h_unit);
      }
      for (var i=0;i<=num_of_cell;i++){
        w = i*this.w_unit;
        for(var j=0;j<=num_of_cell;j++){
          h = j*this.h_unit;
          offset = (Math.pow(4,this.depth)-1)/3;
          context.fillText(this.get_morton(w,h)+offset,w,h+10);
        }
      }
      context.closePath();
      context.stroke();
    };
  };

  var field = new qps_env(global_width, global_height, 4);
  var item = function(obj){
    this.idx = obj.idx;
    this.x = obj.x;
    this.y = obj.y;
    var base = 10;
    this.vx = Math.random()*base-base/2;
    this.vy = Math.random()*base-base/2;
    this.radius = Math.random()*10 + 5;
    //this.radius = 5;
    this.range = this.radius;
    this.mass = Math.pow(this.radius, 2);
    this.obj = obj;
    this.rgb = 'rgb('+Math.floor(Math.random()*255+1)+','+Math.floor(Math.random()*255+1)+','+Math.floor(Math.random()*255+1)+')';

    this.draw = function(){
      context.beginPath();
      context.fillStyle = this.rgb;
      context.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
      context.closePath();
      context.fill();
    };
    this.collision = function(other){
      var min_dist = this.radius + other.radius;
      var dx = other.x - this.x;
      var dy = other.y - this.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < min_dist){
        var cos = dx / dist;
        var sin = dy / dist;
        other.x = this.x + cos * min_dist;
        other.y = this.y + sin * min_dist;
        var vel0 = this.rotate(this.vx, this.vy, sin, cos, true);
        var vel1 = this.rotate(other.vx, other.vy, sin, cos, true);
        var vxTotal = vel0.x - vel1.x;
        vel0.x = ((this.mass - other.mass) * vel0.x + 2 * other.mass * vel1.x) / (this.mass + other.mass);
        vel1.x = vxTotal + vel0.x;
        var vel0F = this.rotate(vel0.x, vel0.y, sin, cos, false);
        var vel1F = this.rotate(vel1.x, vel1.y, sin, cos, false);
        this.vx = vel0F.x;
        this.vy = vel0F.y;
        other.vx = vel1F.x;
        other.vy = vel1F.y;
      }
    };
    this.rotate = function(px, py, sin, cos, reverse){
      if (reverse){
        return {
          x : px*cos+py*sin,
          y : py*cos-px*sin
        };
      } else {
        return {
          x : px*cos-py*sin,
          y : py*cos+px*sin
        };
      }
    };
    this.tension = function(other){
      var min_dist = this.range + other.range;
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < min_dist){
        var ratio = (min_dist-dist)/min_dist;
        context.beginPath();
        context.strokeStyle = 'rgba(0,0,0,'+ ratio +')';
        context.moveTo(this.x,this.y);
        context.lineTo(other.x,other.y);
        context.closePath();
        context.stroke();
        var string_arg = 1;//(min_dist - dist)/min_dist;
        var ax = string_arg * dx / dist;
        var ay = string_arg * dy / dist;
        this.vx += ax / this.mass;
        this.vy += ay / this.mass;
        other.vx -= ax / other.mass;
        other.vy -= ay / other.mass;
      }
    };
    this.bounce = function(){
      if(this.x < this.radius){
        this.x = this.radius;
        this.vx = -this.vx;
      } else if(this.x > global_width - this.radius){
        this.x = global_width - this.radius;
        this.vx = -this.vx;
      }
      if(this.y < this.radius){
        this.y = this.radius;
        this.vy = -this.vy;
      } else if(this.y > global_height - this.radius){
        this.y = global_height - this.radius;
        this.vy = -this.vy;
      }
    };
    this.warp = function(){
      this.x = (this.x + global_width)%global_width;
      this.y = (this.y + global_height)%global_height;
    };
    this.move = function(){
      this.x += this.vx;
      this.y += this.vy;
      this.bounce();
      //this.warp();
      /*
      obj.css({
        left : this.x - obj.width()/2,
        top : this.y - obj.height()/2
      });
      */
      //this.vx = 0.99 * this.vx;
      //this.vy = 0.99 * this.vy;
    };
  };

  var extension = {
    init: function(){
      this.x = this.position().left + this.width()/2;
      this.y = this.position().top + this.height()/2;
    }
  };
  var items = [];

  var initialize = function(){
    $('.item').each(function(i){
      instance = {
        x : Math.floor(Math.random()*global_width+1),
        y : Math.floor(Math.random()*global_height+1),
        idx : i+1
      };
      items.push(new item(instance));
      $(this).css({
        display : 'none'
      });
    });
  };
  
  var update = function(){
    context.clearRect(0,0,global_width,global_height);
    //field.draw();
    for (var i=0,item_length=items.length;i<item_length;i++){
      items[i].move();
    }
    field.register_cells(items);
    result = field.traverse_cells(0,new Array());
    for(var i=0,result_length=result.length;i<result_length;i++){
      var pair = result[i];
      //pair[0].tension(pair[1]);
      pair[0].collision(pair[1]);
    }
    for (var i=0,item_length=items.length;i<item_length;i++){
      items[i].draw();
    }
  };
  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/60);
  });
})(jQuery);
