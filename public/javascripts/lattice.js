var Environment = Class.create({
  initialize: function(){
    this.reset_array();
    this.show();
  },
  reset_array: function(){
    this.width = 7;
    this.height = 4;
    this.len = this.width*this.height;
    this.cells = this.set_random();
  },
  set_random: function(){
    return $A($R(1, this.len)).map(function(cell){
      if (Math.random() > 0.8){
        return 'alive';
      } else {
        return 'none';
      }
    });
  },
  update: function(){
    var update_flg = false;
    updated_ary = $A([]);
    for(var i=0;i<this.height;i++){
      for(var j=0;j<this.width;j++){
        var next = this.next_status(j, i);
        update_flg = update_flg || next == 'alive';
        updated_ary.push(next);
      }
    }
    if (update_flg && Math.random() > 0.9){
      this.cells = updated_ary;
    } else {
      this.cells = this.set_random();
    }
    this.show();
  },
  next_status: function(x, y){
    var cnt = 0;
    if(this.cells[this.position(x-1, y-1)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x-1, y)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x-1, y+1)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x, y-1)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x, y+1)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x+1, y-1)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x+1, y)] == 'alive'){
      cnt++;
    }
    if(this.cells[this.position(x+1, y+1)] == 'alive'){
      cnt++;
    }
    if(cnt == 3 || cnt == 2 && this.cells[this.position(x, y)] == 'alive'){
      return 'alive';
    } else {
      return 'none';
    }
  },
  position: function(x, y){
    return ((x+this.width) % this.width) + this.width * ((y+this.height) % this.height);
  },
  show: function(){
    var w = this.width;
    var len = $$('div.item').size();
    this.cells.each(function(cell, idx){
      var x = idx % w;
      var y = (idx / w).floor();
      $(y+'-'+x).className = cell;
      if(cell=='alive'){
        $(y+'-'+x).innerHTML = '';
      } else if($(y+'-'+x).innerHTML == ''){
        no = (Math.random()*len).floor();
        $(y+'-'+x).innerHTML = $('item' + no).innerHTML;
      }
    });
  }
});

document.observe('dom:loaded', function(){
  $('items').hide();
  e = new Environment();
  setInterval('e.update()',3000);
});
