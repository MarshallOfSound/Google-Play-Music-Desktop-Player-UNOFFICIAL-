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

##### Song Object
All attributes are null if no song is playing.  If a song is paused the variables are set correctly.
- **title**: (string)  Title of the song
- **artist**: (string) Artist of the song
- **album**: (string) Album of the song
- **albumArt**: (string) URL that points the Album Art

### Example

```js
// playing
{
  "playing": true,
  "song": {
    "title": "Shut Up and Dance",
    "artist": "WALK THE MOON",
    "album": "Talking Is Hard",
    "albumArt": "https://lh5.ggpht.com/ePx57Lao09SN2MGsN11s1axY9cLFj3B35D-y4HvKjkl2Qi4y6vq9bHkv3tZwXVXZmj60kkUFbA=s90-c-e100"
  }
}

// Not Playing
{
  "playing": false,
  "song": {
    "title": null,
    "artist": null,
    "album": null,
    "albumArt": null
  }
}
```
