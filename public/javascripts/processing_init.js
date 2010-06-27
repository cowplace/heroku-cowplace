function init() {
  var canvas = document.getElementsByTagName('canvas')[0];

  // Processing のソースコードが書かれた script 要素
  var codeElm = document.getElementById('processing-code');
  // 要素の内容を取得する
  var code = codeElm.textContent || codeElm.innerText;

  Processing(canvas, code);
}
