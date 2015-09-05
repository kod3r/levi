var H = require('highland')
var iterate = require('stream-iterate')

// merge sort taken from
// https://github.com/mafintosh/stream-iterate/blob/master/test.js

function toKey (val) {
  return val.key
}

module.exports = function (streamA, streamB) {
  var readA = iterate(streamA)
  var readB = iterate(streamB)

  return H(function (push, next) {
    readA(function (err, dataA, nextA) {
      if (err) return push(err)
      readB(function (err, dataB, nextB) {
        if (err) return push(err)

        if (!dataA && !dataB) return push(null, H.nil)

        var keyA = dataA ? toKey(dataA) : undefined
        var keyB = dataB ? toKey(dataB) : undefined

        if (!dataB || keyA < keyB) {
          push(null, dataA)
          nextA()
          return next()
        }

        if (!dataA || keyA > keyB) {
          push(null, dataB)
          nextB()
          return next()
        }

        push(null, dataA)
        push(null, dataB)
        nextA()
        nextB()
        next()
      })
    })
  })
}