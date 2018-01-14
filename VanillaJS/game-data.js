(function (global, factory) {
  'use strict'

  var exports
  var langUtils, blockUtils

  global.tetris = global.tetris || {}
  exports = global.tetris.gameData = global.tetris.gameData || {}
  blockUtils = global.tetris.blockUtils
  langUtils = global.tetris.langUtils

  factory(exports, blockUtils, langUtils)
})(this, function(exports, blockUtils, langUtils) {
  'use strict'

  var createGameData,
      conveyNewPiece, moveCurrentPiece, rotateCurrentPiece

  createGameData = function (startTime, n, m) {
    var gameData = {}

    gameData.startTime = startTime
    gameData.lose = false
    gameData.field = blockUtils.makeMatrix(n, m, 0)
    gameData.currentPiece = null
    gameData.currentPosition = {}
    gameData.currentPosition.x = 0
    gameData.currentPosition.y = -4
    gameData.nextPiece = null

    return gameData
  }

  conveyNewPiece = function (gameData) {
    var colDim
    var newGameData = langUtils.deepCopy(gameData)
    var isCollided

    colDim = gameData.field[0].length

    if (newGameData.nextPiece === null) {
      newGameData.nextPiece = blockUtils.createPiece()
    }

    if (newGameData.currentPiece === null) {
      newGameData.currentPiece = newGameData.nextPiece
      newGameData.currentPosition.x = colDim / 2
      newGameData.currentPosition.y = -1
      newGameData.nextPiece = blockUtils.createPiece()

      isCollided =
        blockUtils.checkPieceFieldCollision(
          newGameData.currentPiece,
          newGameData.currentPosition,
          newGameData.field
        )

      if (isCollided) {
        newGameData.lose = true

        while (isCollided) {
          newGameData.currentPosition.y--

          isCollided =
            blockUtils.checkPieceFieldCollision(
              newGameData.currentPiece,
              newGameData.currentPosition,
              newGameData.field
            )
        }
      }
    }

    return newGameData
  }

  moveCurrentPiece = function (gameData, dx, dy) {
    var colDim
    var newGameData
    var isCollided

    colDim = gameData.field[0].length

    if (gameData.currentPiece !== null) {
      newGameData = langUtils.deepCopy(gameData)

      newGameData.currentPosition.x += dx
      newGameData.currentPosition.y += dy

      isCollided =
        blockUtils.checkPieceWallCollision(
          newGameData.currentPiece,
          newGameData.currentPosition,
          newGameData.field.length,
          newGameData.field[0].length
        )

      if (isCollided) {
        return gameData
      }

      isCollided =
        blockUtils.checkPieceFieldCollision(
          newGameData.currentPiece,
          newGameData.currentPosition,
          newGameData.field
        ) ||
        blockUtils.checkPieceGroundCollision(
          newGameData.currentPiece,
          newGameData.currentPosition,
          newGameData.field.length,
          newGameData.field[0].length
        )

      if (isCollided) {
        if (dy > 0) {
          newGameData.currentPosition.y -= dy

          newGameData.field =
            blockUtils.mergePieceField(
              newGameData.currentPiece,
              newGameData.currentPosition,
              newGameData.field
            )
          newGameData.currentPiece = null
        }
        newGameData.currentPosition.x -= dx
      }

      return newGameData
    }

    return gameData
  }
  
  rotateCurrentPiece = function (gameData, toClockwise) {
    var newGameData
    var isCollided

    if (gameData.currentPiece !== null) {
      newGameData = langUtils.deepCopy(gameData)

      newGameData.currentPiece =
        blockUtils.rotatePiece(newGameData.currentPiece, toClockwise)

      isCollided =
        blockUtils.checkPieceFieldCollision(
          newGameData.currentPiece,
          newGameData.currentPosition,
          newGameData.field
        )

      if (isCollided) {
        return gameData
      }

      return newGameData
    }

    return gameData
  }

  exports.createGameData = createGameData
  exports.conveyNewPiece = conveyNewPiece
  exports.moveCurrentPiece = moveCurrentPiece 
  exports.rotateCurrentPiece = rotateCurrentPiece
})
