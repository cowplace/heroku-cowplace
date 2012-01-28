(function($){
  var audio = function(){
    this.audioLibParams = [
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,500.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,600.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,700.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,800.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,900.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,1000.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,2000.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,3000.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,4000.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
      ["sine",0.0000,0.6010,0.0000,0.0980,0.4920,0.1680,20.0000,5000.0000,2400.0000,0.0000,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000]
    ];
    this.samples = jsfxlib.createWaves(this.audioLibParams);
    this.play = function(){
      var no = Math.floor(Math.random()*10);
      this.samples[no].play();
    };
  };
  var sample_sound = new audio();

  var item = function(x, y){
    this.x = x-5;
    this.y = y-5;
    this.r = 10;
    this.red = Math.floor(Math.random()*255);
    this.green = Math.floor(Math.random()*255);
    this.blue = Math.floor(Math.random()*255);
    this.color = 'rgba('+this.red+','+this.green+','+this.blue+', 0.7)';
    this.draw_circle = function(){
      context.beginPath();
      context.lineWidth = 5;
      context.strokeStyle = this.color;
      context.arc(this.x-5, this.y-5, this.r, 0,  Math.PI*2, true);
      context.stroke();
      this.r += 1;
    };
    this.draw_rect = function(){
      context.save();
      context.beginPath();
      context.lineWidth = 5;
      context.strokeStyle = this.color;
      var rad = this.r * Math.PI / 360;
      context.translate(this.x, this.y);
      context.rotate(rad);
      context.rect(-this.r/2, -this.r/2, this.r, this.r);
      context.stroke();
      context.restore();
      this.r += 1;
    };
    this.draw_triangle = function(){
      context.save();
      context.beginPath();
      context.lineWidth = 5;
      context.strokeStyle = this.color;
      var rad1 = this.r/2 * Math.PI / 180;
      var rad2 = (this.r/2-120) * Math.PI / 180;
      var rad3 = (this.r/2+120) * Math.PI / 180;
      context.translate(this.x, this.y);
      context.moveTo(Math.cos(rad1)*this.r, Math.sin(rad1)*this.r);
      context.lineTo(Math.cos(rad2)*this.r, Math.sin(rad2)*this.r);
      context.lineTo(Math.cos(rad3)*this.r, Math.sin(rad3)*this.r);
      context.closePath();
      context.stroke();
      context.restore();
      this.r += 1;
    };
    this.draw = [this.draw_circle, this.draw_rect, this.draw_triangle][Math.floor(Math.random()*3)];
  };

  var global_width = $('#main').width();
  var global_height = $('#main').height();
  $('#area').append('<canvas id="canvas" width="'+global_width+'" height="'+global_height+'" />');
  var context = $('#canvas')[0].getContext('2d');
  var items = [];

  $('#area').click(function(event){
    var pos = $(event.target).offset();
    var x = event.pageX - pos.left;
    var y = event.pageY - pos.top;
    items.push(new item(x, y));
    sample_sound.play();
  });

  var update = function(){
    context.clearRect(0,0,global_width,global_height);
    $.each(items, function(i,elem){
      elem.draw();
    });
    items = $.grep(items,function(elem){
      return elem.r <= 600;
    });
  };
  
  $(document).ready(function(){
    timer_id = setInterval(update, 1000/60);
  });
})(jQuery);
