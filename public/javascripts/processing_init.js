function init(code_id) {
  var stage = $('canvas_field');
  stage.innerHTML = '<canvas id="canvas" width="800" height="400" />';
  var canvas = $('canvas');
  var codeElm = $(code_id);
  var code = codeElm.text;

  Processing(canvas, code);
}
