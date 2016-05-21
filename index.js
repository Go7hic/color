#! /usr/bin/env node
'use strict'

var _typeof = typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' ?
  function (obj) {
    return typeof obj
  } :
  function (obj) {
    return obj && typeof Symbol === 'function' && obj.constructor === Symbol ? 'symbol' : typeof obj
  }

var _createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i]
      descriptor.enumerable = descriptor.enumerable || false
      descriptor.configurable = true
      if ('value' in descriptor) {
        descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor)
      }
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) {
      defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps)
    }
    return Constructor
  }
}()

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

var param = process.argv[2]
var colors = require('colors')
var colorStr = param ? param : ''
var isNumberAndInRange = function isNumberAndInRange(input, mix, max) {
  return typeof value === 'number' && value >= min && value <= max
}

var formatNumber = function formatNumber(number, format) {
  if (format === 10) {
    return number
  } else if (format === 16) {
    var output = Math.round(number).toString(16)
    if (output.length === 1) {
      output = '0' + output
    }
    return output
  } else if (format === 'percent') {
    return Math.round(number / 255 * 1000) / 1000
  } else {
    throw new Error('Format is invalid.')
  }
}

var parseRGBA = function parseRGBA(color) {
  var r,
    g,
    b,
    a = 1

  if (typeof color === 'string' && color.match(/^rgb\(\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/i)) {
    var matches = color.match(/rgb\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
    r = matches[1]
    g = matches[2]
    b = matches[3]
  } else if (typeof color === 'string' && color.match(/^rgba\(\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0\.\d+)\s*\)$/i)) {
    var _matches = color.match(/rgba\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0\.\d+)\s*\)/i)
    r = _matches[1]
    g = _matches[2]
    b = _matches[3]
    a = _matches[4]
  }

  if (r === undefined || g === undefined || b === undefined || a === undefined) {
    throw new Error('Not a rgba string.')
    return
  }

  r = parseInt(r, 10)
  g = parseInt(g, 10)
  b = parseInt(b, 10)
  a = parseFloat(a) * 255

  return {
    red: r,
    green: g,
    blue: b,
    alpha: a
  }
}

var parseHex = function parseHex(color) {
  if (!color.match(/^#([0-9a-f]{6}|[0-9a-f]{8})$/i)) {
    throw new Error('Not a hex string.')
    return
  }

  color = color.replace(/^#/, '')

  var convert = function convert(single) {
    return parseInt(single, 16)
  }

  var r = convert(color.substr(0, 2))
  var g = convert(color.substr(2, 2))
  var b = convert(color.substr(4, 2))
  var a = convert(color.substr(6, 2) || 'FF')

  return {
    red: r,
    green: g,
    blue: b,
    alpha: a
  }
}

var Color = function () {
  function Color(color) {
    _classCallCheck(this, Color)

    this.channel = undefined

    if (!this.channel) {
      try {
        this.channel = parseHex(color)
      } catch (e) { }
    }
    if (!this.channel) {
      try {
        this.channel = parseRGBA(color)
      } catch (e) { }
    }

    if (!this.channel) {
      throw new Error("Can't parse color.")
    }
  }

  _createClass(Color, [{
    key: 'setRed',
    value: function setRed(value) {
      if (!isNumberAndInRange(value, 0, 255)) {
        throw new Error('Please pass in a number between 0 ~ 255.')
      }

      this.channel.red = parseInt(value, 10)
    }
  }, {
    key: 'setGreen',
    value: function setGreen(value) {
        if (!isNumberAndInRange(value, 0, 255)) {
          throw new Error('Please pass in a number between 0 ~ 255.')
        }

        this.channel.green = parseInt(value, 10)
      }
  }, {
      key: 'setBlue',
      value: function setBlue(value) {
        if (!isNumberAndInRange(value, 0, 255)) {
          throw new Error('Please pass in a number between 0 ~ 255.')
        }

        this.channel.blue = parseInt(value, 10)
      }
    }, {
      key: 'setAlpha',
      value: function setAlpha(value) {
        if (!isNumberAndInRange(value, 0, 1)) {
          throw new Error('Please pass in a number between 0 ~ 1.')
        }

        this.channel.alpha = parseInt(value * 255, 10)
      }
    }, {
      key: 'getRed',
      value: function getRed() {
        var format = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0]

        return formatNumber(this.channel.red, format)
      }
    }, {
      key: 'getGreen',
      value: function getGreen() {
        var format = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0]

        return formatNumber(this.channel.green, format)
      }
    }, {
      key: 'getBlue',
      value: function getBlue() {
        var format = arguments.length <= 0 || arguments[0] === undefined ? 10 : arguments[0]

        return formatNumber(this.channel.blue, format)
      }
    }, {
      key: 'getAlpha',
      value: function getAlpha() {
        var format = arguments.length <= 0 || arguments[0] === undefined ? 'percent' : arguments[0]

        return formatNumber(this.channel.alpha, format)
      }
    }, {
      key: 'toFormat',
      value: function toFormat(format) {
        if (!(typeof format === 'undefined' ? 'undefined' : _typeof(format)) === 'string') {
          throw new Error('Format must be a string.')
          return
        }
        return format.replace(/\$r/i, this.getRed()).replace(/\$g/i, this.getGreen()).replace(/\$b/i, this.getBlue()).replace(/\$a/i, this.getAlpha()).replace(/\$0xR/, this.getRed(16).toUpperCase()).replace(/\$0xr/, this.getRed(16).toLowerCase()).replace(/\$0xG/, this.getGreen(16).toUpperCase()).replace(/\$0xg/, this.getGreen(16).toLowerCase()).replace(/\$0xB/, this.getBlue(16).toUpperCase()).replace(/\$0xb/, this.getBlue(16).toLowerCase()).replace(/\$0xA/, this.getAlpha(16).toUpperCase()).replace(/\$0xa/, this.getAlpha(16).toLowerCase())
      }
    }, {
      key: 'toRGB',
      value: function toRGB() {
        return this.toFormat('rgb($r, $g, $b)')
      }
    }, {
      key: 'toRGBA',
      value: function toRGBA() {
        return this.toFormat('rgba($r, $g, $b, $a)')
      }
    }, {
      key: 'toHex',
      value: function toHex() {
        return this.toFormat('#$0xR$0xG$0xB')
      }
    }, {
      key: 'toHexA',
      value: function toHexA() {
        return this.toFormat('#$0xR$0xG$0xB$0xA')
      }
    }])

  return Color
}()
var colorHex = new Color(colorStr)
var colorHex = new Color(colorStr)
var colorHexA = new Color(colorStr)
var colorRGB = new Color(colorStr)
var colorRGBA = new Color(colorStr)

console.log('RGB：'.bold.underline + colorHex.toRGB())
console.log('RGBA：'.bold.underline + colorHexA.toRGBA())
console.log('Hex：'.bold.underline + colorRGB.toHex())
console.log('HexA：'.bold.underline + colorRGBA.toHexA())
