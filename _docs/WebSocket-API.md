---
layout: docs
title:  "WebSocket API"
target: "Dev"
index: 3
---

Google Play Music Desktop Player provides an interface for external applications to determine the currently played song and playback status.

This interface is provided through a locally hosted Web Socket. In a standard release this WebSocket is hosted on port `5672`. Any site or
application should be able to connect to `ws://localhost:5672` and use the API.

##### Message format

All messages are sent from the Web Socket Server in the following format

<pre><code class="language-javascript">{
  "channel": "channel_name",
  "payload": { ...data }
}
</code></pre>

##### Channels

{% assign sortedChannels = site.channels | sort: 'title' %}
{% for channel in sortedChannels %}
[{{ channel.title }}]({{ channel.url }}) - {{ channel.short }}
{% endfor %}
