# Playback Information API

Google Play Music Desktop Player provides an interface for external
applications to determine the currently played song and playback status.

The interface is provided through a file that is continuously updated,
allowing external applications to watch the file to always have the
current playback information. The file is JSON-formatted and located at
`%APPDATA%\GPMDP_STORE\playback.json`

## Data Format

The file contains a single JSON object with the following attributes:
- **playing**: (bool) Whether or not the player is current playing.  This is false when the player is closed.
- **song**: (object) A song object in the format below.
- **time**: (object) A time object in the format below.
- **songLyrics**: (string) The full lyrics of the current song, or null if we could not find the lyrics

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
  "time": {
    "current": 4908,
    "total": 217000
  },
  "songLyrics": "Lyrics here :)"
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
  "time": {
    "current": 0,
    "total": 0
  },
  "songLyrics": null
}
```
