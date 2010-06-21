//交換回数カウントと途中経過の保存用
var rid = 0;
var maxrid = 0;
var steps = $A([]);

//初期化
function init(){
  steps.clear();
  maxrid=0;
  var num = $A($R(1,120));
  shuffle(num);
  reserved(num);
  return num;
}

//適当にまぜる
function shuffle(num){
  for(i=num.length-1;i>=0;i--){
    var j = Math.ceil(Math.random()*(num.length-1));
    swap_without_record(num,i,j);
  }
}

function swap_without_record(num,i,j){
  var temp = num[i];
  num[i] = num[j];
  num[j] = temp;
}

//交換し途中経過を記録
function swap(num,i,j){
  swap_without_record(num,i,j);
  reserved(num);
}

//途中経過を一度に記録して後に表示するための記憶
function reserved(num){
  maxrid++;
  steps.push([].concat(num));
}

//表示(外部参照用)
function present(){
  rid=0;
  $("main").innerHTML = "";  
  present_sub();
}

//表示(内部実行用)
function present_sub(){
  if(rid<maxrid){
    var disp = steps[rid].map(function(i){return "<div class='bar' style='width:" + i*3 + "pt'></div>";});
    rid++;
    $("status").innerHTML = "sorting now ... (" + rid + "/" + maxrid + " steps)";
    $("main").innerHTML = disp.join("");

    setTimeout("present_sub()",10);
  } else {
    $("status").innerHTML = "finish sorting!(" + maxrid + " steps)";
  }
}

//バブルソート
function busort(num){
  var k = num.length-1;
  while(k>=0){
    var j = -1;
    for(i=1;i<=k;i++){
      if(num[i-1]>num[i]){
        j=i-1;
        swap(num,i,j);
      }
    }
  k=j;
  }
}

//挿入ソート
function insort(num){
  for(j=1;j<num.length;j++){
    var key = num[j];
    for(i=j-1;i>=0;i--){
      if(num[i]>key){
        swap(num,i,i+1);
      } else {
        break;
      }
    }
    num[i+1] = key;
  }
}

//ヒープソート
function heapLeft(i){
  return 2*i+1;
}

function heapRight(i){
  return 2*i+2;
}

function heapify(num,i,heapsize){
  var left = heapLeft(i);
  var right = heapRight(i);
  if(left<=heapsize && num[left]>num[i]){
    var largest = left;
  } else {
    var largest = i;
  }
  if(right<=heapsize && num[right]>num[largest]){
    var largest = right;
  }
  if(largest != i){
    swap(num,i,largest);
    heapify(num,largest,heapsize);
  }
}

function buildHeap(num){
  var heapsize=num.length-1;
  for(i=Math.floor((num.length-1)/2);i>=0;i--){
    heapify(num,i,heapsize);
  }
  return heapsize;
}

function hesort(num){
  var heapsize = buildHeap(num);
  for(i=num.length-1;i>0;i--){
    swap(num,0,i);
    heapsize--;
    heapify(num,0,heapsize);
  }
}

//クイックソート
function qusort(num){
  qusort_sub(num,0,num.length-1);
}

function qusort_sub(num,start,end){
  var x = num[Math.floor((start+end)/2)];
  var i = start;
  var j = end;
  while(true){
    while(num[i]<x) i++;
    while(x<num[j]) j--;
    if(i>=j) break;
    swap(num,i,j);
    i++;
    j--;
  }
  if(start<i-1) qusort_sub(num,start,i-1);
  if(j+1<end) qusort_sub(num,j+1,end);
}

//SHELLソート
function shsort(num){
  var h = 13;
  while(h<num.length-1){
    h = 3*h+1;
  }
  h = Math.round(h/9);
  while(h>0){
    for(i=h;i<num.length;i++){
      var key = num[i];
      for(j=i-h;j>=0 && num[j]>key;j -= h){
        swap(num,j+h,j);
      }
      num[j+h]=key;
    }
    h = Math.round(h/3);
  }
}

//櫛ソート
function cosort(num){
  var shr = 1.3;
  var gap = num.length;
  do{
    gap=Math.floor(gap/shr);
    if(gap==0){
      gap=1;
    }
    if(gap==9 || gap==10){
      gap=11;
    }
    var swapped = false;
    for(i=0,j=gap;j<num.length;i++,j++){
      if(num[i]>num[j]){
        swap(num,i,j);
        swapped=true;
      }
    }
  } while(gap>1 || swapped);
}

//マージソート
function mesort(num){
  mesort_sub(num,0,num.length-1);
}

function mesort_sub(num,first,last){
  if(first >= last) return;
  var mid = Math.floor((first+last)/2);
  mesort_sub(num,first,mid);
  mesort_sub(num,mid+1,last);
  merge(num,first,mid,last);
}

function merge(num,first,mid,last){
  var lo=first;
  var hi=last;
  var end_lo = mid;
  var start_hi = mid+1;
  while((first<=end_lo) && (start_hi<=hi)){
    if(num[lo]<num[start_hi]){
      lo++;
    } else {
      for(var k=start_hi-1;k>=lo;k--){
        swap(num,k,k+1);
      }
      lo++;
      end_lo++;
      start_hi++;
    }
  }
}

function sort(str){
  var num = init();
  str = str + "sort(num)";
  eval(str);
  present();
}
