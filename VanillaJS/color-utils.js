(function (global, factory) {
  'use strict'

  var exports
  var langUtils

  global.tetris = global.tetris || {}
  exports = global.tetris.colorUtils = global.tetris.colorUtils || {}
  langUtils = global.tetris.langUtils

  factory(exports, langUtils)
})(this, function (exports, langUtils) {
  'use strict'

  var colorTable = {
    active: ['#FF1744', '#F50057', '#D500F9', '#651FFF'],
    fixed: ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2']
  }

  var createColorCode,
      getColor

  createColorCode = function () {
    return langUtils.randomIntBetween(0, colorTable.active.length) + 1
  }

  getColor = function (colorCode, isActive) {
    var colorIndex

    if (colorCode === 0) {
      return 'rgba(0, 0, 0, 0)'
    }

    colorIndex = colorCode - 1

    if (isActive) {
      return colorTable.active[colorIndex]
    } else {
      return colorTable.fixed[colorIndex]
    }
  }

  exports.createColorCode = createColorCode
  exports.getColor = getColor
})
