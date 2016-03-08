const mpris = require('mpris-service');

var player = mpris({
    name: 'gpmdp',
    identity: 'Google Play Music Desktop Player',
    supportedInterfaces: ['player']
});

var events = ['raise', 'quit', 'next', 'previous', 'pause', 'playpause', 'stop', 'play', 'seek', 'position', 'open', 'volume'];

events.forEach( (eventName) => {
    console.log("Registering: " + eventName);
    player.on(eventName, () => {
        console.log("Event:", eventName, arguments);
    });
});

player.on('play', () => {
   Emitter.sendToGooglePlayMusic('playback:play');
});

player.on('volume', () => {
   Emitter.sendToGooglePlayMusic('playback:play');
});

player.on('playpause', () => {
   Emitter.sendToGooglePlayMusic('playback:playPause');
});

player.on('next', () => {
   Emitter.sendToGooglePlayMusic('playback:nextTrack');
});


player.on('previous', () => {
   Emitter.sendToGooglePlayMusic('playback:previousTrack');
});

player.on('stop', () => {
   Emitter.sendToGooglePlayMusic('playback:stop');
});
