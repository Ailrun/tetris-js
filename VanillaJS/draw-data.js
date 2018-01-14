(function (global, factory) {
  'use strict'

  var exports
  var langUtils

  global.tetris = global.tetris || {}
  exports = global.tetris.drawData = global.tetris.drawData || {}
  langUtils = global.tetris.langUtils

  factory(exports, langUtils)
})(this, function (exports, langUtils) {
  'use strict'

  var TOP_INFO = 'TOP_INFO'
  var RIGHT_INFO = 'RIGHT_INFO'

  var createDrawData
  var pregetInfoData, getInfoDirection,
      getBlockSize,
      pregetMainData

  createDrawData = function (width, height, n, m) {
    var drawData = {}
    var screen, info, blockSize, main

    drawData.screen = screen = {}
    drawData.screen.width = width
    drawData.screen.height = height
    drawData.info = info = pregetInfoData(screen, n, m)
    drawData.blockSize = blockSize =
      getBlockSize(screen, info, n, m)
    drawData.main = main = pregetMainData(blockSize, n, m)

    if (info.position === TOP_INFO) {
      info.width = main.width

      main.offsetX = (screen.width - main.width) / 2
      main.offsetY = (screen.height + info.height - main.height) / 2

      info.offsetX = main.offsetX
      info.offsetY = main.offsetY - info.height
    } else {
      info.height = main.height

      main.offsetX = (screen.width - info.width - main.width) / 2
      main.offsetY = (screen.height - main.height) / 2

      info.offsetX = main.offsetX + main.width
      info.offsetY = main.offsetY
    }

    return drawData
  }

  pregetInfoData = function (screen, n, m) {
    var info

    info = {}
    info.width = screen.width / 20 | 0
    info.height = screen.height / 10 | 0
    info.position =
      getInfoDirection(screen, info, n, m)

    if (info.position === TOP_INFO) {
      info.width = screen.width
    } else {
      info.height = screen.height
    }

    return info
  }

  getInfoDirection = function (screen, info, n, m) {
    var remainingWidth, remainingHeight

    remainingWidth =
      screen.width - info.width
    remainingHeight =
      screen.height - info.height

    if (remainingWidth / m < remainingHeight / n) {
      return TOP_INFO
    } else {
      return RIGHT_INFO
    }
  }

  getBlockSize = function (screen, info, n, m) {
    var widthBased, heightBased

    if (info.position === TOP_INFO) {
      widthBased = screen.width / m | 0
      heightBased =
        (screen.height - info.height) / n | 0
    } else {
      widthBased = (screen.width - info.width) / m | 0
      heightBased = screen.height / n | 0
    }

    return Math.min(widthBased, heightBased)
  }

  pregetMainData = function (blockSize, n, m) {
    var main

    main = {}
    main.width = blockSize * m
    main.height = blockSize * n

    return main
  }

  exports.createDrawData = createDrawData
})
