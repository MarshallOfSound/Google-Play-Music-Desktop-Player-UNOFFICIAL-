# Playback Information API

Google Play Music Desktop Player provides an interface for external
applications to determine the currently played song and playback status.

The interface is provided through a file that is continuously updated,
allowing external applications to watch the file to always have the
current playback information. The file is JSON-formatted and located at
`%APPDATA%\GPMDP\playback-information.json`

## Data Format

The file contains a single JSON object with the following attributes:
- **isActive**: (bool) Whether or not the player is running
- **isPlaying**: (bool) Whether or not a song is currently playing
- **song**: (string) The name of the current song
- **artist**: (string) The artist of the current song
- **album**: (string) The album of the current song
- **imageURL**: (string) An URL to the current song or album image

### Example

```json
{
  "isActive": true,
  "isPlaying": true,
  "song": "Even Angels Cry",
  "artist": "Change Colours",
  "album": "Reece Mastin",
  "imageURL": "https://lh3.googleusercontent.com/SvSGtZ6hmYXjMU2GTYYFk3Fhm0eJDl_KWyWn0v6ZkVN1pntuOTRWkWouT4V83qQOrqareAII2w=s90-c-e100"
}
```
