var Environment = Class.create({
  initialize: function(){
    this.reset_array();
    this.show();
  },
  reset_array: function(){
    this.width = 150;
    this.height = 60;
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
    updated_ary = $A([]);
    for(var i=0;i<this.height;i++){
      for(var j=0;j<this.width;j++){
        updated_ary.push(this.next_status(j, i));
      }
    }
    this.cells = updated_ary;
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
    this.cells.each(function(cell, idx){
      var x = idx % w;
      var y = (idx / w).floor();
      $(y+'-'+x).className = cell;
    });
    $('status').innerHTML = '<p>alive: ' + this.cells.without('none').length + ' cells / '+ this.len + ' cells</p>';
  }
});

document.observe('dom:loaded', function(){
  e = new Environment();
  setInterval('e.update()',500);
});
