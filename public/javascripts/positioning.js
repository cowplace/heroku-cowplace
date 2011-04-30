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
  grid_env.init(global_width, global_height, 200);
  var items = [];
  var extension = {
    init: function(){
      this.vx = 0;
      this.vy = 0;
      this.x = this.position().left;
      this.y = this.position().top;
      this.height = this.height();
      this.width = this.width();
      this.width_bound = global_width - this.width;
      this.height_bound = global_height - this.height;
    },
    tention: function(other){
      var min_dist = 100;
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if(dist < min_dist){
        var ratio = (min_dist - dist)/min_dist;
        context.beginPath();
        context.strokeStyle = 'rgba(0, 0, 0, '+ratio+')';
        context.moveTo(this.x + this.width/2, this.y + this.height/2);
        context.lineTo(other.x + other.width/2, other.y + other.height/2);
        context.closePath();
        context.stroke();
        var string_arg = 0.001 * ratio;
        var ax = dx * string_arg;
        var ay = dy * string_arg;
        this.vx += ax;
        this.vy += ay;
        other.vx -= ax;
        other.vy -= ay;
      }
    },
    bounce: function(){
      if(this.x < 0){
        this.x = 0;
        this.vx = -this.vx;
      } else if(this.x > this.width_bound){
        this.x = this.width_bound;
        this.vx = -this.vx;
      }
      if(this.y < 0){
        this.y = 0;
        this.vy = -this.vy;
      } else if(this.y > this.height_bound){
        this.y = this.height_bound;
        this.vy = -this.vy;
      }
    },
    move: function(){
      this.x += this.vx;
      this.y += this.vy;
      context.beginPath();
      context.fillStyle = 'rgb(255, 255, 255)';
      context.arc(this.x + this.width/2, this.y + this.height/2, 10, 0,  Math.PI*2, true);
      context.closePath();
      context.fill();
      this.css({
        left : this.x,
        top : this.y
      });
    }
  };
  $('.item').each(function(i){
    $(this).css({
      top : Math.floor(Math.random()*global_height+1),
      left : Math.floor(Math.random()*global_width+1)
    });
    items.push($.extend($(this), extension));
  });
  var items_length = items.length;
  var initialize = function(){
    for(var i=0;i<items_length;++i){
      items[i].init();
    }
  }

  var update = function(){
    context.clearRect(0,0,global_width,global_height);
    var checks = grid_env.check(items);
    var check_size = checks.length;
    for(var i=0;i<check_size;i+=2){
      checks[i].tention(checks[i+1]);
    }
    for(var i=0;i<items_length;++i){
      var elem = items[i];
      elem.bounce();
      elem.move();
    }
  };

  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/30);
  });
})(jQuery);
