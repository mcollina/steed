'use strict'

var test = require('tape')
var steed = require('./')

test('each', function (t) {
  t.plan(9)

  var input = [1, 2, 3]
  var i = 0

  steed.each(input, function (num, cb) {
    t.equal(0, i, 'calls in parallel')
    setImmediate(function () {
      var res = input[i++]
      t.equal(res, num)
      cb(null, res * 2)
    })
  }, function (err, snd) {
    t.error(err, 'no error')
    t.notOk(snd, 'no second argument')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('map', function (t) {
  t.plan(9)

  var input = [1, 2, 3]
  var i = 0

  steed.map(input, function (num, cb) {
    t.equal(0, i, 'calls in parallel')
    setImmediate(function () {
      var res = input[i++]
      t.equal(res, num)
      cb(null, res * 2)
    })
  }, function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual([2, 4, 6], snd, 'second args contains the map')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('eachSeries', function (t) {
  t.plan(9)

  var input = [1, 2, 3]
  var i = 0
  var count = 0

  steed.eachSeries(input, function (num, cb) {
    t.equal(count++, i, 'calls in series')
    setImmediate(function () {
      t.equal(input[i++], num)
      cb(null, input[i] * 2)
    })
  }, function (err, snd) {
    t.error(err, 'no error')
    t.notOk(snd, 'no second argument')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('mapSeries', function (t) {
  t.plan(9)

  var input = [1, 2, 3]
  var i = 0
  var count = 0

  steed.mapSeries(input, function (num, cb) {
    t.equal(count++, i, 'calls in series')
    setImmediate(function () {
      var res = input[i++]
      t.equal(res, num)
      cb(null, res * 2)
    })
  }, function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual([2, 4, 6], snd, 'second args contains the map')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('parallel', function (t) {
  t.plan(6)

  var input = [1, 2, 3]
  var i = 0

  function myfunc (cb) {
    t.equal(0, i, 'calls in parallel')
    setImmediate(function () {
      var res = input[i++]
      cb(null, res * 2)
    })
  }

  steed.parallel([myfunc, myfunc, myfunc], function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual([2, 4, 6], snd, 'second args contains the map')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('parallel with an object', function (t) {
  t.plan(6)

  var input = [1, 2, 3]
  var i = 0

  function myfunc (cb) {
    t.equal(0, i, 'calls in parallel')
    setImmediate(function () {
      var res = input[i++]
      cb(null, res * 2)
    })
  }

  steed.parallel({
    a: myfunc,
    b: myfunc,
    c: myfunc
  }, function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual({
      a: 2,
      b: 4,
      c: 6
    }, snd, 'second args contains the map')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('series', function (t) {
  t.plan(6)

  var input = [1, 2, 3]
  var i = 0
  var count = 0

  function myfunc (cb) {
    t.equal(count++, i, 'calls in series')
    setImmediate(function () {
      var res = input[i++]
      cb(null, res * 2)
    })
  }

  steed.series([myfunc, myfunc, myfunc], function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual([2, 4, 6], snd, 'second args contains the map')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('series with an object', function (t) {
  t.plan(6)

  var input = [1, 2, 3]
  var i = 0
  var count = 0

  function myfunc (cb) {
    t.equal(count++, i, 'calls in series')
    setImmediate(function () {
      var res = input[i++]
      cb(null, res * 2)
    })
  }

  steed.series({
    a: myfunc,
    b: myfunc,
    c: myfunc
  }, function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual({
      a: 2,
      b: 4,
      c: 6
    }, snd, 'second args contains the map')
    t.equal(3, i, 'iterated over all inputs')
  })
})

test('waterfall', function (t) {
  t.plan(4)

  steed.waterfall([ function a (cb) {
    cb(null, [1])
  }, function b (arg, cb) {
    t.deepEqual([1], arg, 'arg for b is right')
    arg.push(2)
    cb(null, arg)
  }, function c (arg, cb) {
    t.deepEqual([1, 2], arg, 'arg for c is right')
    arg.push(3)
    cb(null, arg)
  }], function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual([1, 2, 3], snd, 'second args contains the last result')
  })
})

test('queue', function (t) {
  t.plan(4)

  steed.waterfall([ function a (cb) {
    cb(null, [1])
  }, function b (arg, cb) {
    t.deepEqual([1], arg, 'arg for b is right')
    arg.push(2)
    cb(null, arg)
  }, function c (arg, cb) {
    t.deepEqual([1, 2], arg, 'arg for c is right')
    arg.push(3)
    cb(null, arg)
  }], function (err, snd) {
    t.error(err, 'no error')
    t.deepEqual([1, 2, 3], snd, 'second args contains the last result')
  })
})
