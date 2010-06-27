var Sorter = Class.create({
  rid: 0,
  maxrid: 0,
  steps: $A([]),
  initialize: function(){
    this.reset_array();
  },
  reset_array: function(){
    this.maxrid = 0;
    this.steps.clear();
    this.len = 70;
    this.num = $A($R(1,this.len));
    this.shuffle();
    this.reserved(0, 0);
  },
  shuffle: function(){
    for(var i=0;i<this.len;i++){
      this.swap_without_record(i,(Math.random()*this.len).floor());
    }
  },
  swap_without_record: function(i,j){
    var temp = this.num[i];
    this.num[i] = this.num[j];
    this.num[j] = temp;
  },
  swap: function(i,j){
    this.swap_without_record(i,j);
    this.reserved(i, j);
  },
  reserved: function(base, comp){
    this.maxrid++;
    this.steps.push([[].concat(this.num), base, comp]);
  },
  present: function(){
    this.rid=0;
    var stage=$('main');
    stage.innerHTML = '';
    for(var i=0;i<this.len;i++){
      stage.insert('<div class="bar" />');
    }
    this.present_sub();
  },
  present_sub: function(){
    if(this.rid<this.maxrid){
      this.modified_bar();
      this.rid++;
      $("status").innerHTML = "sorting now ... (" + this.rid + "/" + this.maxrid + " steps)";
      setTimeout(function(obj){return function(){obj.present_sub()};}(this),50);
    } else {
      $("status").innerHTML = "finish sorting!(" + this.maxrid + " steps)";
    }
  },
  modified_bar: function(){
    var bars = this.steps[this.rid][0];
    var base = this.steps[this.rid][1];
    var comp = this.steps[this.rid][2];
    return function(obj){
        $$('.bar').each(function(bar,idx){
            bar.setStyle('width: ' + bars[idx]*4 + 'pt;');
            bar.className = obj.bar_class(idx,base,comp);
        });
    }(this);
  },
  bar_class: function(no, base, comp){
    var class_of_bar = 'bar';
    if (no == base){
      class_of_bar += ' base';
    } else if(no == comp) {
      class_of_bar += ' comp';
    }
    return class_of_bar;
  },

  busort: function(){
    var j=1;
    for(var i=0;i<this.len;i++){
      for(j=1;j<this.len-i+1;j++){
        if(this.num[j-1]>this.num[j]){
          this.swap(j-1,j);
        }
      }
    }
  },

  sesort: function(){
    var j=1;
    for(var i=0;i<this.len;i++){
      for(j=i+1;j<this.len;j++){
        if(this.num[i]>this.num[j]){
          this.swap(i,j);
        }
      }
    }
  },

  insort: function(){
    var j=0;
    for(var i=1;i<this.len;i++){
      for(j=i-1;j>=0;j--){
        if(this.num[j]>this.num[j+1]){
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
    if(left<heapsize && this.num[left]>this.num[i]){
      var largest = left;
    } else {
      var largest = i;
    }
    if(right<heapsize && this.num[right]>this.num[largest]){
      var largest = right;
    }
    if(largest != i){
      this.swap(i,largest);
      this.heapify(largest,heapsize);
    }
  },
  buildHeap: function(){
    var heapsize=this.len;
    for(i=((heapsize-1)/2).floor();i>=0;i--){
      this.heapify(i,heapsize);
    }
    return heapsize;
  },
  hesort: function(){
    var heapsize = this.buildHeap();
    for(i=this.len-1;i>0;i--){
      this.swap(0,i);
      this.heapify(0,--heapsize);
    }
  },

  qusort: function(){
    this.qusort_sub(0,this.len-1);
  },
  qusort_sub: function(start,end){
    var x = (this.num[start] + this.num[end])/2;
    var i = start;
    var j = end;
    while(true){
      while(this.num[i++]<x){}
      while(x<this.num[j--]){}
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
    while(h<this.len-1){
      h = 3*h+1;
    }
    h = Math.round(h/9);
    var i,j,key;
    while(h>0){
      for(i=h;i<this.len;i++){
        key = this.num[i];
        for(j=i-h;j>=0 && this.num[j]>key;j -= h){
          this.swap(j+h,j);
        }
        this.num[j+h]=key;
      }
      h = Math.round(h/3);
    }
  },

  cosort: function(){
    var shr = 1.3;
    var gap = this.len;
    var i,j,swapped;
    do{
      gap=(gap/shr).floor();
      if(gap==0){
        gap=1;
      }
      if(gap==9 || gap==10){
        gap=11;
      }
      swapped = false;
      for(i=0,j=gap;j<this.len;i++,j++){
        if(this.num[i]>this.num[j]){
          this.swap(i,j);
          swapped=true;
        }
      }
    } while(gap>1 || swapped);
  },

  mesort: function(){
    this.mesort_sub(0,this.len-1);
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
      if(this.num[lo]<this.num[start_hi]){
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
  }
});

var singleton = function(SomeClass){
  var NewClass = function(){
    throw new Error("This is Singleton-Pattern Class. Use self.getInstance().");
  };
  NewClass.__instance__ = null;
  NewClass.getInstance = function(){
    if (this.__instance__ === null){
      this.__instance__ = applyNew(SomeClass, arguments);
    }
    return this.__instance__;
  };
  function applyNew(cls, args){
    var Tmp = function(){};
    Tmp.prototype = cls.prototype;
    var instance = new Tmp;
    cls.apply(instance, args || []);
    return instance;
  };
  return NewClass;
};
Sorter = singleton(Sorter);

function sort(str){
  sorter = Sorter.getInstance();
  sorter.reset_array();
  sorter[str + 'sort']();
  sorter.present();
}

document.observe('dom:loaded',function(){
  $$('.sort').each(function(elem){
    elem.observe('click',function(){sort(elem.id);});
  });
});
