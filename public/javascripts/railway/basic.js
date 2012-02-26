(function($){
  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#content').append('<canvas id="line_canvas" width="'+global_width+'" height="'+global_height+'" />');
  $('#content').append('<canvas id="train_canvas" width="'+global_width+'" height="'+global_height+'" />');
  $('#content').append('<canvas id="station_canvas" width="'+global_width+'" height="'+global_height+'" />');
  var line_canvas = $('#line_canvas')[0].getContext('2d');
  var train_canvas = $('#train_canvas')[0].getContext('2d');
  var station_canvas = $('#station_canvas')[0].getContext('2d');

  var train = function(line){
    this.speed = 2.0;
    this.line = line;
    this.pos = Math.floor(Math.random()*this.line.length);;
    this.from = this.line.positions[this.pos];
    this.to = this.line.positions[this.pos];
    this.x = this.from.x;
    this.y = this.from.y;
    this.vx = 0;
    this.vy = 0;
    this.move = function(){
      if(this.dist(this, this.to) < 1.5){
        this.pos = (this.pos+1) % this.line.length;
        if (this.pos == 0){
          if(this.line.loop){
            this.from = this.to;
          } else {
            this.from = this.line.positions[this.pos];
            this.pos = (this.pos+1) % this.line.length;
          }
        } else {
          this.from = this.to;
        }
        this.to = this.line.positions[this.pos];
        this.set_angle();
        this.x = this.from.x;
        this.y = this.from.y;
      }
      this.x += this.vx;
      this.y += this.vy;
    };
    this.draw = function(){
      train_canvas.beginPath();
      train_canvas.strokeStyle = this.line.color;
      train_canvas.lineWidth = 3;
      train_canvas.fillStyle = '#ffffff';
      train_canvas.arc(this.x, this.y, 5, 0,  Math.PI*2, true);
      train_canvas.closePath();
      train_canvas.fill();
      train_canvas.stroke();
    };
    this.set_angle = function(){
      var dx = this.to.x - this.from.x;
      var dy = this.to.y - this.from.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var cos = dx/dist;
      var sin = dy/dist;
      this.vx = cos * this.speed;
      this.vy = sin * this.speed;
    };
    this.dist = function(from,to){
      var dx = to.x - from.x;
      var dy = to.y - from.y;
      return Math.sqrt(dx*dx+dy*dy);
    };
  };

  var line = function(line_hash){
    this.name = line_hash.name;
    this.color = line_hash.color;
    this.positions = line_hash.positions;
    this.length = this.positions.length;
    this.loop = line_hash.loop;
    this.trains = [];
    this.draw = function(){
      line_canvas.beginPath();
      line_canvas.strokeStyle = this.color;
      line_canvas.lineWidth = 5;
      var pos = this.positions[0];
      line_canvas.moveTo(pos.x, pos.y);
      for(var i=1;i<this.length;i++){
        pos = this.positions[i];
        line_canvas.lineTo(pos.x, pos.y);
      }
      if(this.loop){
        line_canvas.closePath();
      }
      line_canvas.stroke();
    };
  };

  var lines = [];
  var trains = [];
  var train_length = 2;
  var line_length = 0;
  var line_initialize = function(rails_hash){
    line_length = rails_hash.length;
    for(var i=0;i<line_length;i++){
      var l = new line(rails_hash[i]);
      for(var j=0;j<train_length;j++){
        l.trains.push(new train(l));
      }
      l.draw();
      lines.push(l);
    }
  };

  var time_div = 0.0;
  var time_quota = 50;
  var line_draw = function(){
    train_canvas.clearRect(0,0,global_width,global_height);
    for(var i=0;i<line_length;i++){
      var l = lines[i]
      for(var j=0;j<train_length;j++){
        var t = l.trains[j];
        t.move();
        t.draw();
      }
    }
  };

  var station = function(station_hash){
    this.name = station_hash.name;
    this.size = {
      'S': 5,
      'M': 10,
      'L': 15,
      'LL': 20
    }[station_hash.size];
    this.x = station_hash.x;
    this.y = station_hash.y;
    this.draw = function(){
      station_canvas.beginPath();
      station_canvas.strokeStyle = '#cccccc';
      station_canvas.lineWidth = 3;
      station_canvas.fillStyle = '#ffffff';
      station_canvas.arc(this.x, this.y, this.size, 0,  Math.PI*2, true);
      station_canvas.closePath();
      station_canvas.fill();
      station_canvas.stroke();
    };
  };
  var stations = [];
  var station_length = 0;
  var station_initialize = function(stations_hash){
    station_length = stations_hash.length;
    for(var i=0;i<station_length;i++){
      var s = new station(stations_hash[i]);
      s.draw();
      stations.push(s);
    }
  };

  $(document).ready(function(){
    $.getJSON('/api/railway/tokyo.lines.json',null,function(data){
      line_initialize(data);
      setInterval(line_draw, 1000/60);
    });
    $.getJSON('/api/railway/tokyo.stations.json',null,function(data){
      station_initialize(data);
    });
  });
})(jQuery);
