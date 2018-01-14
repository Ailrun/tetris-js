(function (global, factory) {
  'use strict'

  var exports

  global.tetris = global.tetris || {}
  exports = global.tetris.langUtils = global.tetris.langUtils || {}

  factory(exports)
})(this, function (exports) {
  'use strict'

  var randomIntBetween
  var deepCopy

  randomIntBetween = function (min, max) {
    if (typeof min !== 'number' ||
        typeof max !== 'number') {
      throw new TypeError('min and max parameter should be numbers')
    }

    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(min + Math.random() * (max - min))
  }

  deepCopy = function (v) {
    return JSON.parse(JSON.stringify(v))
  }

  exports.randomIntBetween = randomIntBetween
  exports.deepCopy = deepCopy
})
