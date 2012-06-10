(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var canvas = $('#canvas')[0].getContext('2d');

  var Puyodot = function(){
    this.STAGE_W = 465;
    this.STAGE_H = 465;
    this._WALL_LEFT = 0;
    this._WALL_RIGHT = 465;
    this._GROUND_LINE = 350;
    this._DOT_CONNECT_MAX = 4;
    this._DERIVATION = 3;
    this._MAP_SIZE = 200;
    this._PI = Math.PI;
    this._PI2 = 2.0 * this._PI;
    this._RADIAN90 = this._PI * 0.5;
    this._RADIAN180 = this._PI * 1.0;
    this._RADIAN270 = this._PI * -0.5;
    this._TO_DEGREE = 180 / this._PI;
    this._GRAVITY = 0.1 / this._DERIVATION;
    this._ROTATION_RATE = 0.05 / this._DERIVATION;
    this._VERTICAL_RATE = 0.2 / this._DERIVATION;
    this._MOUSE_PULL_RATE = 2.0 / this._DERIVATION;
    this._FRICTION = 0.1 / this._DERIVATION;
    this._ROTATE_FRICTION = 1 - 0.2 / this._DERIVATION;
    this._MOUSE_ROTATE_FRICTION = 1 - 0.8 / this._DERIVATION;
    this._MOUSE_MOVE_FRICTION = 1 - 0.5 / this._DERIVATION;
    this._GROUND_FRICTION = 1 - 0.2 / this._DERIVATION;
    
    this._dot_map;
    this._particle_list = [];
    this._particle_distance;
    this._w;
    this._h;

    this.init = function(){
      this._dot_map = new Dot_map();
      this._dot_map.init();
      this._dot_map.read_map();

      this._w = this._dot_map.w + 1;
      this._h = this._dot_map.h + 1;
      this._particle_distance = this._MAP_SIZE / this._w;

      var tmp_base_x = (this.STAGE_W - this._MAP_SIZE) / 2;
      var tmp_base_y = 20;
      var particle;
      for (var x = 0;x < this._w; x++){
        this._particle_list[x] = [];
        for(var y = 0;y < this._h; y++){
          particle = new Particle();
          var tmp_near_dot_list = [
            this._dot_map.is_dot(x,y),
            this._dot_map.is_dot(x-1, y),
            this._dot_map.is_dot(x-1,y-1),
            this._dot_map.is_dot(x,y-1)
          ];
          particle.connect[0] = (tmp_near_dot_list[0] || tmp_near_dot_list[3]) && x < this._w - 1;
          particle.connect[1] = (tmp_near_dot_list[1] || tmp_near_dot_list[0]) && y < this._h - 1;
          particle.connect[2] = (tmp_near_dot_list[2] || tmp_near_dot_list[1]) && 0 < x;
          particle.connect[3] = (tmp_near_dot_list[3] || tmp_near_dot_list[2]) && 0 < y;

          if(!(particle.connect[0] || particle.connect[1] || particle.connect[2] || particle.connect[3])){
            this._particle_list[x][y] = null;
          } else {
            particle.color = this._dot_map.get_color(x, y);
            particle.x = tmp_base_x + this._particle_distance * x + Math.random()*3;
            particle.y = tmp_base_y + this._particle_distance * y;
            this._particle_list[x][y] = particle;
          }
        }
      }
      for(var x = 0;x < this._w; x++){
        for(var y = 0;y < this._h; y++){
          particle = this._particle_list[x][y];
          if (particle != null){
            particle.connect[4] = particle.connect[0] && this._particle_list[x+1][y].connect[0];
            particle.connect[5] = particle.connect[1] && this._particle_list[x][y+1].connect[1];
            particle.connect[6] = particle.connect[2] && this._particle_list[x-1][y].connect[2];
            particle.connect[7] = particle.connect[3] && this._particle_list[x][y-1].connect[3];
          }
        }
      }
    };

    this.update = function(){
      for (var i=0;i<this._DERIVATION;i++){
        this.rotate();
        this.force();
        this.move();
      }
      this.draw();
    };

    this.rotate = function(){
      var particle;
      for(var x=0;x<this._w;x++){
        for(var y=0;y<this._h;y++){
          particle = this._particle_list[x][y];
          if(particle == null){
            continue;
          }
          var sub_particle;
          if (particle.connect[0]){
            sub_particle = this._particle_list[x+1][y];
            this.calc_connect_rforce(particle, sub_particle, 0);
            this.calc_connect_rforce(sub_particle, particle, this._RADIAN180);
          }
          if (particle.connect[1]){
            sub_particle = this._particle_list[x][y+1];
            this.calc_connect_rforce(particle, sub_particle, this._RADIAN90);
            this.calc_connect_rforce(sub_particle, particle, this._RADIAN270);
          }
          if (particle.connect[4]){
            sub_particle = this._particle_list[x+2][y];
            this.calc_connect_rforce(particle, sub_particle, 0);
            this.calc_connect_rforce(sub_particle, particle, this._RADIAN180);
          }
          if (particle.connect[5]){
            sub_particle = this._particle_list[x][y+2];
            this.calc_connect_rforce(particle, sub_particle, this._RADIAN90);
            this.calc_connect_rforce(sub_particle, particle, this._RADIAN270);
          }
          particle.vr *= this._ROTATE_FRICTION;
          particle.radian += particle.vr;
        }
      }
    };

    this.calc_connect_rforce = function(particle, target_particle, connect_angle){
      var angle = Math.atan2(target_particle.y - particle.y, target_particle.x - particle.x);
      particle.vr += this.ajust_radian(angle - (connect_angle + particle.radian)) * this._ROTATION_RATE;
    };

    this.force = function(){
      for(var x=0;x<this._w;x++){
        for(var y=0;y<this._h;y++){
          particle = this._particle_list[x][y];
          if(particle != null){
            var sub_particle;
            if (particle.connect[0]){
              sub_particle = this._particle_list[x+1][y];
              this.calc_connect_force(particle, sub_particle, 0, this._particle_distance);
              this.calc_connect_force(sub_particle, particle, this._RADIAN180, this._particle_distance);
            }
            if (particle.connect[1]){
              sub_particle = this._particle_list[x][y+1];
              this.calc_connect_force(particle, sub_particle, this._RADIAN90, this._particle_distance);
              this.calc_connect_force(sub_particle, particle, this._RADIAN270, this._particle_distance);
            }
            if (particle.connect[4]){
              sub_particle = this._particle_list[x+2][y];
              this.calc_connect_force(particle, sub_particle, 0, this._particle_distance * 2);
              this.calc_connect_force(sub_particle, particle, this._RADIAN180, this._particle_distance * 2);
            }
            if (particle.connect[5]){
              sub_particle = this._particle_list[x][y+2];
              this.calc_connect_force(particle, sub_particle, this._RADIAN90, this._particle_distance * 2);
              this.calc_connect_force(sub_particle, particle, this._RADIAN270, this._particle_distance * 2);
            }
            particle.ay += this._GRAVITY;
          }
        }
      }
    };

    this.calc_connect_force = function(particle, target_particle, connect_angle, distance){
      var to_angle = this.ajust_radian(connect_angle + particle.radian);
      var to_x = particle.x + Math.cos(to_angle) * distance;
      var to_y = particle.y + Math.sin(to_angle) * distance;
      var ax = (target_particle.x - to_x) * this._VERTICAL_RATE;
      var ay = (target_particle.y - to_y) * this._VERTICAL_RATE;
      particle.ax += ax;
      particle.ay += ay;
      target_particle.ax -= ax;
      target_particle.ay -= ay;
    };

    this.ajust_radian = function(radian){
      return radian - this._PI2 * Math.floor(0.5 + radian / this._PI2);
    };

    this.move = function(){
      var particle;
      for(var x=0;x<this._w;x++){
        for(var y=0;y<this._h;y++){
          particle = this._particle_list[x][y];
          if (particle != null){
            particle.ax += -this._FRICTION * particle.vx;
            particle.ay += -this._FRICTION * particle.vy;

            particle.vx += particle.ax;
            particle.vy += particle.ay;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.ax = 0;
            particle.ay = 0;

            if (0 < particle.vy && this._GROUND_LINE < particle.y){
              particle.y = this._GROUND_LINE;
              particle.vy *= -0.8;
              if (particle.vy < -50){
                particle.vy = -50;
              }
              particle.vx *= this._GROUND_FRICTION;
            }
            if (particle.vx < 0 && particle.x < this._WALL_LEFT){
              particle.x = this._WALL_LEFT;
              particle.vx = 0;
              particle.vy *= this._GROUND_FRICTION;
            } else if (0 < particle.vx && this._WALL_RIGHT < particle.x){
              particle.x = this._WALL_RIGHT;
              particle.vx = 0;
              particle.vy *= this._GROUND_FRICTION;
            }
          }
        }
      }
    };

    this.draw = function(){
      canvas.clearRect(0,0,global_width,global_height);
      var particle;
      for(var y = 0; y<this._h-1;y++){
        for(var x = 0; x<this._w-1;x++){
          if(this._dot_map.is_dot(x,y)){
            canvas.beginPath();
            canvas.fillStyle = this._dot_map.get_color(x,y);
            particle = this._particle_list[x][y];
            canvas.moveTo(particle.x, particle.y);
            particle = this._particle_list[x+1][y];
            canvas.lineTo(particle.x, particle.y);
            particle = this._particle_list[x+1][y+1];
            canvas.lineTo(particle.x, particle.y);
            particle = this._particle_list[x][y+1];
            canvas.lineTo(particle.x, particle.y);
            canvas.fill();
            canvas.closePath();
          }
        }
      }
    };
  };

  var Particle = function(){
      this.x = 0;
      this.y = 0;
      this.vx = 0;
      this.vy = 0;
      this.ax = 0;
      this.ay = 0;
      this.radian = 0;
      this.vr = 0;
      this.color = "#000000";
      this.connect = [true, true, true, true];
  };

  var Dot_map = function(){
    this.w = 16;
    this.h = 16;

    this.pallet = [];
    this.str_pallet = [];
    this.str_map = '';
    this.map = [];
    this.init = function(){
      this.w = 16;
      this.h = 16;
      this.pallet = ["#000000", "#00cc33", "#ffffff", "#000000"];
      this.str_pallet = ["＿", "×", "□", "■"];
      this.str_map =
                "＿＿＿＿＿■■■■■■＿＿＿＿＿"+
                "＿＿＿■■□□××××■■＿＿＿"+
                "＿＿■□□□□××××□□■＿＿"+
                "＿■□□□□××××××□□■＿"+
                "＿■□□□××□□□□××□■＿"+
                "■×××××□□□□□□×××■"+
                "■×□□××□□□□□□×××■"+
                "■□□□□×□□□□□□××□■"+
                "■□□□□××□□□□××□□■"+
                "■×□□×××××××××□□■"+
                "■×××■■■■■■■■××□■"+
                "＿■■■□□■□□■□□■■■＿"+
                "＿＿■□□□■□□■□□□■＿＿"+
                "＿＿■□□□□□□□□□□■＿＿"+
                "＿＿＿■□□□□□□□□■＿＿＿"+
                "＿＿＿＿■■■■■■■■＿＿＿＿"+
                "";
    };
    this.read_map = function(){
      for(var i=0;i<this.w*this.h;i++){
        this.map.push(this.str_pallet.indexOf(this.str_map.substring(i,i+1)));
      }
      console.log(this.map);
    };
    this.is_dot = function(x,y){
      if ((x < 0 || y < 0 || this.w <= x || this.h <= y)
        || (this.map[x+y*this.w] == 0)){
        return false;
      } else {
        return true;
      }
    };
    this.get_color = function(x,y){
      if (x < 0 || y < 0 || this.w <= x || this.h <= y){
        return 0;
      } else {
        return this.pallet[this.map[x+y*this.w]];
      }
    };
  };

  var pic;
  var initialize = function(){
    pic = new Puyodot();
    pic.init();
  };

  var update = function(){
    pic.update();
  };

  var timer_id;
  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/30);
  });
})(jQuery);

