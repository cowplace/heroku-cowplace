(function($){
  var env = $.extend(Object, {
    width: 150,
    height: 80,
    init: function(){
      this.reset();
      this.show();
    },
    reset: function(){
      $('.cell').each(function(idx, elem){
        if (Math.random() > 0.8){
          $(elem).addClass('survive');
        } else {
          $(elem).addClass('die');
        }
      });
    },
    update: function(){
      for(var i=0;i<this.height;++i){
        for(var j=0;j<this.width;++j){
          $('#'+i+'-'+j).addClass(this.next_status(j, i));
        }
      }
      this.show();
    },
    next_status: function(x, y){
      var cnt = 0;
      for(var i=x-1;i<=x+1;++i){
        for(var j=y-1;j<=y+1;++j){
          if(this.alive_test(i,j)){
            cnt++;
          }
        }
      }
      if(cnt == 3 || cnt == 4 && !$('#'+x+'-'+y).hasClass('alive')){
        return 'survive';
      } else {
        return 'die';
      }
    },
    alive_test: function(x,y){
      if(x < 0 || x >= this.width || y < 0 || y >= this.height){
        return false;
      }
      return $('#'+y+'-'+x).hasClass('alive');
    },
    show: function(){
      $('.cell').each(function(idx, elem){
        $(elem)
          .removeClass('none')
          .removeClass('alive');
        if($(elem).hasClass('survive')){
          $(elem)
            .removeClass('survive')
            .addClass('alive');
        } else {
          $(elem)
            .removeClass('die')
            .addClass('none');
        }
      });
    }
  });
  $(document).ready(function(){
    env.init();
    setInterval(function(){env.update()}, 100);
  });
})(jQuery);
