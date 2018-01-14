(function (global, factory) {
  'use strict'

  var exports
  var colorUtils

  global.tetris = global.tetris || {}
  exports = global.tetris.drawUtils = global.tetris.drawUtils || {}
  colorUtils = global.tetris.colorUtils

  factory(exports, colorUtils)
})(this, function (exports, colorUtils) {
  'use strict'

  var TOP_SUPPORT_PANEL = 'top'
  var RIGHT_SUPPORT_PANEL = 'right'

  var drawBackground, drawBlock

  drawBackground = function (ctx) {
    var width = ctx.canvas.width
    var height = ctx.canvas.height

    ctx.fillStyle = 'rgb(127, 127, 127)'
    ctx.fillRect(0, 0, width, height)
  }

  drawBlock = function (ctx, position, drawData, color) {
    var main, blockSize

    main = drawData.main
    blockSize = drawData.blockSize

    ctx.fillStyle = color
    ctx.fillRect(
      main.offsetX + position.x * blockSize + 1,
      main.offsetY + position.y * blockSize + 1,
      blockSize - 2, blockSize - 2
    )
  }

  exports.drawBlock = drawBlock
})
