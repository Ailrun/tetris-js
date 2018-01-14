(function (global, factory) {
  'use strict'

  var exports
  var blockUtils, colorUtils, drawUtils

  global.tetris = global.tetris || {}
  exports = global.tetris.mainScreen = global.tetris.mainScreen || {}
  blockUtils = global.tetris.blockUtils
  colorUtils = global.tetris.colorUtils
  drawUtils = global.tetris.drawUtils

  factory(exports, blockUtils, colorUtils, drawUtils)
})(this, function (exports, blockUtils, colorUtils, drawUtils) {
  'use strict'

  var drawMainScreen, drawGameData

  drawMainScreen = function (ctx, drawData, gameData) {
    var main
    var offsetX, offsetY,
        width, height

    main = drawData.main
    offsetX = main.offsetX
    offsetY = main.offsetY
    width = main.width
    height = main.height

    ctx.fillStyle = 'rgb(0, 0, 0)'
    ctx.fillRect(offsetX, offsetY, width, height)

    drawGameData(ctx, drawData, gameData)
  }

  drawGameData = function (ctx, drawData, gameData) {
    var rowDim, colDim

    rowDim = gameData.field.length
    colDim = gameData.field[0].length

    if (gameData.currentPiece !== null) {
      gameData.currentPiece.blocks.forEach(function (row, dy) {
        row.forEach(function (colorCode, dx) {
          var x, y, position
          var color

          position = {}
          position.x = x = gameData.currentPosition.x + dx
          position.y = y = gameData.currentPosition.y + dy

          color = colorUtils.getColor(colorCode, true)

          if (x >= 0 && x < colDim &&
              y >= 0 && y < rowDim) {
            drawUtils.drawBlock(ctx, position, drawData, color)
          }
        })
      })
    }

    gameData.field.forEach(function (row, y) {
      row.forEach(function (colorCode, x) {
        var color, position

        color = colorUtils.getColor(colorCode, false)
        position = {
          x: x,
          y: y
        }

        drawUtils.drawBlock(ctx, position, drawData, color)
      })
    })
  }

  exports.drawMainScreen = drawMainScreen
})
