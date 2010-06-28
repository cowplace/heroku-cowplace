function init() {
  var canvas = $('canvas');
  var codeElm = $('processing-code');
  var code = Try.these(
      function(){return codeElm.textContent},
      function(){return codeElm.innerText},
      function(){return codeElm.text}
  );

  Processing(canvas, code);
}
