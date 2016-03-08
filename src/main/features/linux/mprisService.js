import mpris from 'mpris-service';

class MprisService {

    constructor() {
        this.player = mpris({
            name: 'gpmdp',
            identity: 'Google Play Music Desktop Player',
            canRaise: true,
            supportedInterfaces: ['player'],
            desktopEntry: 'google-play-music-desktop-player'
        });

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
            // This is required in MPRIS, but no uuid for each track is given by gmusic library.
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
