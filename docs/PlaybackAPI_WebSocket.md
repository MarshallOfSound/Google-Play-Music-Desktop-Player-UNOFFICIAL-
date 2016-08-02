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


### Playlists

Data received in the `playlists` channel will have a payload in the format

```js
"payload": [ // 0 -> Many playlists
  {
    "id": String,      // You can assume this be be unique
    "name": String,    // The user defined name of the playlist
    "tracks": [ // 0 -> Many tracks
      {
        "id": String,  // Unique ID for this song
        "index": Number, // The index position (starting at 1) of the track in the playlist
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

### Queue

Data received in the `queue` channel will have a payload in the format

```js
"payload": [ // 0 -> Many tracks
  {
    "id": String,             // Unique ID for this song
    "index": Number,          // The index position (starting at 1) of the track in the queue
    "title": String,
    "artist": String,
    "album": String,
    "albumArt": String,       // URL to the albumArt for this song
    "duration": Number,       // Duration of song in milliseconds
    "playCount": Number,      // Number of times the user has ever played the song
  }
]
```

### Search-Results

Data received in the `search-results` channel will have a payload in the format

```js
{
  "searchText": String,   // The text the user searched for to get these results
  "albums": [ // 0 -> Many albums
    {
      "id": String,           // Unique ID for this album
      "name": String,         // The name of the album
      "artist": String,       // The name of the artist for the album
      "albumArt": String,     // URL to the albumArt for this album
    }
  ]
  "artists": [ // 0 -> Many artists
    {
      "id": String,           // Unique ID for this artist
      "name": String,         // The name of the artist
      "image": String,        // URL to an image of this artist
    }
  ]
  "tracks": [ // 0 -> Many tracks
    {
      "id": String,             // Unique ID for this song
      "index": Number,          // The index position (starting at 1) of the track in the object that is storing a collection of tracks E.g. A Playlist
      "title": String,
      "artist": String,
      "album": String,
      "albumArt": String,       // URL to the albumArt for this song
      "duration": Number,       // Duration of song in milliseconds
      "playCount": Number,      // Number of times the user has ever played the song
    }
  ]
}
```

## Controlling the application

### Be Polite

If your app is going to be using the controller detailed below you **must** inform the user that you are
now controlling the app.  This is done by sending a message to WebSocket with a stringified JSON object
in the form.

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App"]
}
```

This command will trigger a response

```js
{
  "channel": "connect",
  "payload": "CODE_REQUIRED"
}
```

A UI will popup in GPMDP containing a 4 digit code.  You must instruct your user to provide this 4 digit code to you and you must then send it in the following form

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App", "0000"]
}
```

If the code is incorrect the `CODE_REQUIRED` message will be sent to you again.  If it is correct however you will receive a **permanent** authorization code in the following form

```js
{
  "channel": "connect",
  "payload": "RANDOM_STRING_OF_CHARS_HERE"
}
```

As soon as you receive that message (and whenever you want to connect to the WebSocketAPI) you must simply send one message in the form.

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App", "RANDOM_STRING_OF_CHARS_HERE"]
}
```

### All Powerful Controller

You can use **ANY** method from the `gmusic-utils` library --> https://github.com/gmusic-utils/gmusic.js

All you need to do is send a message to the WebSocket with a stringified JSON object in the form.

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
| `playlists` | `play` | One Argument<br />- A `Playlist` object returned from the `playlist` namespace. |
| `playlists` | `playWithTrack` | Two arguments<br />-A `Playlist` object returned from the `playlist` namespace.<br />-A `Track` object from the `tracks` property of the supplied `playlist` |
