---
layout: api-channel
title:  Playlists
sortTitle: Playlists
channel: playlists
short: The users playlists available in GPM
info: > #
        This data is sent every time the user adds, deletes or modifies their playlists.  With some users
        this will be a lot of data so be conservative with how you handle it as it can cause lag when people
        have lots of songs in their playlists.<br /><br />
        The payload will contain 0 to many playlists and each playlist will contain 0 to many songs.
payloadType: array
payload:
  - key: id
    type: String
    comment: You can assume this be be unique
  - key: name
    type: String
    comment: The user defined name of the playlist
  - key: tracks
    type: array
    subPayload:
      - key: id
        type: String
        comment: Unique ID for this song
      - key: index
        type: Number
        comment: The index position (starting at 1) of the track in the playlist
      - key: title
        type: String
      - key: artist
        type: String
      - key: album
        type: String
      - key: albumArt
        type: String
        comment: URL to the albumArt for this song
      - key: duration
        type: Number
        comment: Duration of song in milliseconds
      - key: playCount
        type: Number
        comment: "Number of times the user has played this song"
---
