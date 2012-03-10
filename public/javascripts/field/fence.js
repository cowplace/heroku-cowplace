(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var context = $('#canvas')[0].getContext('2d');
  
  var grid_env = $.extend(
    Object,
    {
      checks: [],
      grid: [],
      gird_size: 0,
      height: 0,
      num_of_cells: 0,
      num_of_cols: 0,
      num_of_rows: 0,
      width: 0,
      init: function(width, height, grid_size){
        this.width = width;
        this.height = height;
        this.grid_size = grid_size;
        this.num_of_cols = Math.ceil(this.width/this.grid_size);
        this.num_of_rows = Math.ceil(this.height/this.grid_size);
        this.num_of_cells = this.num_of_cols * this.num_of_rows;
      },
      check: function(objects){
        var num_of_objs = objects.length;
        this.grid = new Array(this.num_of_cells);
        this.checks = [];
        for(var i=0;i<num_of_objs;i++){
          var obj = objects[i];
          var idx = Math.floor(obj.y/this.grid_size)*this.num_of_cols + Math.floor(obj.x / this.grid_size);
          if(typeof this.grid[idx] == 'undefined'){
            this.grid[idx] = [];
          }
          this.grid[idx].push(obj);
        }
        return this.check_grid();
      },
      check_grid: function(){
        for(var i=0;i<this.num_of_cols;i++){
          for(var j=0;j<this.num_of_rows;j++){
            this.check_one_cell(i,j);
            this.check_two_cell(i,j,i+1,j);
            this.check_two_cell(i,j,i-1,j+1);
            this.check_two_cell(i,j,i,j+1);
            this.check_two_cell(i,j,i+1,j+1);
          }
        }
        return this.checks;
      },
      check_one_cell: function(x, y){
        var cell = this.grid[y*this.num_of_cols+x];
        if(typeof cell == 'undefined'){
          return;
        }
        var cell_length = cell.length;
        for(var i=0;i<cell_length;i++){
          var obj0 = cell[i];
          for(var j=i+1;j<cell_length;j++){
            var obj1 = cell[j];
            this.checks.push(obj0, obj1);
          }
        }
      },
      check_two_cell: function(x0, y0, x1, y1){
        if(x1 >= this.num_of_cols || x1 < 0 || y1 >= this.num_of_rows){
          return;
        }
        var cell0 = this.grid[y0*this.num_of_cols+x0];
        var cell1 = this.grid[y1*this.num_of_cols+x1];
        if (typeof cell0 == 'undefined' || typeof cell1 == 'undefined'){
          return;
        }
        var cell_length0 = cell0.length;
        var cell_length1 = cell1.length;
        for(var i=0;i<cell_length0;i++){
          var obj0 = cell0[i];
          for(var j=0;j<cell_length1;j++){
            var obj1 = cell1[j];
            this.checks.push(obj0, obj1);
          }
        }
      }
    }
  );
  grid_env.init(global_width, global_height, 150);
  var items = [];
  var extension = {
    init: function(){
      this.vx = 0;
      this.vy = 0;
      this.level = 0;
      this.idx = 0;
      this.x = this.position().left;
      this.y = this.position().top;
      this.height = this.height();
      this.width = this.width();
      this.width_bound = global_width - this.width;
      this.height_bound = global_height - this.height;
    },
    reposition: function(){
      this.x = this.position().left;
      this.y = this.position().top;
      this.vx = 0;
      this.vy = 0;
    },
    gravity: function(other, min_dist){
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var cos = dx/dist;
      var sin = dy/dist;
      if(dist < min_dist){
        var ax = cos * (min_dist - dist) * 0.01;
        var ay = sin * (min_dist - dist) * 0.01;
        this.vx  += ax;
        this.vy  += ay;
        other.vx -= ax;
        other.vy -= ay;
      }
    },
    tention: function(other, min_dist, spring_arg){
      var dy = this.y - other.y;
      var dist = Math.sqrt(dy*dy);
      var cos = dy/dist;
      if(dist < min_dist){
        var ay = cos * (min_dist - dist) * spring_arg;
        this.vy  += ay;
        other.vy -= ay;
      } else {
        var ay = cos * (dist - min_dist) * spring_arg;
        this.vy  -= ay;
        other.vy += ay;
      }
    },
    add_edge: function(other){
      this.tention(other, 0, 0.001);
      context.strokeStyle = 'rgb(0,0,0)';
      context.beginPath();
      context.moveTo(this.x + this.width/2, this.y + this.height/2);
      context.lineTo(other.x + other.width/2, other.y + other.height/2);
      context.closePath();
      context.stroke();
    },
    add_brother: function(other){
      this.tention(other, 70, 0.001);
    },
    bounce: function(){
      if(this.x < 0){
        this.x = 0;
        this.vx = -0.9 * this.vx;
      } else if(this.x > this.width_bound){
        this.x = this.width_bound;
        this.vx = -0.9 * this.vx;
      }
      if(this.y < 0){
        this.y = 0;
        this.vy = -0.9 * this.vy;
      } else if(this.y > this.height_bound){
        this.y = this.height_bound;
        this.vy = -0.9 * this.vy;
      }
    },
    move: function(){
      this.x += this.vx;
      this.y += this.vy;
      this.vx = 0.9 * this.vx;
      this.vy = 0.9 * this.vy;
    },
    show: function(){
      context.beginPath();
      context.fillStyle = 'rgb(255, 255, 255)';
      context.arc(this.x + this.width/2, this.y + this.height/2, 10, 0,  Math.PI*2, true);
      context.closePath();
      context.fill();
      this.css({
        left : this.x,
        top : this.y
      });
    },
    energy: function(){
      return this.vx * this.vx + this.vy * this.vy;
    }
  };
  $('.item').each(function(i){
    $(this).css({
      top : Math.floor(Math.random()*global_height+1),
      left : Math.floor(Math.random()*global_width+1)
    });
    $(this).draggable({
      stop : function(){
        if(typeof timer_id == 'undefined'){
          charge_energy();
          timer_id = setInterval(update, 1000/30);
        }
      },
      drag : function(e, ui){
        var idx = $('.item').index(this);
        items[idx].x = ui.position.left;
        items[idx].y = ui.position.top;
      }
    });
    items.push($.extend($(this), extension));
  });
  var edges = [];
  var depth = {};
  $('.edge').each(function(i){
    var from = parseInt($(this).attr('from'));
    var to = parseInt($(this).attr('to'));
    edges.push(items[from]);
    edges.push(items[to]);
    if(typeof depth[from] === 'undefined'){
      depth[from] = [];
    }
    depth[from].push(to);
  });
  var dfs_traverse = function(node_no, current_depth){
    var node = items[node_no];
    node.y = (global_width - 10)/items_length * ypos + 5;
    node.level = current_depth;
    var children = depth[node_no];
    if(typeof children != 'undefined'){
      var sorted_children = children.sort(function(a,b){return a-b;});
      var children_length = children.length;
      for(var i=0;i<children_length;i++){
        dfs_traverse(sorted_children[i], current_depth+1, ypos++);
      }
    }
  };
  var uniq_push = function(elem, ary){
    var ary_length = ary.length;
    if(ary_length == 0){
      ary.push(elem);
    } else {
      for(var i=0;i<ary_length;i++){
        if(ary[i] == elem){
          break;
        } else if(i==ary_length-1){
          ary.push(elem);
        }
      }
    }
  };
  var difference = function(base, comp){
    var result = [];
    var base_length = base.length;
    var comp_length = comp.length;
    for(var i=0;i<base_length;i++){
      for(var j=0;j<comp_length;j++){
        if(base[i] == comp[j]){
          break;
        } else if(j==comp_length-1){
          uniq_push(base[i], result);
        }
      }
    }
    return result;
  };
  var brothers = [];
  $('.brother').each(function(i){
    brothers.push(items[parseInt($(this).attr('from'))]);
    brothers.push(items[parseInt($(this).attr('to'))]);
  });
  var items_length = items.length;
  var edges_length = edges.length;
  var brothers_length = brothers.length;
  var max_depth = 0;
  var ypos = 0;
  var initialize = function(){
    for(var i=0;i<items_length;i++){
      items[i].init();
    }
    var froms = [];
    var tos = [];
    $('.edge').each(function(i){
      var from = parseInt($(this).attr('from'));
      var to = parseInt($(this).attr('to'));
      froms.push(from);
      tos.push(to);
    });
    var roots = difference(froms, tos);
    var root_length = roots.length;
    for(var i=0;i<root_length;i++){
      dfs_traverse(roots[i], 1);
    }
    for(var i=0;i<items_length;i++){
      var elem = items[i]; 
      if(elem.level > max_depth){
        max_depth = elem.level;
      }
    }
  }

  var timer_id;
  var update = function(){
    context.clearRect(0,0,global_width,global_height);
    var checks = grid_env.check(items);
    var check_size = checks.length;
    for(var i=0;i<check_size;i+=2){
      checks[i].gravity(checks[i+1], global_height/max_depth);
    }
    for(var i=0;i<edges_length;i+=2){
      edges[i].add_edge(edges[i+1]);
    }
    for(var i=0;i<brothers_length;i+=2){
      brothers[i].add_brother(brothers[i+1]);
    }
    var sum_of_energy = 0;
    for(var i=0;i<items_length;++i){
      var elem = items[i];
      elem.bounce();
      elem.move();
      elem.x = (global_width - 50)/max_depth * elem.level + 10;
      elem.show();
      sum_of_energy += elem.energy();
    }
    if(sum_of_energy < 1.0){
      clearInterval(timer_id);
      timer_id = undefined;
    }
  };

  var charge_energy = function(){
    for(var i=0;i<10;i++){
      update();
    }
  };

  $(document).ready(function(){
    initialize();
    charge_energy();
    timer_id = setInterval(update, 1000/30);
  });
})(jQuery);
