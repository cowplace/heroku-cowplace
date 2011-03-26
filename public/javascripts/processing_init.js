function init(code_id) {
  (function($){
    $('#stage').append('<canvas id="canvas" width="800" height="400" />');
    var canvas = $('#canvas')[0];
    var codeElm = $('#'+code_id)[0];
    var code = codeElm.text;

    Processing(canvas, code);
  })(jQuery);
}
