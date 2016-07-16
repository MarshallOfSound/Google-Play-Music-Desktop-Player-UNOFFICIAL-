---
layout: api-channel
title:  "Queue"
channel: "queue"
short: "The users currently active song queue"
info: > #
        This data is sent every time the user adds or removes songs from their queue.<br /><br />
        The payload will contain 0 to many songs.
payloadType: 'array'
payload:
  - key: "id"
    type: String
    comment: "Unique ID for this song"
  - key: "index"
    type: Number
    comment: "The index position (starting at 1) of the track in the playlist"
  - key: "title"
    type: String
  - key: "artist"
    type: String
  - key: "album"
    type: String
  - key: "albumArt"
    type: String
    comment: "URL to the albumArt for this song"
  - key: "duration"
    type: Number
    comment: "Duration of song in milliseconds"
  - key: "playCount"
    type: Number
    comment: "Number of times the user has played this song"
---
