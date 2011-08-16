var grid_env = function(width, height, grid_size){
  this.width = width;
  this.height = height;
  this.grid_size = grid_size;
  this.num_of_cols = Math.ceil(this.width/this.grid_size);
  this.num_of_rows = Math.ceil(this.height/this.grid_size);
  this.num_of_cells = this.num_of_cols * this.num_of_rows;

  this.checks = [];
  this.grid = [];

  this.check = function(objects){
    var num_of_objs = objects.length;
    this.grid = new Array(this.num_of_cells);
    this.checks = [];
    for(var i=0;i<num_of_objs;i++){
      var obj = objects[i];
      var idx = Math.floor(obj.y/this.grid_size)*this.num_of_cols + Math.floor(obj.x / this.grid_size);
      if(typeof this.grid[idx] == 'undefined'){
        this.grid[idx] = [];
      }
      this.grid[idx].push(i);
    }
    return this.check_grid();
  };
  this.check_grid = function(){
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
  };
  this.check_one_cell = function(x, y){
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
  };
  this.check_two_cell = function(x0, y0, x1, y1){
    if(x1 >= this.num_of_cols || x1 < 0 || y1 >= this.num_of_rows){
      return;
    }
    var cell0 = this.grid[y0*this.num_of_cols+x0];
    var cell1 = this.grid[y1*this.num_of_cols+x1];
    if(typeof cell0 == 'undefined' || typeof cell1 == 'undefined'){
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
  };
};

var item = function(obj){
  this.x = obj.x;
  this.y = obj.y;
  this.vx = 0;
  this.vy = 0;
  this.height = obj.height;
  this.width = obj.width;
  this.width_bound = global_width - this.width;
  this.height_bound = global_height - this.height;
  this.reposition = function(x,y){
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
  };
  this.gravity = function(other){
    var min_dist = 60*60;
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var dist = dx*dx+dy*dy;
    if(dist < min_dist){
      var string_arg = 1 / dist;
      var ax = dx * string_arg;
      var ay = dy * string_arg;
      this.vx += ax;
      this.vy += ay;
      other.vx -= ax;
      other.vy -= ay;
    }
  };
  this.tention = function(other, min_dist){
    var dx = this.x - other.x;
    var dy = this.y - other.y;
    var dist = Math.sqrt(dx*dx+dy*dy);
    var spring_arg = 0.001;
    var ax = dx * spring_arg;
    var ay = dy * spring_arg;
    if(dist > min_dist){
      this.vx -= ax;
      this.vy -= ay;
      other.vx += ax;
      other.vy += ay;
    } else {
      this.vx += ax;
      this.vy += ay;
      other.vx -= ax;
      other.vy -= ay;
    }
  };
  this.add_edge = function(other){
    this.tention(other, 50);
  };
  this.add_brother = function(other){
    this.tention(other, 30);
  };
  this.bounce = function(){
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
  };
  this.move = function(){
    this.x += this.vx;
    this.y += this.vy;
    this.vx = 0.99 * this.vx;
    this.vy = 0.99 * this.vy;
  };
  this.energy = function(){
    return this.vx * this.vx + this.vy * this.vy;
  };
};

var env = '';
var items = [];
var items_length = 0;
var edges = [];
var edges_length = 0;
var brothers = [];
var brothers_length = 0;
var global_height = 0;
var global_width = 0;
onmessage = function(event){
  var type = event.data['type'];
  var param = event.data['param'];
  if(type == 'init'){
    global_height = param['global_height'];
    global_width = param['global_width'];
    env = new grid_env(global_width,global_height,80);
    var t_items = param['items'];
    var t_edges = param['edges'];
    var t_brothers = param['brothers'];
    items_length = t_items.length;
    for(var i = 0;i<items_length;i++){
      items.push(new item(t_items[i]));
    }
    edges_length = t_edges.length;
    for(var i = 0;i<edges_length;i++){
      edges.push(items[t_edges[i]]);
    }
    brothers_length = t_brothers.length;
    for(var i = 0;i<brothers_length;i++){
      brothers.push(items[t_brothers[i]]);
    }
  } else if(type == 'refresh'){
    var target = items[param['id']];
    target.x = param['x'];
    target.y = param['y'];
  } else {
    var checks = env.check(items);
    var check_size = checks.length;
    for(var i=0;i<check_size;i+=2){
      items[checks[i]].gravity(items[checks[i+1]]);
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
      sum_of_energy += elem.energy();
    }
    postMessage({
      positions: items,
      energys: sum_of_energy
    });
  }
};

