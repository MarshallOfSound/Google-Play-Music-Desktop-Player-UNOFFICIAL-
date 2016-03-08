const mpris = require('mpris-service');


class MprisService {
    constructor() {
        this.player = mpris({
            name: 'gpmdp',
            identity: 'Google Play Music Desktop Player',
            supportedInterfaces: ['player']
        });

        // DEV: Remove after feature completion
        //var events = ['raise', 'quit', 'next', 'previous', 'pause', 'playpause', 'stop', 'play', 'seek', 'position', 'open', 'volume'];

        //events.forEach( (eventName) => {
        //    player.on(eventName, () => {
        //        console.log("Event:", eventName, arguments);
        //    });
        //});

        this.listeners();
    }

    listeners() {
        this.player.on('play', () => {
            if (!PlaybackAPI.isPlaying()) {
                Emitter.sendToGooglePlayMusic('playback:playPause');
            }
        });

        this.player.on('playpause', () => {
           Emitter.sendToGooglePlayMusic('playback:playPause');
        });

        this.player.on('next', () => {
           Emitter.sendToGooglePlayMusic('playback:nextTrack');
        });

        this.player.on('previous', () => {
           Emitter.sendToGooglePlayMusic('playback:previousTrack');
        });

        this.player.on('stop', () => {
           Emitter.sendToGooglePlayMusic('playback:stop');
           this.updatePlaybackStatus('Stopped');
        });

        PlaybackAPI.on('change:song', (newSong) => {
            this.updateMetadata(newSong);             
        });
    }

    updateMetadata(newSong) {
        this.player.metadata = {
            //'mpris:trackid': player.objectPath('track/0'),
            //'mpris:length' : newSong.length, // 
            //'mpris:artUrl' : newSong.art, //
            'xesam:title': newSong.title, //
            'xesam:album': newSong.album, //
            'xesam:artist': newSong.artist
        };
    }
    
    updatePlaybackStatus(status) {
        this.player.playbackStatus = status;
    }
    
}

const mprisService = new MprisService();


// Listen for dbus signals


// Publish now playing info 

