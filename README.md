![logo][logo-url]

# steed&nbsp;&nbsp;[![build status](https://secure.travis-ci.org/mcollina/steed.png)](http://travis-ci.org/mcollina/steed)

Horsepower for your modules.

__Steed__ is an alternative to [async](http://npm.im/async) that is
~50% faster. It is not currently on-par with async in term of features.
Please help us!

We argue that you can only build a callback-based control flow library
that is as fast as steed (as of 2015), but not faster (within 10% range):
such a library is [neo-async](http://npm.im/neo-async), but it has
higher memory usage.

* <a href="#install">Installation</a>
* <a href="#api">API</a>
* <a href="#caveats">Caveats</a>
* <a href="#why">Why it is so fast?</a>
* <a href="#acknowledgements">Acknowledgements</a>
* <a href="#licence">Licence &amp; copyright</a>

[![js-standard-style](https://raw.githubusercontent.com/feross/standard/master/badge.png)](https://github.com/feross/standard)

## Install

`npm i steed --save`

## API

* <a href="#parallel"><code>steed#<b>parallel()</b></code></a>
* <a href="#series"><code>steed#<b>series()</b></code></a>
* <a href="#waterfall"><code>steed#<b>waterfall()</b></code></a>
* <a href="#each"><code>steed#<b>each()</b></code></a>
* <a href="#eachSeries"><code>steed#<b>eachSeries()</b></code></a>
* <a href="#map"><code>steed#<b>map()</b></code></a>
* <a href="#mapSeries"><code>steed#<b>mapSeries()</b></code></a>
* <a href="#queue"><code>steed#<b>queue()</b></code></a>

-------------------------------------------------------
<a name="parallel"></a>
### steed.parallel(tasks[, done(err, results)])

Executes a series of tasks in parallel.

`tasks` can either be an array of functions, or an object where each
property is a function. `done` will be called with the results.

Uses [fastparallel](http://npm.im/fastparallel).

Example:

```js
steed.parallel([
  function a (cb){
    cb(null, 'a');
  },
  function b (cb){
    cb(null, 'b');
  }
], function(err, results){
  // results is ['a', 'b']
})


// an example using an object instead of an array
steed.parallel({
  a: function a (cb){
    cb(null, 1)
  },
  b: function b (cb){
    cb(null, 2)
  }
}, function(err, results) {
  // results is  { a: 1, b: 2}
})
```

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 2085ms
* `async.parallel`: 3784ms
* `insync.parallel`: 12006ms
* `items.parallel`: 4457ms
* `parallelize`: 6815ms
* `fastparallel` with results: 2463ms

These benchmarks where taken via `bench.js` on node v4.1.0, on a MacBook
Pro Retina Mid 2015.

-------------------------------------------------------
<a name="series"></a>
### steed.series(tasks[, done(err, results)])

Executes a series of tasks in series.

`tasks` can either be an array of functions, or an object where each
property is a function. `done` will be called with the results.

Uses [fastseries](http://npm.im/fastseries).

Example:

```js
steed.series([
  function a (cb){
    cb(null, 'a');
  },
  function b (cb){
    cb(null, 'b');
  }
], function(err, results){
  // results is ['a', 'b']
})


// an example using an object instead of an array
steed.series({
  a: function a (cb){
    cb(null, 1)
  },
  b: function b (cb){
    cb(null, 2)
  }
}, function(err, results) {
  // results is  { a: 1, b: 2}
})
```

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 4013ms
* `async.series`: 6216ms
* `fastseries` with results: 4225ms

These benchmarks where taken via `bench.js` on node 4.2.2, on a MacBook
Pro Retina 2014.

-------------------------------------------------------
<a name="waterfall"></a>
### steed.waterfall(tasks[, done(err, ...)])

Runs the functions in `tasks` in series, each passing their result to
the next task in the array. Quits early if any of the tasks errors.

Uses [fastfall](http://npm.im/fastfall).

Example:

```js
steed.waterfall([
  function a (cb) {
    console.log('called a')
    cb(null, 'a')
  },
  function b (a, cb) {
    console.log('called b with:', a)
    cb(null, 'a', 'b')
  },
  function c (a, b, cb) {
    console.log('called c with:', a, b)
    cb(null, 'a', 'b', 'c')
  }], function result (err, a, b, c) {
    console.log('result arguments', arguments)
  })
```

-------------------------------------------------------
<a name="each"></a>
### steed.each(array, iterator(item, cb), [, done(err)])

Iterate over all elements of the given array asynchronosly and in
parallel.
Calls `iterator` with an item and a callback. Calls `done` when all have
been processed.

Uses [fastparallel](http://npm.im/fastparallel).

Example:

```js
var input = [1, 2, 3]

steed.each(input, function (num, cb) {
  console.log(num)
  setImmediate(function () {
    var res = input[i++] * 2
    console.log(res)
    cb(null)
  })
}, function (err) {
  console.log(err)
})
```

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 2085ms
* `async.each`: 2959ms
* `insync.each`: 2698ms
* `fastparallel` each: 2211ms

These benchmarks where taken via `bench.js` on node v4.1.0, on a MacBook
Pro Retina Mid 2015.

-------------------------------------------------------
<a name="eachSeries"></a>
### steed.eachSeries(array, iterator(item, cb), [, done(err)])

Iterate over all elements of the given array asynchronosly and in
series.
Calls `iterator` with an item and a callback. Calls `done` when all have
been processed.

Uses [fastseries](http://npm.im/fastseries).

Example:

```js
var input = [1, 2, 3]

steed.eachSeries(input, function (num, cb) {
  setImmediate(function () {
    var res = input[i++] * 2
    console.log(res)
    cb(null)
  })
}, function (err) {
  console.log(err)
})
```

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 4013ms
* `async.eachSeries`: 5158ms
* `fastseries` each: 4259ms

These benchmarks where taken via `bench.js` on node 4.2.2, on a MacBook
Pro Retina 2014.

-------------------------------------------------------
<a name="map"></a>
### steed.map(array, iterator(item, cb), [, done(err, results)])

Performs a map operation over all elements of the given array asynchronosly and in
parallel. The result is an a array where all items have been replaced by
the result of `iterator`.

Calls `iterator` with an item and a callback. Calls `done` when all have
been processed.

Uses [fastparallel](http://npm.im/fastparallel).

Example:

```js
var input = [1, 2, 3]

steed.map(input, function (num, cb) {
  console.log(num)
  setImmediate(function () {
    var res = input[i++] * 2
    cb(null, res)
  })
}, function (err, results) {
  console.log(err, results)
})
```

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 2085ms
* `async.map`: 3656ms
* `insync.map`: 11402ms
* `fastparallel` map: 2456ms

These benchmarks where taken via `bench.js` on node v4.1.0, on a MacBook
Pro Retina Mid 2015.

-------------------------------------------------------
<a name="mapSeries"></a>
### steed.mapSeries(array, iterator(item, cb), [, done(err, results)])

Performs a map operation over all elements of the given array asynchronosly and in
series. The result is an a array where all items have been replaced by
the result of `iterator`.

Calls `iterator` with an item and a callback. Calls `done` when all have
been processed.

Uses [fastseries](http://npm.im/fastseries).

Example:

```js
var input = [1, 2, 3]

steed.mapSeries(input, function (num, cb) {
  console.log(num)
  setImmediate(function () {
    var res = input[i++] * 2
    cb(null, res)
  })
}, function (err, results) {
  console.log(err, results)
})
```

Benchmark for doing 3 calls `setImmediate` 1 million times:

* non-reusable `setImmediate`: 4013ms
* `async.mapSeries`: 5660ms
* `fastseries` map: 4171ms

These benchmarks where taken via `bench.js` on node 4.2.2, on a MacBook
Pro Retina 2014.

-------------------------------------------------------
<a name="queue"></a>
### steed.queue(worker, concurrency)

Creates a new queue. See [fastq](http://npm.im/fastq) for full API.

Arguments:

* `worker`, worker function, it would be called with `that` as `this`,
  if that is specified.
* `concurrency`, number of concurrent tasks that could be executed in
  parallel.

Example:

```js
var queue = steed.queue(worker, 1)

queue.push(42, function (err, result) {
  if (err) { throw err }
  console.log('the result is', result)
})

function worker (arg, cb) {
  cb(null, arg * 2)
}
```

Benchmarks (1 million tasks):

* setImmedidate: 1313ms
* fastq: 1462ms
* async.queue: 3989ms

Obtained on node 4.2.2, on a MacBook Pro 2014 (i7, 16GB of RAM).

## Caveats

This library works by caching the latest used function, so that running a new parallel
does not cause **any memory allocations**.

The `done` function will be called only once, even if more than one error happen.

__Steed__ has no safety checks: you should be responsible to avoid sync
functions and so on. Also arguments type checks are not included, so be
careful in what you pass.

<a name="why"></a>
## Why it is so fast?

1. This library is caching functions a lot. We invented a technique to
   do so, and packaged it in a module: [reusify](http://npm.im/reusify).

2. V8 optimizations: thanks to caching, the functions can be optimized by V8
   (if they are optimizable, and we took great care of making them so).

3. Don't use arrays if you just need a queue. A linked list implemented via
   objects is much faster if you do not need to access elements in between.

## Acknowledgements

Steed is sponsored by [nearForm](http://nearform.com).

The steed logo was created, with thanks, by [Dean McDonnell](https://github.com/mcdonnelldean)

## License

MIT

[logo-url]: https://rawgit.com/mcollina/steed/master/assets/banner.svg
