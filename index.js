/**
 * Storeon module to sync states through different ways
 *
 * @param {Object} config The config object
 * @param {String} [config.key = 'crossStore'] The default key
 * @param {Send} config.send Pass callback to send events to different stores
 * @param {Subscribe} config.subscribe Pass callback to subscribe on events
 *                                     from different stores
 * @param {Filter} [config.filter] Pass callback to filter events.
 */

var crossStore = function (config) {
  var key = config.key || 'crossstore'
  var send = config.send
  var subscribe = config.subscribe
  var filter = config.filter

  var ignoreNext = false

  return function (store) {
    store.on('@dispatch', function (_, event) {
      if (event[0][0] === '@') return

      if (ignoreNext) {
        ignoreNext = false
        return
      }

      if (filter && !filter(event[0], event[1])) return

      send([key, event[0], event[1]])
    })

    return subscribe(function (tip) {
      if (key === tip[0]) {
        ignoreNext = true
        store.dispatch(tip[1], tip[2])
      }
    })
  }
}

/**
 * Filter for sync event
 *
 * @callback Filter
 * @param {String} Event name
 * @param {*} Event data
 */

/**
 * Send events to different stores
 *
 * @callback Send
 * @param {*} Event data
 */

/**
 * Subscribe on events from different stores
 *
 * @callback Subscribe
 * @param {Receiver} Function Call this callback with received Event data
 */

/**
 * Callback for receiving Event data
 *
 * @callback Receiver
 * @param {*} Event data
 */

module.exports = crossStore
