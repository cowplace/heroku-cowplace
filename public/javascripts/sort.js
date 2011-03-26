(function($){
  var bar_resize = function(idx, size, klass){
    $('#bar'+idx)
      .css({width: '' + size*4 + 'pt'})
      .addClass(klass);
  };
  var length = 70;
  var rows = [];
  rows = $.extend(rows, {
    entries: [],
    swap_without_record: function(i, j){
      var temp = this[i];
      this[i] = this[j];
      this[j] = temp;
      return this;
    },
    shuffle: function(){
      var i = this.length
      for(var i=0;i<this.length;i++){
        this.swap_without_record(i, Math.floor(Math.random()*(this.length-1)));
      }
      return this;
    },
    init: function(length){
      this.entries = [];
      this.step = 0;
      for(var i=0;i<length;i++){
        this[i] = i+1;
      }
      return this.shuffle();
    },
    swap: function(i, j){
      this.swap_without_record(i,j);
      this.entries.push([i, this[i], j, this[j]]);
    },
    animate: function (){
      $('.base').removeClass('base');
      $('.comp').removeClass('comp');
      if (this.entries.length > 0){
        var entry = this.entries.shift();
        bar_resize(entry[0], entry[1], 'base');
        bar_resize(entry[2], entry[3], 'comp');
        setTimeout(function(obj){return function(){obj.animate()};}(this), 50);
      }
    },
    busort: function(){
      for(var i=0;i<this.length;i++){
        for(var j=1;j<this.length-i+1;j++){
          if(this[j-1]>this[j]){
            this.swap(j-1,j);
          }
        }
      }
    },
    sesort: function(){
      for(var i=0;i<this.length;i++){
        for(var j=i+1;j<this.length;j++){
          if(this[i]>this[j]){
            this.swap(i,j);
          }
        }
      }
    },
    insort: function(){
      for(var i=1;i<this.length;i++){
        for(var j=i-1;j>=0;j--){
          if(this[j]>this[j+1]){
            this.swap(j,j+1);
          } else {
            break;
          }
        }
      }
    },
    heapLeft: function(i){
      return 2*i+1;
    },
    heapRight: function(i){
      return 2*i+2;
    },
    heapify: function(i,heapsize){
      var left = this.heapLeft(i);
      var right = this.heapRight(i);
      if(left<heapsize && this[left]>this[i]){
        var largest = left;
      } else {
        var largest = i;
      }
      if(right<heapsize && this[right]>this[largest]){
        var largest = right;
      }
      if(largest != i){
        this.swap(i,largest);
        this.heapify(largest,heapsize);
      }
    },
    buildHeap: function(){
      var heapsize=this.length;
      for(var i=Math.floor((heapsize-1)/2);i>=0;i--){
        this.heapify(i,heapsize);
      }
      return heapsize;
    },
    hesort: function(){
      var heapsize = this.buildHeap();
      for(var i=this.length-1;i>0;i--){
        this.swap(0,i);
        this.heapify(0,--heapsize);
      }
    },
    qusort: function(){
      this.qusort_sub(0,this.length-1);
    },
    qusort_sub: function(start,end){
      var x = (this[start] + this[end])/2;
      var i = start;
      var j = end;
      while(true){
        while(this[i++]<x){}
        while(x<this[j--]){}
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
    },
    shsort: function(){
      var h = 13;
      while(h<this.length-1){
        h = 3*h+1;
      }
      h = Math.round(h/9);
      var i,j,key;
      while(h>0){
        for(i=h;i<this.length;i++){
          key = this[i];
          for(j=i-h;j>=0 && this[j]>key;j -= h){
            this.swap(j+h,j);
          }
          this[j+h]=key;
        }
        h = Math.round(h/3);
      }
    },
    cosort: function(){
      var shr = 1.3;
      var gap = this.length;
      var i,j,swapped;
      do{
        gap=Math.floor(gap/shr);
        if(gap==0){
          gap=1;
        }
        if(gap==9 || gap==10){
          gap=11;
        }
        swapped = false;
        for(i=0,j=gap;j<this.length;i++,j++){
          if(this[i]>this[j]){
            this.swap(i,j);
            swapped=true;
          }
        }
      } while(gap>1 || swapped);
    },
    mesort: function(){
      this.mesort_sub(0,this.length-1);
    },
    mesort_sub: function(first,last){
      if(first >= last) return;
      var mid = Math.floor((first+last)/2);
      this.mesort_sub(first,mid);
      this.mesort_sub(mid+1,last);
      this.merge(first,mid,last);
    },
    merge: function(first,mid,last){
      var lo=first;
      var hi=last;
      var end_lo = mid;
      var start_hi = mid+1;
      while((first<=end_lo) && (start_hi<=hi)){
        if(this[lo]<this[start_hi]){
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
    },
  });
  var sort = function(str){
    rows.init(length);
    for(var i=0;i<length;i++){
      $('#main').append('<div id="bar'+i+'" />');
      bar_resize(i, rows[i], 'bar');
    }
    rows[str+'sort']();
    rows.animate();
  };
  $(document).ready(function(){
    $('.sort').each(function(idx, elem){
      $(elem).click(function(){sort(elem.id);});
    });
  });
})(jQuery);
