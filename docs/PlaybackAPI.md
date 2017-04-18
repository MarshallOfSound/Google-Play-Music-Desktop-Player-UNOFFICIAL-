# Playback Information API

Google Play Music Desktop Player provides an interface for external
applications to determine the currently played song and playback status.

The interface is provided through a file that is continuously updated,
allowing external applications to watch the file to always have the
current playback information. The file is JSON-formatted and located at
* Windows: `%APPDATA%\Google Play Music Desktop Player\json_store\playback.json`
* OS X: `~/Library/Application Support/Google Play Music Desktop Player/json_store/playback.json`
* Linux: `~/.config/Google Play Music Desktop Player/json_store/playback.json`

**NOTE:** On some linux distros the file system does not lock the JSON file correctly and
sometimes it will be empty when you try to read it.  (This is really rare)

## Data Format

The file contains a single JSON object with the following attributes:
- **playing**: (bool) Whether or not the player is current playing.  This is false when the player is closed.
- **rating**: (object) A rating object in the format below
- **repeat**: (string) The current repeat mode *(Values can be found [here](https://github.com/gmusic-utils/gmusic.js#playbackgetrepeat))*
- **shuffle**: (string) The current shuffle mode *(Values can be found [here](https://github.com/gmusic-utils/gmusic.js#playbackgetshuffle))*
- **song**: (object) A song object in the format below.
- **songLyrics**: (string) The full lyrics of the current song, or null if we could not find the lyrics
- **time**: (object) A time object in the format below.

##### Rating
All attributes are false if no song is Playing.  If a song is paused the variables are set correctly
- **liked**: (bool) Whether or not the current song has been "liked" by the user
- **disliked**: (bool) Whether or not the current song has been "disliked" by the user

##### Song Object
All attributes are `null` if no song is playing.  If a song is paused the variables are set correctly.
- **title**: (string)  Title of the song
- **artist**: (string) Artist of the song
- **album**: (string) Album of the song
- **albumArt**: (string) URL that points the Album Art

#### Time Object
All attributes are `0` of no song is playing.  If a song is paused the variables are set correctly.
- **current**: (number) Number of milliseconds into the song we are
- **total**: (number) Total length of the song in milliseconds

### Example

```js
// Playing
{
  "playing": true,
  "song": {
    "title": "Trumpets",
    "artist": "Jason Derulo",
    "album": "Tattoos",
    "albumArt": "https://lh6.ggpht.com/J9gNObbLJ_R71OHy-F6ENINYlnjf6Hjx_dw4RV0GLSTH1zrDEFSeRcW_Kf2fTws0swmOXwot=s90-c-e100"
  },
  "rating": {
    "liked": false,
    "disliked": false,
  },
  "time": {
    "current": 4908,
    "total": 217000
  },
  "songLyrics": "Lyrics here :)",
  "shuffle": "ALL_SHUFFLE",
  "repeat": "LIST_REPEAT"
}

// Not Playing (Stopped)
{
  "playing": false,
  "song": {
    "title": null,
    "artist": null,
    "album": null,
    "albumArt": null
  },
  "rating": {
    "liked": false,
    "disliked": false,
  },
  "time": {
    "current": 0,
    "total": 0
  },
  "songLyrics": null
}
```
testtesttest
