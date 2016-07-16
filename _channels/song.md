---
layout: api-channel
title:  "Song"
channel: "song"
short: "The song currently playing in GPMDP"
info: > #
        This data is sent every time the currently playing song changes. It is important to note that this channel will still be sent even if the song
        changes while the player is paused.
payloadType: 'object'
payload:
  - key: "title"
    type: String
    comment: "Song Title"
  - key: "artist"
    type: String
    comment: "Song Artist"
  - key: "album"
    type: String
    comment: "Song Album"
  - key: "albumArt"
    type: String
    comment: "URL pointing to the album art"
---
