(function (global, factory) {
  'use strict'

  var exports

  global.tetris = global.tetris || {}
  exports = global.tetris.domUtils = global.tetris.domUtils || {}

  factory(exports)
})(this, function (exports) {
  'use strict'

  var afterDocumentReady

  afterDocumentReady = function (document, handler) {
    var wrapper

    wrapper = function () {
      if (document.readyState === 'interactive') {
        handler()
        document.removeEventListener('readystatechange', wrapper)
      }
    }

    document.addEventListener('readystatechange', wrapper)
  }

  exports.afterDocumentReady = afterDocumentReady
})
