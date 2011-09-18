(function($){
  var Vector = function(x,y){
    this.x = x;
    this.y = y;
    this.zero = function(){
      this.x = 0;
      this.y = 0;
      return this;
    };
    this.clone = function(){
      return new Vector(this.x, this.y);
    };
    this.is_zero = function(){
      return this.x == 0 && this.y == 0;
    };
    this.set_length = function(value){
      var angle = this.get_angle();
      this.x = Math.cos(angle) * value;
      this.y = Math.sin(angle) * value;
    };
    this.get_length = function(){
      return Math.sqrt(this.lengthSQ());
    };
    this.lengthSQ = function(){
      return this.x * this.x + this.y * this.y;
    };
    this.set_angle = function(value){
      var length = this.get_length();
      this.x = Math.cos(value) * length;
      this.y = Math.sin(value) * length;
    };
    this.get_angle = function(){
      return Math.atan2(this.y, this.x);
    };
    this.normalize = function(){
      var length = this.get_length();
      if (length == 0){
        this.x = 1;
      } else {
        this.x /= length;
        this.y /= length;
      }
      return this;
    };
    this.is_normalized = function(){
      return this.get_length() == 1.0;
    };
    this.truncate = function(max){
      this.set_length(Math.min(max, this.get_length()));
      return this;
    };
    this.reverse = function(){
      this.x = -this.x;
      this.y = -this.y;
      return this;
    };
    this.dot_prod = function(other){
      return this.x * other.x + this.y * other.y;
    };
    this.angle_between = function(v1, v2){
      if (!v1.is_normalized()){
        v1 = v1.clone().normalize();
      }
      if (!v2.is_normalized()){
        v2 = v2.clone().normalize();
      }
      return Math.acs(v1.dot_prod(v2));
    };
    this.sign = function(other){
      if(get_prep().dot_prod(other) < 0){
        return -1;
      } else {
        return 1;
      }
    };
    this.get_prep = function(){
      return new Vector(-this.y, this.x);
    };
    this.dist = function(other){
      return Math.sqrt(this.distSQ(other));
    };
    this.distSQ = function(other){
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      return dx * dx + dy * dy;
    };
    this.add = function(other){
      return new Vector(this.x+other.x, this.y+other.y);
    };
    this.subtract = function(other){
      return new Vector(this.x-other.x, this.y-other.y);
    };
    this.multiply = function(value){
      return new Vector(this.x*value, this.y*value);
    };
    this.divide = function(value){
      return new Vector(this.x/value, this.y/value);
    };
    this.equal = function(other){
      return this.x == other.x && this.y == other.y;
    };
    this.toString = function(){
      return "[Vector (x:" + this.x + ", y:" + this.y + ")]";
    };
  };
  var Vehicle = function(canvas, stage_width, stage_height){
    this.canvas = canvas;
    this.stage_width = stage_width;
    this.stage_height = stage_height;
    this.WRAP = 'wrap';
    this.BOUNCE = 'bounce';
    this.edge_behavior = this.WRAP;
    this.red = Math.floor(Math.random()*255);
    this.green = Math.floor(Math.random()*255);
    this.blue = Math.floor(Math.random()*255);
    this.color = 'rgb('+this.red+','+this.green+','+this.blue+')';
    this.position = new Vector(
        Math.floor(Math.random()*this.stage_width+1),
        Math.floor(Math.random()*this.stage_height+1)
    );
    this.velocity = new Vector(
        Math.floor(Math.random()*10)-5,
        Math.floor(Math.random()*10)-5
    );
    this.external_force = new Vector(0,0);
    //this.posision = new Vector(0,0);
    //this.velocity = new Vector(0,0);
    this.max_force = 1;
    this.max_speed = 8;
    this.mass = 3.0;
    this.draw = function(){
      this.canvas.beginPath();
      this.canvas.fillStyle = this.color;
      this.canvas.arc(this.position.x, this.position.y, this.mass, 0,  Math.PI*2, true);
      this.canvas.closePath();
      this.canvas.fill();
    };
    this.bounce =function(){
      if(this.position.x > this.stage_width){
        this.position.x = this.stage_width;
        this.velocity.x = -this.velocity.x;
      } else if(this.position.x < 0){
        this.position.x = 0;
        this.velocity.x = -this.velocity.x;
      }
      if(this.position.y > this.stage_height){
        this.position.y = this.stage_height;
        this.velocity.y = -this.velocity.y;
      } else if(this.position.y < 0){
        this.position.y = 0;
        this.velocity.y = -this.velocity.y;
      }
    };
    this.wrap =function(){
      if(this.position.x > this.stage_width){
        this.position.x = 0;
      } else if(this.position.x < 0){
        this.position.x = this.stage_width;
      }
      if(this.position.y > this.stage_height){
        this.position.y = 0;
      } else if(this.position.y < 0){
        this.position.y = this.stage_height;
      }
    };
    this.update = function(){
      this.external_force.truncate(this.max_force);
      this.external_force = this.external_force.divide(this.mass);
      this.velocity = this.velocity.add(this.external_force);
      this.external_force.zero();
      this.velocity.truncate(this.max_speed);
      this.position = this.position.add(this.velocity);
      if (this.edge_behavior == this.WRAP){
        this.wrap();
      } else {
        this.bounce();
      }
    };
  };
  var SeekVehicle = function(canvas, stage_width, stage_height){
    this.vehicle = new Vehicle(canvas, stage_width, stage_height);
    this.seek = function(target){
      var desired_velocity = target.subtract(this.vehicle.position);
      desired_velocity.normalize();
      desired_velocity = desired_velocity.multiply(this.vehicle.max_speed);
      var force = desired_velocity.subtract(this.vehicle.velocity);
      this.vehicle.external_force = this.vehicle.external_force.add(force);
    };
    this.flee = function(target){
      var desired_velocity = target.subtract(this.vehicle.position);
      desired_velocity.normalize();
      desired_velocity = desired_velocity.multiply(this.vehicle.max_speed);
      var force = desired_velocity.subtract(this.vehicle.velocity);
      this.vehicle.external_force = this.vehicle.external_force.subtract(force);
    };
    this.update = function(){
      this.vehicle.update();
      this.x = this.vehicle.x;
      this.y = this.vehicle.y;
    };
    this.draw = function(){
      this.vehicle.draw();
    };
  };
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var context = $('#canvas')[0].getContext('2d');
  var vehicle;
  var timer_id;
  var vehicles = new Array();
  var num_of_vehicles = 70;
  var initialize = function(){
    for (var i=0;i<num_of_vehicles;i++){
      vehicles[i] = new SeekVehicle(context, global_width, global_height);
    }
  };
  var mouse_on = false;
  var mousepoint = new Vector(0,0);
  $('#canvas').mousedown(function(e){
    mousepoint.x = e.pageX - $('#canvas').offset().left;
    mousepoint.y = e.pageY - $('#canvas').offset().top;
    mouse_on = true;
  });
  $('#canvas').mouseup(function(e){
    mouse_on = false;
  });
  var update = function(){
    for(var i=0;i<num_of_vehicles;i++){
      var target = (i+1)%num_of_vehicles;
      var vehicle1 = vehicles[i];
      var vehicle2 = vehicles[target];
      vehicle1.seek(vehicle2.vehicle.position);
      vehicle2.flee(vehicle1.vehicle.position);
      if(mouse_on){
        vehicle1.seek(mousepoint);
      }
//      if (mousepoint.dist(vehicle1.vehicle.position) < 200){
//        vehicle1.vehicle.mass = (200 - mousepoint.dist(vehicle1.vehicle.position))/10 + 3;
//      } else {
//        vehicle1.vehicle.mass = 3.0;
//      }
    }
    context.beginPath();
    context.fillStyle = 'rgba(255,255,255,0.2)';
    context.fillRect(0,0,global_width,global_height);
    //context.clearRect(0,0,global_width,global_height);
    for(var i=0;i<num_of_vehicles;i++){
      var vehicle1 = vehicles[i];
      vehicle1.update();
      vehicle1.draw();
    }
  };
  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/30);
  });
})(jQuery);
