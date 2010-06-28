function init() {
  var canvas = $('canvas');

  // Processing のソースコードが書かれた script 要素
  var codeElm = $('processing-code');
  // 要素の内容を取得する
  var code = codeElm.textContent || codeElm.innerText;

  Processing(canvas, code);
}
