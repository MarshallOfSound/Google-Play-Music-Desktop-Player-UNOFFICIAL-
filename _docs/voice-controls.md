---
layout: docs
title:  "Voice Controls"
target: "User"
index: 5
---

# Hands Free Voice Controls

**NOTE:** By default these voice controls are disabled as they use an as yet unknown
amount of internet.  You can turn them on in the "general" section of Settings.

Google Play Music Desktop Player has implemented the `webkitSpeechRecognition`
API to pick up what you say and uses a cool JS command parser that I wrote myself
to translate that into a single action or a complex series of actions.

For example you can say some as simple as:  

> Hey music, pause  

This would simply pause your music

To something as complex as:  

> Hey music, can you set the volume to 40%, play playlist My Tunes and then mix it up

Which would  

* Set your volume to 40%
* Play one of your playlists with the name "My Tunes"
* Turn shuffle on play a random song from your current queue

This voice controls are as powerful as we make them, if you want a new voice
command you can try implement it yourself or raise a feature request issue.

## What can I say though?

All command listed below must be prefixed with a hotword.  Our current hotword's
are `Hey music` and `OK player`.

You commands don't have to sound robotic either, you can use basic grammar between commands such as *'can you'*.  So instead of *Hey music pause* it becomes nicer and *Hey music, can you pause*.

### Play Playlist
> Play playlist [playlist name]  
> Play the playlist [playlist name]

**Note:** This is the ONLY command that cannot be followed by any other commands

### Pause
> Pause

### Play
> Play

### Next Track
> Next  
> Next Track  
> Forward  
> Fast forward

### Previous Track
> Previous  
> Previous Track  
> Back  
> Rewind  
> Start again

### Thumbs Down
> This song sucks

### Thumbs Up
> This song is great  
> This song is epic  
> This song is awesome  
> This song rocks  
> This song rules

### Shuffle and play random song from Queue
> Mix it up  
> Shuffle  
> Shake  
> Random

### Turn shuffle on
> Turn shuffle on  
> Shuffle on

### Turn shuffle off
> Turn shuffle off  
> Shuffle off

### Navigate to an artist
> Go to artist [Artist Name]  
> Load artist [Artist Name]  
> Navigate to artist [Artist Name]

**NOTE:** This doesn't work with All Access artists yet

### Open Settings
> Settings  
> Open Settings
> Show Settings  
> Load Settings  

### Increase volume at 5% increments
> Turn it up  
> Bring it up  
> Turn the volume up  
> Make it louder  
> I can't hear it

### Decrease volume at 5% increments
> Turn it down  
> Take it down  
> Turn the volume down  
> Make it quieter  
> Make it more quiet


### Set the volume to a specific level
> Set volume to [Number]  
> Set volume [Number]  
> Set the volume to [Number]  
> Make the volume [Number]  

**Note:** *[Number]* must a number between 0 and 100 and can optionally be followed
by *percent*.

### Set the volume to 100%
> Make it boom  
> Sing it out  
> Pump it  
> Get this party started

### Set the volume to 0% (Mute)
> Shut up  
> Mute  
> Silence  
> Turn this right down  
> Party is over

### Undo the volume change caused by setting to 100% or muting
> Reset the volume  
> Normalize
