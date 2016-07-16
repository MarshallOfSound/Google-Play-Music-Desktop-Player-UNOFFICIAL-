---
layout: api-channel
title:  "Lyrics"
channel: "lyrics"
short: "The lyrics for the current song"
info: > #
        This data is sent every time the currently playing song changes. It is important to note that this channel
        will still be sent even if the song changes while the player is paused.
        Also important to note that when the song first changes this channel will be sent with a "null" value. Once
        we have determined the lyrics for the new song, the lyrics will then be sent down this channel. You must
        therefore handle that brief period of time where lyrics is null.
payloadType: 'single'
payload:
  type: String
  comment: "String of song lyrics, newline characters are '\\n'"
---
