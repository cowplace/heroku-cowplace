(function($){
  var field_width = $('#main').width() / 3;
  var field_height = $('#main').height();
  var canvas1_str = '<td width="'+field_width+'"><canvas id="canvas1" width="'+field_width+'" height="'+field_height+'" /></td>';
  var canvas2_str = '<td width="'+field_width+'"><canvas id="canvas2" width="'+field_width+'" height="'+field_height+'" /></td>';
  var canvas3_str = '<td width="'+field_width+'"><canvas id="canvas3" width="'+field_width+'" height="'+field_height+'" /></td>';
  $('#content').append('<table><tr>'+canvas1_str+canvas2_str+canvas3_str+'</tr></table>');

  var canvas1 = $('#canvas1')[0].getContext('2d');
  var canvas2 = $('#canvas2')[0].getContext('2d');
  var canvas3 = $('#canvas3')[0].getContext('2d');

  var PATH = 0;
  var WALL = 1;
  var START = 2;
  var GOAL = 3;
  var VISITED = 4;
  var ROUTE = 5;
  var maze = function(h,w,canvas){
    this.canvas = canvas;
    this.height = h;
    this.width = w;
    this.grid = new Array();
    this.make = function(){
      for(var i=0;i<this.height;i++){
        this.grid[i] = new Array();
        for(var j=0;j<this.width;j++){
          this.grid[i][j] = WALL;
        }
      }
      var pathes = new Array();
      var x = Math.floor(Math.random() * this.width / 2) * 2 + 1;
      var y = Math.floor(Math.random() * this.height / 2) * 2 + 1;
      this.grid[y][x] = PATH;
      pathes.push([x,y]);
      var odd_vertexes = Math.floor(this.height / 2) * Math.floor(this.width / 2);

      while(pathes.length < odd_vertexes){
        var point = pathes[Math.floor(Math.random() * pathes.length)];
        while(true){
          var x = point[0];
          var y = point[1];
          var candidates = new Array();
          if (x > 1 && this.grid[y][x-2] == WALL){
            candidates.push('LEFT');
          }
          if (x < this.width-2 && this.grid[y][x+2] == WALL){
            candidates.push('RIGHT');
          }
          if (y > 1 && this.grid[y-2][x] == WALL){
            candidates.push('DOWN');
          }
          if (y < this.height-2 && this.grid[y+2][x] == WALL){
            candidates.push('UP');
          }
          if (candidates.length > 0){
            switch(candidates[Math.floor(Math.random() * candidates.length)]){
              case 'LEFT':
                this.grid[y][x-1] = PATH;
                this.grid[y][x-2] = PATH;
                point = [x-2,y];
              break;
              case 'RIGHT':
                this.grid[y][x+1] = PATH;
                this.grid[y][x+2] = PATH;
                point = [x+2,y];
              break;
              case 'DOWN':
                this.grid[y-1][x] = PATH;
                this.grid[y-2][x] = PATH;
                point = [x,y-2];
              break;
              case 'UP':
                this.grid[y+1][x] = PATH;
                this.grid[y+2][x] = PATH;
                point = [x,y+2];
              break;
            }
            pathes.push(point);
          } else {
            break;
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
    var w_unit = field_width / (this.width+1);
    var h_unit = field_height / (this.height+1);
    this.draw = function(){
      for(var i=0;i<this.grid.length;i++){
        for(var j=0;j<this.grid[i].length;j++){
          this.draw_cell(i,j);
        }
      }
    };
    this.draw_cell = function(i,j){
      this.canvas.beginPath();
      this.canvas.fillStyle = this.block[this.grid[i][j]];
      this.canvas.rect(j*w_unit,i*h_unit,w_unit,h_unit);
      this.canvas.fill();
      this.canvas.closePath();
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
      this.get_next_node();
    };
    this.get_next_node = function(){
      this.open.sort(function(a,b){return a.h-b.h;});
      this.node = this.open.shift();
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

  var s1,s2,s3;
  var seekers = [];
  var mazes = [];
  var initialize = function(){
    var w = 47;
    var h = 63;
    m1 = new maze(h,w, canvas1);
    m1.make();
    m1.draw();
    s1 = new seeker();
    s1.init(m1);
    m2 = new maze(h,w, canvas2);
    m2.grid = m1.grid;
    m2.draw();
    s2 = new seeker();
    s2.get_next_node = function(){
      this.node = this.open.pop();
    };
    s2.init(m2);
    m3 = new maze(h,w, canvas3);
    m3.grid = m1.grid;
    m3.draw();
    s3 = new seeker();
    s3.get_next_node = function(){
      this.node = this.open.shift();
    };
    s3.init(m3);
  };

  var timer_id;
  var update = function(){
    if(s1.node.equal(s1.end_node) && s2.node.equal(s2.end_node) && s3.node.equal(s3.end_node)){
      s1.route();
      s2.route();
      s3.route();
      clearInterval(timer_id);
      timer_id = undefined;
      setTimeout(function(){location.reload(false);}, 3000);
    } else {
      if (s1.node.equal(s1.end_node)){
        s1.route();
      } else {
        s1.find_path();
      }
      if (s2.node.equal(s2.end_node)){
        s2.route();
      } else {
        s2.find_path();
      }
      if (s3.node.equal(s3.end_node)){
        s3.route();
      } else {
        s3.find_path();
      }
    } 
  };

  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/60);
  });
})(jQuery);
