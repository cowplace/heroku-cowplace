(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvasb" width="'+global_width+'" height="'+global_height+'" />');
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var contextb = $('#canvasb')[0].getContext('2d');
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
    init: function(kind){
      this.height = this.height();
      this.width = this.width();
      this.reposition();
      this.level = this.attr('depth');
      this.width_bound = global_width - this.width;
      this.height_bound = global_height - this.height;
      this.children = [];
      this.children_length = 0;
      this.flag = false;
      this.kind = kind;
    },
    reposition: function(){
      this.x = this.position().left;
      this.y = this.position().top;
      this.cx = this.x + this.width/2;
      this.cy = this.y + this.height/2;
      this.vx = 0;
      this.vy = 0;
    },
    gravity: function(other, min_dist){
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if(dist > 0){
        var cos = dx/dist;
        var sin = dy/dist;
        if(dist < min_dist){
          var ay = sin * (min_dist - dist) * 0.05;
          var ax = cos * (min_dist - dist) * 0.05;
          this.vx  += ax;
          this.vy  += ay;
          other.vx -= ax;
          other.vy -= ay;
        }
      }
    },
    tention: function(other, min_dist, spring_arg){
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var cos = dx/dist;
      var sin = dy/dist;
      var ax = cos * (min_dist - dist) * spring_arg;
      var ay = sin * (min_dist - dist) * spring_arg;
      this.vx  += ax;
      this.vy  += ay;
      other.vx -= ax;
      other.vy -= ay;
    },
    add_edge: function(other){
      this.children.push(other);
      this.children_length += 1;
    },
    edge_forces: function(){
      for(var i=0;i<this.children_length;i++){
        this.edge_force(this.children[i])
      }
    },
    edge_force: function(other){
      this.tention(other, 0, 0.01);
    },
    draw_edges: function(rate){
      for(var i=0;i<this.children_length;i++){
        this.draw_edge(this.children[i], rate)
      }
    },
    draw_edge: function(other, rate){
      contextb.strokeStyle = 'rgb(0,0,0)';
      contextb.beginPath();
      contextb.moveTo(this.cx, this.cy);
      contextb.lineTo(other.cx, other.cy);
      contextb.closePath();
      contextb.stroke();

      if(other.flag){
        contextb.beginPath();
        contextb.fillStyle = 'rgb(255, 128, 0)';
        contextb.arc(rate*this.cx+(1-rate)*other.cx, rate*this.cy+(1-rate)*other.cy, 5, 0,  Math.PI*2, true);
        contextb.closePath();
        contextb.fill();
      }
    },
    update_status: function(){
      if(this.kind == 'and'){
        this.flag = true;
        for(var i=0;i<this.children_length;i++){
          this.flag = this.flag && this.children[i].flag;
        }
      } else if(this.kind == 'or'){
        this.flag = false;
        for(var i=0;i<this.children_length;i++){
          this.flag = this.flag || this.children[i].flag;
        }
      }
    },
    bounce: function(){
      if(this.x < 0){
        this.x = 0;
        this.vx = -0.5 * this.vx;
      } else if(this.x > this.width_bound){
        this.x = this.width_bound;
        this.vx = -0.5 * this.vx;
      }
      if(this.y < 0){
        this.y = 0;
        this.vy = -0.5 * this.vy;
      } else if(this.y > this.height_bound){
        this.y = this.height_bound;
        this.vy = -0.5 * this.vy;
      }
    },
    move: function(){
      this.x += this.vx;
      this.y += this.vy;
      this.vx = 0.8 * this.vx;
      this.vy = 0.8 * this.vy;
      this.cx = this.x + this.width/2;
      this.cy = this.y + this.height/2;
    },
    show: function(){
      context.beginPath();
      context.fillStyle = 'rgb(255, 255, 255)';
      context.arc(this.cx, this.cy, 10, 0,  Math.PI*2, true);
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

  var items_length = 0;
  var max_depth = 0;
  var kinds = ['or', 'and'];
  var traverse = function(node, adj_hash, depth){
    var klass = 'item';
    var adjs = adj_hash[node];
    if (typeof adjs == 'undefined'){
      klass += ' leaf off';
      if (max_depth < depth){
        max_depth = depth;
      }
    } else {
      klass += ' ' + kinds[Math.floor(Math.random()*2)];
      for(var i in adjs){
        traverse(adjs[i], adj_hash, depth+1);
      }
    }
    $('#data').append('<div class="'+klass+'" node_id="'+node+'" depth="'+depth+'"><span>'+node+'</span></div>');
  };

  var item_parse = function(){
    items_length = $('.item').length;
    var h_unit = (global_height - 50)/items_length;
    var w_unit = (global_height - 50)/max_depth;
    $('.item').each(function(i){
      var idx = $(this).attr('node_id');
      var depth = $(this).attr('depth');
      $(this).css({
        top : h_unit*i +10,
        left : w_unit * (max_depth - depth) + 10
      });
      $(this).draggable({
        stop : function(){
          var idx = $(this).attr('node_id');
          items[idx].reposition();
          if(typeof timer_id == 'undefined'){
            charge_energy();
            timer_id = setInterval(update, 1000/30);
          }
        },
        drag : function(e, ui){
          var idx = $(this).attr('node_id');
          items[idx].x = ui.position.left;
          items[idx].y = ui.position.top;
        }
      });
      if($(this).hasClass('leaf')){
        $(this).click(function(){
          var idx = $(this).attr('node_id');
          var elem = items[idx];
          elem.toggleClass('off');
          elem.flag = !elem.flag;
        });
      } else {
        $(this).click(function(){
          var idx = $(this).attr('node_id');
          var elem = items[idx];
          elem.toggleClass('or');
          elem.toggleClass('and');
          if(elem.kind == 'and'){
            elem.kind = 'or';
            elem.init('or');
          } else if(elem.kind == 'or'){
            elem.kind = 'and';
          }
        });
      }
      items[idx] = $.extend($(this), extension);
      var elem = items[idx];
      if($(this).hasClass('or')){
        elem.init('or');
      } else if($(this).hasClass('and')){
        elem.init('and');
      } else {
        elem.init('leaf');
      }
    });
  };

  var initialize = function(adj_hash){
    traverse(0,adj_hash,1);
    item_parse();
    for(var i=0;i<items_length;i++){
      var elem = items[i];
      var adjs = adj_hash[i];
      if (typeof adjs != 'undefined'){
        for(var j in adjs){
          elem.add_edge(items[adjs[j]]);
        }
      }
    }
  };

  var timer_id;
  var update = function(){
    var checks = grid_env.check(items);
    var check_size = checks.length;
    for(var i=0;i<check_size;i+=2){
      checks[i].gravity(checks[i+1], 70);
    }
    for(var i=0;i<items_length;i++){
      items[i].edge_forces();
    }
    var sum_of_energy = 0;
    for(var i=0;i<items_length;++i){
      var elem = items[i];
      elem.move();
      elem.bounce();
      elem.x = (global_width - 50)/max_depth * (max_depth - elem.level) + 10;
      elem.cx = elem.x + elem.width/2;
      elem.vx = 0;
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

  var time_div = 0.0;
  var time_quota = 50;
  var draw = function(){
    context.clearRect(0,0,global_width,global_height);
    contextb.clearRect(0,0,global_width,global_height);
    time_div = (++time_div) % time_quota;
    for(var i=0;i<items_length;++i){
      var elem = items[i];
      elem.draw_edges(time_div/time_quota);
      elem.update_status();
      elem.show();
    }
  };

  $(document).ready(function(){
    $.getJSON('/api/tree.json',null,function(data){
      initialize(data);
      charge_energy();
      timer_id = setInterval(update, 1000/30);
      setInterval(draw, 1000/30);
    });
  });
})(jQuery);
