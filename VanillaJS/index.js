/*
(function () {
  var playDataId = 'play-screen'
  var initialBlockInfo = {
    fixed: Array(20).fill(0).map(function () {
      return Array(10).fill(0)
    }),
    current: {
      position: {
        x: 0,
        y: 0
      },
      block: undefined
    },
    nextBlock: undefined
  }
  var colorTables = {
    fixed: [
      '#00000088',
      '#ff000088', '#00ff0088', '#0000ff88',
      '#ffff0088', '#ff00ff88', '#00ffff88',
    ],
    current: [
      '#000000',
      '#ff0000', '#00ff00', '#0000ff',
      '#ffff00', '#ff00ff', '#00ffff'
    ]
  }
  var possibleBlocks = [
    [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [1, 1, 0],
      [0, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 1, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
    [
      [0, 0, 1],
      [0, 1, 1],
      [0, 1, 0]
    ],
    [
      [1, 0, 0],
      [1, 1, 0],
      [0, 1, 0]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0],
      [0, 0, 1, 0]
    ]
  ]

  document.addEventListener('readystatechange', function () {
    if (document.readyState === 'interactive') {
      main()
    }
  })

  function main() {
    var el = document.getElementById(playDataId)
    var playData = {
      el: el,
      ctx: el.getContext('2d'),
      blockInfo: initialBlockInfo,
      size: undefined,
      lose: false
    }

    setPlayData(playData)

    gameLoop(playData)

    window.addEventListener('resize', function () {
      setPlayData(playData)
    })
  }

  function gameLoop(playData) {
    progressGame(playData)

    drawPlayData(playData)

    if (!playData.lose) {
      window.setTimeout(function () {
        gameLoop(playData)
      }, 100)
    } else {
      alert('you lose!')
    }
  }

  function progressGame(playData) {
    var blockInfo = playData.blockInfo

    if (!blockInfo.nextBlock) {
      blockInfo.nextBlock = createBlock()
    }

    if (!blockInfo.current.block) {
      blockInfo.current.position.x = getRandomInteger(4) + 3
      blockInfo.current.position.y = 0
      blockInfo.current.block = blockInfo.nextBlock
      blockInfo.nextBlock = createBlock()

      if (checkCollision(blockInfo.current, blockInfo.fixed)) {
        playData.lose = true

        while (checkCollision(blockInfo.current, blockInfo.fixed)) {
          blockInfo.current.position.y--
        }
        return
      }
    } else {
      blockInfo.current.position.y++

      if (checkCollision(blockInfo.current, blockInfo.fixed)) {
        blockInfo.current.position.y--
        merge(blockInfo)

        blockInfo.current.block = undefined
      }
    }

    function createBlock() {
      var colorCode = getRandomInteger(colorTables.current.length - 1) + 1

      return possibleBlocks[getRandomInteger(possibleBlocks.length)]
        .map(function (row) {
          return row.map(function (isBlock) {
            if (isBlock) {
              return colorCode
            } else {
              return 0
            }
          })
        })
    }

    function checkCollision(current, fixed) {
      return current.block.reduce(function (result, row, dy) {
        return row.reduce(function (rowResult, isBlock, dx) {
          var x = dx + current.position.x
          var y = dy + current.position.y

          if (x < 0 || x >= 10 ||
              y >= 20) {
            return true
          }

          if (rowResult) {
            return true
          }

          if (isBlock && y > 0) {
            return fixed[y][x] !== 0
          }

          return rowResult
        }, result)
      }, false)
    }

    function merge(blockInfo) {
      var current = blockInfo.current
      var fixed = blockInfo.fixed

      current.block.forEach(function (row, dy) {
        row.forEach(function (colorCode, dx) {
          var x = dx + current.position.x
          var y = dy + current.position.y

          if (colorCode) {
            fixed[y][x] = colorCode
          }
        })
      })
    }
  }

  function drawPlayData(playData) {
    var el = playData.el
    var ctx = playData.ctx
    var blockInfo = playData.blockInfo
    var size = playData.size
    var currentBlock
    var currentPosition

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, size.width, size.height)

    blockInfo.fixed.forEach(function (row, y) {
      row.forEach(function (colorCode, x) {
        var color = getValidColor(colorTables.fixed, colorCode)

        drawBlock(playData, x, y, color)
      })
    })

    if (blockInfo.current.block) {
      currentBlock = blockInfo.current.block
      currentPosition = blockInfo.current.position

      currentBlock.forEach(function (row, dy) {
        row.forEach(function (colorCode, dx) {
          if (colorCode) {
            var x = dx + currentPosition.x
            var y = dy + currentPosition.y
            var color = getValidColor(colorTables.current, colorCode)

            drawBlock(playData, x, y, color)
          }
        })
      })
    }

    function getValidColor(table, code) {
      if (code < table.length &&
          code >= 0) {
        return table[code]
      } else {
        return '#ffffff'
      }
    }
  }

  function drawBlock(playData, x, y, color) {
    var ctx = playData.ctx
    var blockSize = playData.blockSize

    if (x > 0 && y > 0 && x <= 10 && y <= 20) {
      ctx.fillStyle = color
      ctx.fillRect(1 + x * (blockSize + 1), 1 + (y + 1) * (blockSize + 1), blockSize, blockSize)
    }
  }

  function setPlayData(playData) {
    var el = playData.el
    var ctx = playData.ctx
    var blockSize = playData.blockSize = getSizeOfBlock()
    var size = playData.size = setSize(el, blockSize)

    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, size.width, size.height)

    function setSize(el, blockSize) {
      var height = (blockSize + 1) * 22 + 1
      var width = (blockSize + 1) * 10 + 1

      el.height = height
      el.width = width

      return {
        height: height,
        width: width,
      }
    }
  }

  function getSizeOfBlock() {
    var heightBased = (window.innerHeight - 1) / 22 | 0
    var widthBased = (window.innerWidth - 1) / 10 | 0

    return Math.min(heightBased, widthBased) - 1
  }

  function getRandomInteger(max) {
    return Math.floor(Math.random() * max)
  }
})()
*/

