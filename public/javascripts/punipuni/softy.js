(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var canvas = $('#canvas')[0].getContext('2d');

  var Ball = function(){
    this.x = Math.floor(Math.random()*global_width+1);
    this.y = Math.floor(Math.random()*global_height+1);
    this.vx = 0;
    this.vy = 0;
    this.radius = 5;
    this.range = this.radius;
    this.rgb = 'rgb('+Math.floor(Math.random()*255+1)+','+Math.floor(Math.random()*255+1)+','+Math.floor(Math.random()*255+1)+')';
    this.mass = this.radius * this.radius;
    this.reposition = function(x,y){
      this.x = x;
      this.y = y;
      this.vx = 0;
      this.vy = 0;
    };
    this.resize = function(r){
      this.radius = r;
      this.range = this.radius;
      this.mass = this.radius * this.radius;
    };
    this.gravity = function(other, length){
      var min_dist = this.range + other.range + length;
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if (min_dist > dist){
        var force = 0.0001 * this.mass*other.mass;
        var ax = force * dx;
        var ay = force * dy;
        this.vx += ax / this.mass;
        this.vy += ay / this.mass;
        other.vx -= ax / other.mass;
        other.vy -= ay / other.mass;
      }
    };
    this.constrate = function(other, length, buffer){
      //canvas.beginPath();
      //canvas.moveTo(this.x,this.y);
      //canvas.lineTo(other.x,other.y);
      //canvas.closePath();
      //canvas.stroke();
      var min_dist = this.range + other.range + length - buffer;
      var max_dist = this.range + other.range + length + buffer;
      var dx = other.x - this.x;
      var dy = other.y - this.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      if (dist > 0){
        var scale = 0;
        if (dist <= min_dist){
          scale = min_dist*min_dist/(dist*dist + min_dist*min_dist) - 0.5;
        } else if(dist >= max_dist) {
          scale = max_dist*max_dist/(dist*dist + max_dist*max_dist) - 0.5;
        }
        this.x -= dx*scale;
        this.y -= dy*scale;
        other.x += dx*scale;
        other.y += dy*scale;
      }
    };
    this.tension = function(other, length, force){
      var min_dist = this.range + other.range + length;
      var dx = this.x - other.x;
      var dy = this.y - other.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var string_arg = (dist - min_dist) * force;
      var ax = string_arg * dx;
      var ay = string_arg * dy;
      this.vx -= ax / this.mass;
      this.vy -= ay / this.mass;
      other.vx += ax / other.mass;
      other.vy += ay / other.mass;
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
        this.vy = -this.vy*0.1;
      } else if(this.y > global_height - this.radius){
        this.y = global_height - this.radius;
        this.vy = -this.vy*0.1;
      }
    };
    this.move = function(){
      this.x += this.vx;
      this.y += this.vy;
      this.vx = 0.9 * this.vx;
      this.vy += 0.1;
      this.vy = 0.9 * this.vy;
    };
    this.draw = function(){
      canvas.beginPath();
      canvas.fillStyle = this.rgb;
      canvas.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
      canvas.closePath();
      canvas.fill();
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
  };
  var Softy = function(){
    this.edge_length = 24;
    this.init = function(){
      this.body_init();
      this.edge_init();
    };
    this.body_init = function(){
      this.body = new Ball();
      this.body.x = Math.floor(Math.random()*global_width+1);
      this.body.y = Math.floor(Math.random()*global_height+1);
      this.body.vx = Math.random() * 10 - 5;
      this.body.vy = Math.random() * 10 - 5;
    };
    this.edge_init = function(){
      this.edges = new Array(this.edge_length);
      var radian_unit = 2 * Math.PI / this.edge_length;
      for (var i=0;i<this.edge_length;i++){
        var edge = new Ball();
        var cos = Math.cos(i * radian_unit);
        var sin = Math.sin(i * radian_unit);
        edge.reposition(60*cos+this.body.x, 60*sin+this.body.y);
        this.edges[i] = edge;
      }
    };
    this.collision = function(other){
    };
    this.in_poly = function(px, py){
      var c = false;
      for (var i=0; i<this.edge_length; i++){
        var edge_i = this.edges[i];
        var edge_j = this.edges[(i+1)%this.edge_length];
        if (((edge_i.y>py)!=(edge_j.y>py))
            && (px<(edge_j.x-edge_i.x)*(py-edge_i.y)/(edge_j.y-edge_i.y)+edge_i.x)){
          c = !c;
        }
      }
      return c;
    };
    this.is_intersected = function(p1, p2, p3, p4){
      var s1_x = p2.x-p1.x;
      var s1_y = p2.y-p1.y;
      var s2_x = p4.x-p3.x;
      var s2_y = p4.y-p3.y;
      var s = (-s1_y * (p1.x - p3.x) + s1_x * (p1.y - p3.y)) / (-s2_x * s1_y + s1_x * s2_y);
      var t = ( s2_x * (p1.y - p3.y) - s2_y * (p1.x - p3.x)) / (-s2_x * s1_y + s1_x * s2_y);
      return (s >= 0 && s <= 1 && t >= 0 && t <= 1);
    };
    this.update = function(){
      for (var i=0;i<this.edge_length;i++){
        this.edges[i].tension(this.body, 50, 0.03);
      }
      for (var i=0;i<this.edge_length;i++){
        var edge = this.edges[i];
        edge.tension(this.edges[(i+1) % this.edge_length], 10, 0.03);
        edge.constrate(this.edges[(i+this.edge_length/6|0) % this.edge_length], 50, 10);
        edge.constrate(this.edges[(i+this.edge_length/3|0) % this.edge_length], 75, 10);
      }
      for (var i=0;i<this.edge_length;i++){
        var edge = this.edges[i];
        edge.move();
        edge.bounce();
        //edge.draw();
      }
      this.body.move();
      this.body.bounce();
      //this.body.draw();
      this.draw();
    };
    this.draw = function(){
      canvas.beginPath();
      canvas.strokeStyle = 'rgb(0,0,0)';
      var xs = [];
      var ys = [];
      for (var i=0;i<=this.edge_length*2;i++){
        var edge = this.edges[i%this.edge_length];
        xs[i] = edge.x;
        ys[i] = edge.y;
      }
      var ps = new PSpline2(xs,ys);
      var point = ps.interpolate(0.29);
      canvas.moveTo(point.x,point.y);
      for(var i=0.3;i<=0.8;i+=0.01){
        var point = ps.interpolate(i);
        canvas.lineTo(point.x,point.y);
      }
      canvas.stroke();
      canvas.closePath();
    };
  };

  var PSpline = function(xs, ys){
    var h = [];
    var d = [];
    var w = [];
    this.xs = xs;
    this.length = this.xs.length-1;
    this.ys = ys;
    this.zs = [];
    this.zs[0] = 0;
    this.zs[this.length] = 0;
    for (var i=0;i<this.length;i++){
      h[i] = this.xs[i+1] - this.xs[i];
      w[i] = (this.ys[i+1] - this.ys[i]) / h[i];
    }
    w[this.length] = w[0];
    for(var i=1;i<this.length;i++){
      d[i] = 2*(this.xs[i+1]-this.xs[i-1]);
    }
    d[this.length] = 2 * (h[this.length-1] - h[0]);
    for(var i=1;i<=this.length;i++){
      this.zs[i] = w[i] - w[i-1];
    }
    w[1] = h[0];
    w[this.length-1] = h[this.length-1];
    w[this.length] = d[this.length];
    for(i=2;i<this.length-1;i++){
      w[i]=0;
    }
    w[0] = w[this.length];
    this.zs[0] = this.zs[this.length];
    for(var i=this.length-2;i>=0;i--){
      var t = h[i]/d[i+1];
      this.zs[i] -= this.zs[i+1]*t;
      w[i] -= w[i+1]*t;
    }
    var t = this.zs[0] / w[0];
    this.zs[0] = t;
    this.zs[this.length] = t;
    for(var i=1;i<this.length;i++){
      this.zs[i]=(this.zs[i]-w[i]*t) / d[i];
    }

    this.interpolate = function(t){
      var period = this.xs[this.length]-this.xs[0];
      while(t > this.xs[this.length]){
        t -= period;
      }
      while(t < this.xs[0]){
        t += period;
      }
      var i=0;
      var j=this.length;
      while(i<j){
        var k = (i+j)/2|0;
        if(this.xs[k]<t){
          i=k+1;
        }else{
          j=k;
        }
      }
      if(i>0){
        i--;
      }
      var h = this.xs[i+1] - this.xs[i];
      var d = t - this.xs[i];
      return (((this.zs[i+1]-this.zs[i])*d/h+this.zs[i]*3)*d+((this.ys[i+1]-this.ys[i])/h-(this.zs[i]*2+this.zs[i+1])*h))*d+this.ys[i];
    };
  };

  var PSpline2 = function(xs, ys){
    this.length = xs.length;
    this.ps = [];
    this.ps[0] = 0;
    for(var i=1;i<this.length;i++){
      var t1 = xs[i] - xs[i-1];
      var t2 = ys[i] - ys[i-1];
      this.ps[i] = this.ps[i-1] + Math.sqrt(t1*t1+t2*t2);
    }
    for(var i=1;i<this.length;i++){
      this.ps[i] /= this.ps[this.length-1];
    }

    this.sx = new PSpline(this.ps,xs);
    this.sy = new PSpline(this.ps,ys);

    this.interpolate = function(t){
      return {
        x: this.sx.interpolate(t),
        y: this.sy.interpolate(t)
      }
    };
  };

  var pic_length = 2;
  var pics;
  var initialize = function(){
    pics = new Array(pic_length);
    for(var i=0;i<pic_length;i++){
      var pic = new Softy();
      pic.init();
      pics[i] = pic;
    }
  };

  var update = function(){
    canvas.clearRect(0,0,global_width,global_height);
    for(var i=0;i<pic_length;i++){
      pics[i].update();
    }
    for(var i=0;i<pic_length;i++){
      var pic1 = pics[i];
      for(var j=i+1;j<pic_length;j++){
        pic1.collision(pics[j]);
      }
    }
  };

  var timer_id;
  $(document).ready(function(){
    initialize();
    timer_id = setInterval(update, 1000/30);
  });
})(jQuery);
