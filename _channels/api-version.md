---
layout: api-channel
title:  "API Version"
channel: "API_VERSION"
short: "The current version of the WebSocket API"
info: > #
        The String will be a semver compliant version string for the WebSocketAPI. You should use this to
        determine if your app is designed to handle the current API syntax.
payloadType: 'single'
payload:
  type: String
  comment: "Current API Version as a SemVer string"
---