(function (global, factory) {
  'use strict'

  factory(global.tetris, global.document)
})(this, function (tetris, document) {
  'use strict'
  var N = 20
  var M = 10

  var main

  main = function () {
    var canvas, ctx
    var gameData, drawData
    var lastGravity

    canvas = document.body.children[0]
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx = canvas.getContext('2d')
    ctx.imageSmoothingEnabled = false;

    drawData = tetris.drawData
      .createDrawData(canvas.width, canvas.height, N, M)

    tetris.eventHerb.registerHandlers({
      keyHandler: function (key) {
        console.log('hi')
        switch (key) {
        case tetris.eventHerb.LEFT_KEY:
          gameData = tetris.gameData.moveCurrentPiece(gameData, -1, 0)
          break
        case tetris.eventHerb.RIGHT_KEY:
          gameData = tetris.gameData.moveCurrentPiece(gameData, 1, 0)
          break
        case tetris.eventHerb.DOWN_KEY:
          gameData = tetris.gameData.moveCurrentPiece(gameData, 0, 1)
          break
        case tetris.eventHerb.ROTATE_CLOCK_KEY:
          gameData = tetris.gameData.rotateCurrentPiece(gameData, true)
          break
        case tetris.eventHerb.ROTATE_COUNTERCLOCK_KEY:
          gameData = tetris.gameData.rotateCurrentPiece(gameData, false)
          break
        }
      },
      animationFrameHandler: function (time) {
        var clearedRows = 0

        if (gameData === undefined) {
          gameData = tetris.gameData
            .createGameData(time, N, M)
          lastGravity = time
        }

        if (time - lastGravity > 500) {
          clearedRows += tetris.blockUtils.checkClearableRows(gameData.field).length

          if (clearedRows > 0) {
            gameData.field = tetris.blockUtils.cleanField(gameData.field, 0)
          }

          gameData = tetris.gameData.moveCurrentPiece(gameData, 0, 1)
          lastGravity = time
        }

        tetris.mainScreen.drawMainScreen(ctx, drawData, gameData)

        gameData = tetris.gameData.conveyNewPiece(gameData)

        if (gameData.lose) {
          tetris.eventHerb.unregisterHandler(tetris.eventHerb.ANIMATION_FRAME_EVENT)
          alert("You LOSE!")
        }
      }
    })
  }

  tetris.domUtils.afterDocumentReady(document, main)
})
