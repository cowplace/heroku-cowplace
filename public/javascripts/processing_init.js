function init() {
  var canvas = $('canvas');
  var codeElm = $('processing-code');
  var code = codeElm.text;

  Processing(canvas, code);
}
