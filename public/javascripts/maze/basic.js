(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var canvas = $('#canvas')[0].getContext('2d');

  var PATH = 0;
  var WALL = 1;
  var START = 2;
  var GOAL = 3;
  var VISITED = 4;
  var ROUTE = 5;
  var maze = function(h,w){
    this.height = h;
    this.width = w;
    this.grid = new Array();
    this.make = function(){
      for(var i=0;i<this.height;i++){
        this.grid[i] = new Array();
        for(var j=0;j<this.width;j++){
          if((i == 0 || i == this.height-1 || j == 0 || j == this.width-1) || ((i % 2) == 0 && (j % 2) == 0)){
            this.grid[i][j] = WALL;
          }else{
            this.grid[i][j] = PATH;
          }
        }
      }  
      for(var i=2;i+2<this.grid.length;i+=2){
        for(var j=2;j+2<this.grid[i].length;j+=2){
          var set = 0;
          switch(Math.floor(Math.random() * 4 + 1)){
            //上
            case 1:
              if(this.grid[i-1][j] == 0 && i == 2){
                this.grid[i-1][j] = WALL;
                set = 1;
              }
            break;
            //右
            case 2:
              if(this.grid[i][j+1] == 0){
                this.grid[i][j+1] = WALL;
                set = 1;
              }
            break;
            //下
            case 3:
              if(this.grid[i+1][j] == 0){
                this.grid[i+1][j] = WALL;
                set = 1;
              }
            break;
            //左
            case 4:
              if(this.grid[i][j-1] == 0){
                this.grid[i][j-1] = WALL;
                set = 1;
              }
            break;
          }        
          if(set == 0){
            j -= 2;
          }
        }  
      }  
      this.grid[1][1] = START;
      this.grid[this.height-2][this.width-2] = GOAL;
    };

    this.block = new Array();
    this.block[PATH] = '#ffffff';
    this.block[WALL] = '#333333';
    this.block[START] = '#cc0000';
    this.block[GOAL] = '#66dd66';
    this.block[VISITED] = '#99cc99';
    this.block[ROUTE] = '#66ff66';
    var w_unit = global_width / (this.width+1);
    var h_unit = global_height / (this.height+1);
    this.draw = function(){
      for(var i=0;i<this.grid.length;i++){
        for(var j=0;j<this.grid[i].length;j++){
          this.draw_cell(i,j);
        }
      }
    };
    this.draw_cell = function(i,j){
      canvas.beginPath();
      canvas.fillStyle = this.block[this.grid[i][j]];
      canvas.rect(j*w_unit,i*h_unit,w_unit,h_unit);
      canvas.fill();
      canvas.closePath();
    };
  };

  var seeker = function(){
    var pos = function(x,y){
      this.x = x;
      this.y = y;
      this.f;
      this.g;
      this.h;
      this.parent_node;
      this.equal = function(other){
        return this.x == other.x && this.y == other.y;
      };
      this.is_walkable = function(grid){
        return grid[this.y][this.x] != WALL;
      };
    };
    this.init = function(maze){
      this.maze = maze;
      this.open = new Array();
      this.closed = new Array();
      this.start_node = new pos(1,1);
      this.end_node = new pos(this.maze.width-2,this.maze.height-2);

      this.start_node.g = 0;
      this.start_node.h = this.heuristic(this.start_node);
      this.start_node.f = this.start_node.g+this.start_node.h;
      this.node = this.start_node;
    };
    var STRAIGHT_COST = 1.0;
    var DIAG_COST = Math.SQRT;
    this.find_path = function(){
      var start_x = Math.max(1, this.node.x-1);
      var end_x = Math.min(this.maze.width-2, this.node.x+1);
      var start_y = Math.max(1, this.node.y-1);
      var end_y = Math.min(this.maze.height-2, this.node.y+1);
      for(var i=start_x;i<=end_x;i++){
        for(var j=start_y;j<=end_y;j++){
          var test = new pos(i,j);
          if(test.equal(this.node)
             || !test.is_walkable(this.maze.grid)
             || !(new pos(this.node.x, test.y)).is_walkable(this.maze.grid)
             || !(new pos(test.x, this.node.y)).is_walkable(this.maze.grid)
            ){
            continue;
          }
          var cost = STRAIGHT_COST;
          if(!((this.node.x == test.x) || (this.node.y == test.y))){
            cost = DIAG_COST;
          }
          var g = this.node.g + cost;
          var h = this.heuristic(test);
          var f = g + h;
          if(this.is_open(test) || this.is_closed(test)){
            if(test.f > f){
              test.f = f;
              test.g = g;
              test.h = h;
              test.parent_node = this.node;
            }
          } else {
            test.f = f;
            test.g = g;
            test.h = h;
            test.parent_node = this.node;
            this.open.push(test);
          }
        }
      }
      this.closed.push(this.node);
      this.maze.grid[this.node.y][this.node.x] = VISITED;
      this.maze.draw_cell(this.node.y,this.node.x);
      if(this.open.length == 0){
        return false;
      }
      //this.open.sort(function(a,b){return a-b;});
      //this.node = this.open.shift();
      this.node = this.open.pop();
    };
    this.is_open = function(node){
      for(var i=0;i<this.open.length;i++){
        if(this.open[i].equal(node)){
          return true;
        }
      }
      return false;
    };
    this.is_closed = function(node){
      for(var i=0;i<this.closed.length;i++){
        if(this.closed[i].equal(node)){
          return true;
        }
      }
      return false;
    };
    this.heuristic = function(node){
      var dx = this.end_node.x - node.x;
      var dy = this.end_node.y - node.y;
      return Math.sqrt(dx*dx+dy*dy);
    };
    this.route = function(){
      var node = this.node;
      while(!node.equal(this.start_node)){
        this.maze.grid[node.y][node.x] = ROUTE;
        this.maze.draw_cell(node.y,node.x);
        node = node.parent_node;
      }
      this.maze.grid[node.y][node.x] = ROUTE;
      this.maze.draw_cell(node.y,node.x);
    };
  };

  var s;
  var initialize = function(){
    m = new maze(63,127);
    m.make();
    m.draw();
    s = new seeker();
    s.init(m);
  };

  var timer_id;
  var update = function(){
    if(s.node.equal(s.end_node)){
      s.route();
      clearInterval(timer_id);
      timer_id = undefined;
      setTimeout(function(){location.reload(false);}, 3000);
    } else {
      s.find_path();
    } 
  };

  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/60);
  });
})(jQuery);
