(function($){
  var sorter = function(){
    this.bar_resize = function(idx, size, klass){
      $('#bar'+idx)
        .css({width: '' + size*2 + 'pt'})
        .addClass(klass);
    };
    this.init = function(elems,offset,type){
      this.elems = elems;
      this.entries = [];
      this.length = this.elems.length;
      this.offset = offset;
      this.type = type;
    };
    this.swap = function(i, j){
      var temp = this.elems[i];
      this.elems[i] = this.elems[j];
      this.elems[j] = temp;
      this.entries.push([i, this.elems[i], j, this.elems[j]]);
    };
    this.animate = function (){
      $('#' + this.type + ' .base').removeClass('base');
      $('#' + this.type + ' .comp').removeClass('comp');
      if (this.entries.length > 0){
        var entry = this.entries.shift();
        this.bar_resize(entry[0]+this.offset, entry[1], 'base');
        this.bar_resize(entry[2]+this.offset, entry[3], 'comp');
        setTimeout(function(obj){return function(){obj.animate()};}(this), 50);
      }
    };
    this.busort = function(){
      for(var i=0;i<this.length;i++){
        for(var j=this.length-1;j>i;j--){
          if(this.elems[j]<this.elems[j-1]){
            this.swap(j,j-1);
          }
        }
      }
    };
    this.stsort = function(){
      for(var i=0;i<this.length;i++){
        for(var j=1;j<this.length-i+1;j++){
          if(this.elems[j]<this.elems[j-1]){
            this.swap(j-1,j);
          }
        }
      }
    };
    this.sesort = function(){
      for(var i=0;i<this.length;i++){
        for(var j=i+1;j<this.length;j++){
          if(this.elems[i]>this.elems[j]){
            this.swap(i,j);
          }
        }
      }
    };
    this.insort = function(){
      for(var i=1;i<this.length;i++){
        for(var j=i-1;j>=0;j--){
          if(this.elems[j]>this.elems[j+1]){
            this.swap(j,j+1);
          } else {
            break;
          }
        }
      }
    };
    this.heap_left = function(i){
      return 2*i+1;
    };
    this.heap_right = function(i){
      return 2*i+2;
    };
    this.heapify = function(i,heapsize){
      var left = this.heap_left(i);
      var right = this.heap_right(i);
      if(left<heapsize && this.elems[left]>this.elems[i]){
        var largest = left;
      } else {
        var largest = i;
      }
      if(right<heapsize && this.elems[right]>this.elems[largest]){
        var largest = right;
      }
      if(largest != i){
        this.swap(i,largest);
        this.heapify(largest,heapsize);
      }
    };
    this.buildHeap = function(){
      var heapsize=this.length;
      for(var i=Math.floor((heapsize-1)/2);i>=0;i--){
        this.heapify(i,heapsize);
      }
      return heapsize;
    };
    this.hesort = function(){
      var heapsize = this.buildHeap();
      for(var i=this.length-1;i>0;i--){
        this.swap(0,i);
        this.heapify(0,--heapsize);
      }
    };
    this.qusort = function(){
      this.qusort_sub(0,this.length-1);
    };
    this.qusort_sub = function(start,end){
      var x = (this.elems[start] + this.elems[end])/2;
      var i = start;
      var j = end;
      while(true){
        while(this.elems[i++]<x){}
        while(x<this.elems[j--]){}
        if(--i>=++j){
          break;
        }
        this.swap(i++,j--);
      }
      if(start<i-1){
        this.qusort_sub(start,i-1);
      }
      if(j+1<end){
        this.qusort_sub(j+1,end);
      }
    };
    this.shsort = function(){
      var h = 13;
      while(h<this.length-1){
        h = 3*h+1;
      }
      h = Math.round(h/9);
      var i,j,key;
      while(h>0){
        for(i=h;i<this.length;i++){
          key = this.elems[i];
          for(j=i-h;j>=0 && this.elems[j]>key;j -= h){
            this.swap(j+h,j);
          }
          this.elems[j+h]=key;
        }
        h = Math.round(h/3);
      }
    };
    this.cosort = function(){
      var shr = 1.3;
      var gap = this.length;
      var i,j,swapped;
      do{
        gap=Math.floor(gap/shr);
        if(gap===0){
          gap=1;
        }
        if(gap===9 || gap===10){
          gap=11;
        }
        swapped = false;
        for(i=0,j=gap;j<this.length;i++,j++){
          if(this.elems[i]>this.elems[j]){
            this.swap(i,j);
            swapped=true;
          }
        }
      } while(gap>1 || swapped);
    };
    this.mesort = function(){
      this.mesort_sub(0,this.length-1);
    };
    this.mesort_sub = function(first,last){
      if(first >= last) return;
      var mid = Math.floor((first+last)/2);
      this.mesort_sub(first,mid);
      this.mesort_sub(mid+1,last);
      this.merge(first,mid,last);
    };
    this.merge = function(first,mid,last){
      var lo=first;
      var hi=last;
      var end_lo = mid;
      var start_hi = mid+1;
      while((first<=end_lo) && (start_hi<=hi)){
        if(this.elems[lo]<this.elems[start_hi]){
          lo++;
        } else {
          for(var k=start_hi-1;k>=lo;k--){
            this.swap(k,k+1);
          }
          lo++;
          end_lo++;
          start_hi++;
        }
      }
    };
  };
  var shuffle = function(ary){
    var length = ary.length;
    for(var i=0;i<length;i++){
      var j = Math.floor(Math.random()*(length-1));
      var temp = ary[i];
      ary[i] = ary[j];
      ary[j] = temp;
    }
    return ary;
  };
  $(document).ready(function(){
    var length = 70;
    var offset = 0;
    var elems = [];
    for(var i=0;i<length;i++){
      elems[i] = i+1;
    }
    elems = shuffle(elems);
    var types = {
      'busort' : 'bubble',
      'stsort' : 'stone',
      'sesort' : 'select',
      'insort' : 'insert',
      'hesort' : 'heap',
      'qusort' : 'quick',
      'shsort' : 'shell',
      'cosort' : 'comb',
      'mesort' : 'merge(inplace)'
    };
    for (var type in types){
      var target = new sorter();
      target.init([].concat(elems),offset,type);
      $('#main').append('<div id="'+type+'" class="monitor"/>');
      $('#'+type).append('<h3>'+types[type]+' sort</h3>');
      for(var i=0;i<length;i++){
        idx = i + offset;
        $('#'+type).append('<div id="bar'+idx+'" />');
        target.bar_resize(idx, target.elems[i], 'bar');
      }
      target[type]();
      target.animate();
      offset += length;
    }
  });
})(jQuery);
