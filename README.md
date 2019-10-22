# Storeon Crosstab

<img src="https://storeon.github.io/storeon/logo.svg" align="right"
     alt="Storeon logo by Anton Lovchikov" width="140">

Module for [Storeon] to synchronize actions through different ways with filtering of events that need to be synchronized.

It size is 131 bytes (minified and gzipped) and uses [Size Limit] to control size.

[Storeon]: https://github.com/storeon/storeon
[Size Limit]: https://github.com/ai/size-limit


## Installation

```
npm install crossstore
# or
yarn add crossstore
```

## API

```js
import crossStore from 'crossstore'

const crossTab = function ({ key, filter }) {
  var ignoreDate = 0
  var counter = 0

  return crossStore({
    key,
    filter,
    send: function (event) {
      ignoreDate = Date.now() + '' + counter++
      localStorage[key] = JSON.stringify([event, ignoreDate])
    },

    subscribe: function (cb) {
      window.addEventListener('storage', function (event) {
        if (event.key === key) {
          var tip = JSON.parse(event.newValue)

          if (ignoreDate !== tip[1]) {
            cb(tip[0])
          }
        }
      })
    }
  })
}
```

Function `crossStore` could have options:

* __key__: key.
* __filter__: callback function to filter actions to be synchronized. Should return `true` if need sync this action. Takes parameters of an event name and a data that is sent.
* __send__: callback to send events to different stores
* __subscribe__: callback to subscribe on events from different stores


## LICENSE

MIT
