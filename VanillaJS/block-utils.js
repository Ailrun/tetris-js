(function (global, factory) {
  'use strict'

  var exports
  var colorUtils, langUtils

  global.tetris = global.tetris || {}
  exports = global.tetris.blockUtils = global.tetris.blockUtils || {}
  colorUtils = global.tetris.colorUtils
  langUtils = global.tetris.langUtils

  factory(exports, colorUtils, langUtils)
})(this, function (exports, colorUtils, langUtils) {
  'use strict'

  var pieceTable = {
    J: [
      [0,1,0],
      [0,1,0],
      [1,1,0]
    ],
    L: [
      [0,1,0],
      [0,1,0],
      [0,1,1]
    ],
    T: [
      [0,0,0],
      [1,1,1],
      [0,1,0]
    ],
    S: [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ],
    Z: [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ],
    I: [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    O: [
      [1,1],
      [1,1]
    ]
  }
  var EMPTY_COLOR_CODE = 0

  var createPiece, rotatePiece,
      mergePieceField,
      checkClearableRows,
      cleanField,
      checkPieceFieldCollision,
      checkPieceWallCollision,
      checkPieceGroundCollision,
      convertPieceIntoField, makeMatrix
  var isBlock

  createPiece = function () {
    var blockKeys = Object.getOwnPropertyNames(pieceTable)
    var blockKey = blockKeys[langUtils.randomIntBetween(0, blockKeys.length)]
    var colorCode = colorUtils.createColorCode()

    return {
      type: blockKey,
      blocks: langUtils.deepCopy(pieceTable[blockKey])
      .map(function (row) {
        return row.map(function (isBlock) {
          return isBlock ? colorCode : EMPTY_COLOR_CODE
        })
      })
    }
  }

  rotatePiece = function (piece, toClockwise) {
    var blocks = piece.blocks
    var dim = blocks.length
    var result = {
      type: piece.type,
      blocks: makeMatrix(dim, dim)
    }

    blocks.forEach(function (row, rowInd) {
      row.forEach(function (colorCode, colInd) {
        var newRowInd = colInd,
            newColInd = rowInd

        if (toClockwise) {
          newRowInd = invertInd(newRowInd)
        } else {
          newColInd = invertInd(newColInd)
        }

        result.blocks[newRowInd][newColInd] = colorCode
      })
    })

    return result

    function invertInd(ind) {
      return dim - 1 - ind
    }
  }

  mergePieceField = function (piece, piecePosition, field) {
    var rowDim = field.length
    var colDim = field[0].length
    var result = langUtils.deepCopy(field)

    piece.blocks.forEach(function (row, dy) {
      row.forEach(function (colorCode, dx) {
        var x, y

        x = piecePosition.x + dx
        y = piecePosition.y + dy

        if (isBlock(colorCode) &&
            x >= 0 && x < colDim &&
            y >= 0 && y < rowDim) {
          result[y][x] = colorCode
        }
      })
    })

    return result
  }

  checkClearableRows = function (field) {
    return field.reduce(function (rows, row, rowInd) {
      console.log(rows)

      if (row.every(isBlock)) {
        return rows.concat(rowInd)
      } else {
        return rows
      }
    }, [])
  }

  cleanField = function (field, v) {
    var result = langUtils.deepCopy(field)
    var clearableRows = checkClearableRows(field)

    clearableRows.forEach(function (rowInd) {
      result.splice(rowInd, 1)
      result.splice(0, 0, Array(field[rowInd].length).fill(v))
    })

    return result
  }

  checkPieceWallCollision = function (piece, piecePosition, n, m) {
    return piece.blocks.reduce(function (result, row, dy) {
      if (result) {
        return true
      }

      return row.reduce(function (rowResult, colorCode, dx) {
        var x
        if (rowResult) {
          return true
        }

        if (!isBlock(colorCode)) {
          return rowResult
        }

        x = piecePosition.x + dx

        if (x < 0 || x >= m) {
          return true
        }

        return rowResult
      }, result)
    }, false)
  }

  checkPieceGroundCollision = function (piece, piecePosition, n, m) {
    return piece.blocks.reduce(function (result, row, dy) {
      if (result) {
        return true
      }

      return row.reduce(function (rowResult, colorCode, dx) {
        var y
        if (rowResult) {
          return true
        }

        if (!isBlock(colorCode)) {
          return rowResult
        }

        y = piecePosition.y + dy

        if (y >= n) {
          return true
        }

        return rowResult
      }, result)
    }, false)
  }

  checkPieceFieldCollision = function (piece, piecePosition, field) {
    var rowDim = field.length
    var colDim = field[0].length

    return piece.blocks.reduce(function (result, row, dy) {
      if (result) {
        return true
      }

      return row.reduce(function (rowResult, colorCode, dx) {
        var x, y

        if (rowResult) {
          return true
        }

        if (!isBlock(colorCode)) {
          return rowResult
        }

        x = piecePosition.x + dx
        y = piecePosition.y + dy

        if (x < 0 ||
            x >= colDim ||
            y < 0 ||
            y >= rowDim) {
          return rowResult
        }

        return isBlock(field[y][x])
      }, result)
    }, false)
  }

  makeMatrix = function (n, m, v) {
    return Array(n).fill(0).map(function () {
      return Array(m).fill(v)
    })
  }

  isBlock = function (colorCode) {
    return colorCode !== EMPTY_COLOR_CODE
  }

  exports.createPiece = createPiece
  exports.rotatePiece = rotatePiece
  exports.mergePieceField = mergePieceField
  exports.checkClearableRows = checkClearableRows
  exports.cleanField = cleanField
  exports.checkPieceFieldCollision = checkPieceFieldCollision
  exports.checkPieceGroundCollision = checkPieceGroundCollision
  exports.checkPieceWallCollision = checkPieceWallCollision
  exports.makeMatrix = makeMatrix
})
