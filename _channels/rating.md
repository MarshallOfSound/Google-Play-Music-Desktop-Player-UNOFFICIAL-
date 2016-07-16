---
layout: api-channel
title:  "Rating"
channel: "rating"
short: "The rating of the currently playing song"
info: > #
        NOTE: It is impossible for both liked and disliked to be true at the same time
payloadType: "object"
payload:
  - key: "liked"
    type: Boolean
  - key: "disliked"
    type: Boolean
---
