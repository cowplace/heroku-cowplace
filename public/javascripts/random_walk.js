var elements = $A($R(1,20));
var positions = $A($R(1,20));

create = function(id){
  return "<div id='material" + id + "' class='material'>●</div>";
};

draw = function(){
  $$('.material').each(function(elem,idx){
    positions[idx][0]+=parseInt(Math.random()*5);
    positions[idx][1]+=parseInt(Math.random()*5);
    elem.style.left = positions[idx][0] + 'pt';
    elem.style.top = positions[idx][1] + 'pt';
  });
};

init = function(){
  positions = positions.map(function(elem){
    return [
      parseInt(Math.random()*400),
      parseInt(Math.random()*400)
    ];
  });
  elements = elements.map(function(elem){
    return create(elem);
  });
  $('main').innerHTML = elements.join('');
  setInterval('draw()',500);
};

document.observe('dom:loaded',init);
