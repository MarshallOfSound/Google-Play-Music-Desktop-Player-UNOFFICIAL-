---
layout: api-channel
title:  "Time"
channel: "time"
short: "The current and total time values of the current song"
info: > #
        The current value is the time progressed through the current song in milliseconds.
        The total value is the total time in milliseconds available to play in the current song.

        The current value is the time progressed through the current song in milliseconds.
        The total value is the total time in milliseconds available to play in the current song.

        This channel is sent on average every 100 - 200 milliseconds. You will receive a lot of data.
payloadType: 'object'
payload:
  - key: "current"
    type: Number
  - key: "total"
    type: Number
---
