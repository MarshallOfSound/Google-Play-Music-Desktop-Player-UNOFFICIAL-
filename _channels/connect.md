---
layout: api-channel
title:  Connecting
sortTitle: 11Connecting
channel: connect
short: The process for authenticating and connecting to a player
custom: true
---

**Be Polite**  
If your app is going to be using the controller detailed [here](controller) must inform the user that you are
now controlling the app. This is done by sending a message to WebSocket with a stringified JSON object
in the form.

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App"]
}
```

This command will trigger a response

```js
{
  "channel": "connect",
  "payload": "CODE_REQUIRED"
}
```

A UI will popup in GPMDP containing a 4 digit code.  You must instruct your user to provide this 4 digit
code to you and you must then send it in the following form

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App", "0000"]
}
```

If the code is incorrect the `CODE_REQUIRED` message will be sent to you again.  If it is correct however
you will receive a **permanent** authorization code in the following form

```js
{
  "channel": "connect",
  "payload": "RANDOM_STRING_OF_CHARS_HERE"
}
```

As soon as you receive that message (and whenever you want to connect to the WebSocketAPI) you must simply
send one message in the form.

```js
{
  "namespace": "connect",
  "method": "connect",
  "arguments": ["Name of Device / App", "RANDOM_STRING_OF_CHARS_HERE"]
}
```
