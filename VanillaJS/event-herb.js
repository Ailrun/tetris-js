(function (global, factory) {
  'use strict'

  var exports

  global.tetris = global.tetris || {}
  exports = global.tetris.eventHerb = global.tetris.eventHerb || {}

  factory(exports, global, global)
})(this, function (exports, eventEmitter, animationFrame) {
  'use strict'

  var LEFT_KEY = 'LEFT',
      RIGHT_KEY = 'RIGHT',
      DOWN_KEY = 'DOWN',
      ROTATE_CLOCK_KEY = 'ROTATE_CLOCK',
      ROTATE_COUNTERCLOCK_KEY = 'ROTATE_COUNTERCLOCK'
  var KEY_EVENT = 'KEY',
      ANIMATION_FRAME_EVENT = 'ANIMATION_FRAME'

  exports.LEFT_KEY = LEFT_KEY
  exports.RIGHT_KEY = RIGHT_KEY
  exports.DOWN_KEY = DOWN_KEY
  exports.ROTATE_CLOCK_KEY = ROTATE_CLOCK_KEY
  exports.ROTATE_COUNTERCLOCK_KEY = ROTATE_COUNTERCLOCK_KEY
  exports.KEY_EVENT = KEY_EVENT
  exports.ANIMATION_FRAME_EVENT = ANIMATION_FRAME_EVENT

  var addEventListener = eventEmitter.addEventListener
  var removeEventListener = eventEmitter.removeEventListener
  var requestAnimationFrame = animationFrame.requestAnimationFrame
  var cancelAnimationFrame = animationFrame.cancelAnimationFrame

  var registedHandlers
  var registerHandlers, registerKeyHandler,
      registerAnimationFrameHandler
  var unregisterHandler, unregisterKeyHandler,
      unregisterAnimationFrameHandler
  var defaultOptions
  var keyEventType = 'keypress'

  registedHandlers = {}
  defaultOptions = {
    keyThrottle: 0,
    keyOptions: {
      left: 'ArrowLeft',
      right: 'ArrowRight',
      down: 'ArrowDown',
      rotateClockwise: 'ArrowUp',
      rotateCounterClockwise: '?',
    },
    animationFrameThrottle: 0,
  }

  registerHandlers = function (options) {
    options = Object.assign({}, defaultOptions, options)

    if (options.keyHandler) {
      options.keyOptions =
        Object.assign({}, defaultOptions.keyOptions, options.keyOptions)

      registerKeyHandler(
        options.keyHandler, options.keyThrottle, options.keyOptions
      )
    }

    if (options.animationFrameHandler) {
      registerAnimationFrameHandler(
        options.animationFrameHandler, options.animationFrameThrottle
      )
    }
  }

  unregisterHandler = function (type) {
    if (typeof type !== 'string') {
      throw new TypeError('type should be a string')
    }

    switch (type) {
    case KEY_EVENT:
      unregisterKeyHandler()
      break
    case ANIMATION_FRAME_EVENT:
      unregisterAnimationFrameHandler()
      break
    default:
      throw new Error('type is not the one of the event types')
    }
  }

  registerKeyHandler = function (innerHandler, duration, options) {
    var keyHandler
    var restoreHandler

    if (!registedHandlers.keyHandler) {
      keyHandler = function (evt) {
        if (registedHandlers.keyHandler !== keyHandler) {
          return
        }

        removeEventListener(keyEventType, keyHandler)
        setTimeout(restoreHandler, duration)

        switch (evt.code) {
        case options.left:
          innerHandler(LEFT_KEY, evt)
          break
        case options.right:
          innerHandler(RIGHT_KEY, evt)
          break
        case options.down:
          innerHandler(DOWN_KEY, evt)
          break
        case options.rotateClockwise:
          innerHandler(ROTATE_CLOCK_KEY, evt)
          break
        case options.rotateCounterClockwise:
          innerHandler(ROTATE_COUNTERCLOCK_KEY, evt)
          break
        default:
          console.log('unhandled key: ', evt.code)
          return
        }

        evt.preventDefault()
      }
      restoreHandler = function () {
        addEventListener(keyEventType, keyHandler)
      }

      registedHandlers.keyHandler = keyHandler
      addEventListener(keyEventType, keyHandler)
    } else {
      throw new Error('there is a Key handler already registered')
    }
  }

  unregisterKeyHandler = function () {
    var keyHandler = registedHandlers.keyHandler

    if (keyHandler) {
      delete registedHandlers.keyHandler
      removeEventListener(keyEventType, keyHandler)
    } else {
      throw new Error('there is no key handler registered')
    }
  }

  registerAnimationFrameHandler = function (handler, duration) {
    var animationFrameHandler
    var restoreHandler

    if (!registedHandlers.animationFrameHandler) {
      animationFrameHandler = function (timestamp) {
        if (registedHandlers.animationFrameHandler !== animationFrameHandler) {
          return
        }

        setTimeout(restoreHandler, duration)
        handler(timestamp)
      }
      restoreHandler = function () {
        animationFrameHandler.request =
          requestAnimationFrame(animationFrameHandler)
      }

      registedHandlers.animationFrameHandler = animationFrameHandler
      animationFrameHandler.request =
        requestAnimationFrame(animationFrameHandler)
    } else {
      throw new Error('there is an animation frame handler already registered')
    }
  }

  unregisterAnimationFrameHandler = function () {
    var animationFrameHandler = registedHandlers.animationFrameHandler

    if (animationFrameHandler) {
      delete registedHandlers.animationFrameHandler
      cancelAnimationFrame(animationFrameHandler.request)
    } else {
      throw new Error('there is no animation frame handler registered')
    }
  }

  exports.registerHandlers = registerHandlers
  exports.unregisterHandler = unregisterHandler
})
