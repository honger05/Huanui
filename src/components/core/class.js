
function Class (o) {
  if (!(this instanceof Class) && isFunction(o)) {
    return classify(o)
  }
}

Class.create = function (parent, properties) {
  if (!isFunction(parent)) {
    properties = parent
    parent = null
  }

  properties || (properties = {})
  parent || (parent = properties.Extends || Class)
  properties.Extends = parent

  function SubClass () {
    parent.apply(this, arguments)

    if (this.constructor === SubClass && this.initialize) {
      this.initialize.apply(this, arguments)
    }
  }

  if (parent !== Class) {
    mix(SubClass, parent, parent.StaticsWhiteList)
  }

  implement.call(SubClass, properties)

  return classify(SubClass)
}


function implement (properties) {
  var key, value

  for (key in properties) {
    value = properties[key]

    if (Class.Mutators.hasOwnProperty(key)) {
      Class.Mutators[key].call(this, value)
    } else {
      this.prototype[key] = value
    }
  }
}

// Create a sub Class based on `Class`.
Class.extend = function (properties) {
  properties || (properties = {})
  properties.Extends = this

  return Class.create(properties)
}

function classify (cls) {
  cls.extend = Class.extend
  cls.implement = implement
  return cls
}

// Mutators define special properties.
Class.Mutators = {

  'Extends': function (parent) {
    var existed = this.prototype
    var proto = createProto(parent.prototype)

    mix(proto, existed)

    proto.constructor = this

    this.prototype = proto

    this.superclass = parent.prototype
  },

  'Implements': function (items) {
    isArray(items) || (items = [items])
    var proto = this.prototype, item

    while (item = items.shift()) {
      mix(proto, item.prototype || item)
    }
  },

  'Statics': function (staticProperties) {
    mix(this, staticProperties)
  }
}

function Ctor () {
}

var createProto = Object.__proto__ ?
    function (proto) {
      return { __proto__: proto }
    } :
    function (proto) {
      Ctor.prototype = proto
      return new Ctor()
    }

export default Class

// Helpers
// ------------
function mix (r, s, wl) {
  // Copy "all" properties including inherited ones.
  for (var p in s) {
    if (s.hasOwnProperty(p)) {
      if (wl && indexOf(wl, p) === -1) continue

      // 在 iPhone 1 代等设备的 Safari 中，prototype 也会被枚举出来，需排除
      if (p !== 'prototype') {
        r[p] = s[p]
      }
    }
  }
}

var toString = Object.prototype.toString

var isArray = Array.isArray || function (val) {
    return toString.call(val) === '[object Array]'
}

var isFunction = function (val) {
  return toString.call(val) === '[object Function]'
}

var indexOf = Array.prototype.indexOf ?
    function (arr, item) {
      return arr.indexOf(item)
    } :
    function (arr, item) {
      for (var i = 0, len = arr.length; i < len; i++) {
        if (arr[i] === item) {
          return i
        }
      }
      return -1
    }
