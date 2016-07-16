---
layout: api-channel
title:  Controlling
sortTitle: 1Controlling
channel: control
short: The process for controlling the player remotely
custom: true
---

##### Forenote

You can't use this controller until you have successfully [connected](connect) to the player.

##### Controlling GPMDP

You can use **ANY** method from the:  

* `gmusic.js` library --> [https://github.com/gmusic-utils/gmusic.js](https://github.com/gmusic-utils/gmusic.js)
* `gmusic-ui.js` library --> [https://github.com/gmusic-utils/gmusic-ui.js](https://github.com/gmusic-utils/gmusis-ui.js)

All you need to do is send a message to the WebSocket with a stringified JSON object in the form:

```js
{
  "namespace": "playback",
  "method": "setPlaybackTime",
  "arguments": [10000]
}
```

##### Additional Commands

 GPMDP have also *"extended"* the standard `gmusic.js` library with some extra namespaces.


| Namespace | Method | Arguments |
|-----------|--------|-----------|
| `search` | `performSearchAndPlayResult` | Two Arguments<br />- A `searchText` string returned from the `search` namespace. <br />- A `result` object returned from the `search` namespace|
