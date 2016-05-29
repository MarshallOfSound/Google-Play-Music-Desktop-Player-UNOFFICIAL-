Web Socket Playback Information API *(1.0.0)*
-------------------------------------------

Google Play Music Desktop Player provides an interface for external
applications to determine the currently played song and playback status.

This interface is provided through a locally hosted Web Socket.  In a standard
release this WebSocket is hosted on port `5672`.  Any site or application should
be able to connect to `ws://localhost:5672` and use the API.

## Message Format

All messages are sent from the Web Socket Server in the following format

```js
{
  "channel": "channel_name",
  "payload": { ...data }
}
```

## Channels

### API_VERSION

Data recieved in the `API_VERSION` channel will have a payload in the format

```js
"payload": String
```

The String will be a [semver](http://semver.org/) compliant version string for the WebSocketAPI.
You should use this to determine if your app is designed to handle the current
API syntax.

*As per semver any breaking change will result in a MAJOR version bump to the API
but **NOT** to the app*

### PlayState

Data received in the `playState` channel will have a payload in the format

```js
"payload": Boolean
```

The Boolean value will be true if a song is currently playing, and false if a
song is currently paused or stopped.

### Song

Data received in the `song` channel will have a payload in the format

```js
"payload": {
  "title": "Song Title",
  "artist": "Song Artist",
  "album": "Song Album",
  "albumArt": "URL pointing to the Album Art"
}
```

This data is sent every time the currently playing song changes.  It is important
to note that this channel will still be sent even if the song changes while the
player is paused

### Lyrics

Data received in the `lyrics` channel will have a payload in the format

```js
"payload": "String of song lyrics here"
```

This data is sent every time the currently playing song changes.  It is important
to note that this channel will still be sent even if the song changes while the
player is paused.  
Also important to note that when the song first changes this
channel will be sent with a "null" value.  Once we have determined the lyrics
for the new song, the lyrics will then be sent down this channel.  You must therefore
handle that brief period of time where lyrics is null.

### Time

Data received in the `time` channel will have a payload in the format

```js
"payload": {
  "current": Number,
  "total": Number
}
```

The `current` value is the time progressed through the current song in milliseconds.  
The `total` value is the total time in milliseconds available to play in the current
song.

This channel is sent on average every 100 - 200 milliseconds.  You **will** receive a lot of data.

### Rating

This data is sent when the song first starts playing and when the user changes his rating / rates a song.

Data received in the `rating` channel will have a payload in the format

```js
"payload": {
  "liked": Boolean,
  "disliked": Boolean
}
```

### Shuffle

Data received in the `shuffle` channel with have a payload in the format

```js
"payload": "ALL_SHUFFLE"
```

*Possible shuffle values can be found [here](https://github.com/gmusic-utils/gmusic.js#playbackgetshuffle)*

### Repeat

Data received in the `repeat` channel will have a payload in the format

```js
"payload": "LIST_REPEAT"
```

*Possible repeat values can be found [here](https://github.com/gmusic-utils/gmusic.js#playbackgetrepeat)*


### Playlists *(Beta)*

Data recieved in the `playlists` channel will have a payload in the format

```js
"payload": [ // 0 -> Many playlists
  {
    "id": String,      // You can assume this be be unique
    "name": String,    // The user defined name of the playlist
    "tracks": [ // 0 -> Many tracks
      {
        "id": String,  // This ID can be dynamic (you have been warned)
        "title": String,
        "artist": String,
        "album": String,
        "albumArt": String,
        "duration": Number, // Duration of song in milliseconds
        "playCount": Number // Number of times the user has played this song
      }
    ]
  }
]
```

## Controlling the application

### Be Polite

If your app is going to be using the controller detailed below you should inform the user that you are
now controlling the app.  This is done by sending a message to websocket with a stringified JSON object
in the form.

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App"]
}
```

### All Powerful Controller

You can use **ANY** method from the `gmusic-utils` library --> https://github.com/gmusic-utils/gmusic.js

All you need to do is send a message to the websocket with a stringified JSON object in the form.

```js
{
  "namespace": "playback",
  "method": "setPlaybackTime",
  "arguments": [10000]
}
```

 #### Additional commands

 GPMDP have also *"extended"* the standard `gmusic.js` library with some extra namespaces.


| Namespace | Method | Arguments |
|-----------|--------|-----------|
| `playlists` | `play` | A single argument which must be a `Playlist` object returned from the `playlist` namespace. |
