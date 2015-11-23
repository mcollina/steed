'use strict'

var nr = { results: false }
var _parNr = require('fastparallel')(nr)
var _serNr = require('fastseries')(nr)
var _par = require('fastparallel')()
var _ser = require('fastseries')()
var _fall = require('fastfall')()
var _q = require('fastq')

var steed = {
  each: each,
  map: map,
  eachSeries: eachSeries,
  mapSeries: mapSeries,
  parallel: parallel,
  series: series,
  waterfall: _fall,
  queue: _q
}

module.exports = steed

function each (array, func, cb) {
  _parNr(null, func, array, cb)
}

function eachSeries (array, func, cb) {
  _serNr(null, func, array, cb)
}

function map (array, func, cb) {
  _par(null, func, array, cb)
}

function mapSeries (array, func, cb) {
  _ser(null, func, array, cb)
}

function parallel (funcs, cb) {
  if (Array.isArray(funcs)) {
    _par(null, funcs, null, cb)
  } else {
    _handleObjectMap(_par, funcs, cb)
  }
}

function _handleObjectMap (iterator, funcs, cb) {
  var keys = Object.keys(funcs)
  var toCall = new Array(keys.length)
  for (var i = 0; i < toCall.length; i++) {
    toCall[i] = funcs[keys[i]]
  }
  iterator(new MapStatus(keys, cb), toCall, null, mapResults)
}

function MapStatus (keys, cb) {
  this.cb = cb
  this.keys = keys
  this.results = {}
}

function mapResults (err, results) {
  if (err) { return this.cb(err) }

  var keys = this.keys
  var toReturn = {}

  for (var i = 0; i < keys.length; i++) {
    toReturn[keys[i]] = results[i]
  }

  this.cb(null, toReturn)
}

function series (funcs, cb) {
  if (Array.isArray(funcs)) {
    _ser(null, funcs, null, cb)
  } else {
    _handleObjectMap(_ser, funcs, cb)
  }
}
