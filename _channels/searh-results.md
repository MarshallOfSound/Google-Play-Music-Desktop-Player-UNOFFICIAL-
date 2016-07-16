---
layout: api-channel
title:  Search Results
sortTitle: Search Results
channel: search-results
short: The users most recent search results
info: > #
        This data is sent every time the user performs a new search.<br /><br />
        The payload will contain 0 to many songs, 0 to many albums and 0 to many artists.
payloadType: 'object'
payload:
  - key: searchText
    type: String
    comment: The text the user searched for to get these results
  - key: albums
    type: array
    subPayload:
      - key: id
        type: String
        comment: Unique ID for this album
      - key: name
        type: String
        comment: The name of the album
      - key: artist
        type: String
        comment: The name of the artist for the album
      - key: albumArt
        type: String
        comment: URL to the albumArt for this album
  - key: artists
    type: array
    subPayload:
      - key: id
        type: String
        comment: Unique ID for this artist
      - key: name
        type: String
        comment: The name of the artist
      - key: image
        type: String
        comment: URL to an image of this artist
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
        comment: Number of times the user has played this song
---
