import { app } from 'electron';
import createDiscordClient from 'discord-rich-presence';
import _ from 'lodash';

// Handle because RPC is weird
process.on('unhandledRejection', () => null);

let client;

let lastTrack = null;
let lastStart = new Date(0);
let lastPlayingState = false;

const setPresence = () => {
  if (!Settings.get('discordRichPresence', false)) return;

  client = client || createDiscordClient('391934620418965504');
  const time = PlaybackAPI.currentTime();
  const currentTrack = PlaybackAPI.currentSong();
  const isPlaying = PlaybackAPI.isPlaying();
  const queue = PlaybackAPI.getQueue();
  const track = currentTrack || lastTrack;
  if (!time.current) return;
  const start = new Date(Date.now() - time.current);
  if (JSON.stringify(track) !== JSON.stringify(lastTrack)
      || Math.round(start.getTime() / 1000) !== Math.round(lastStart.getTime() / 1000)
      || isPlaying !== lastPlayingState) {
    const end = new Date(start.getTime() + time.total);
    lastTrack = track;
    lastStart = start;
    lastPlayingState = isPlaying;

    if (!track) return;

    let queueTrackIndex = 0;
    let queueLength = 0;

    // kinda hacky way to get index of song in playlist.
    // this wont work properly if the paylist is all one song.
    if (queue instanceof Array) {
      queueLength = queue.length;
      for (let i = 0; i < queue.length; i++) {
        if (track.title !== queue[i].title) continue;
        if (track.album !== queue[i].album) continue;
        if (track.artist !== queue[i].artist) continue;
        queueTrackIndex = queue[i].index;
      }
    }

    const presence = {
      state: track.title,
      details: `Album ${track.album} by ${track.artist}`,
      startTimestamp: start,
      endTimestamp: end,
      instance: false,
      largeImageKey: 'playing',
      largeImageText: 'Google Play Music',
      partySize: queueTrackIndex,
      partyMax: queueLength,
    };

    if (queueTrackIndex > queueLength || !queueTrackIndex) {
      delete presence.partySize;
      delete presence.partyMax;
    }

    if (!isPlaying) {
      presence.smallImageKey = 'pause';
      presence.smallImageText = 'Paused';
      delete presence.startTimestamp;
      delete presence.endTimestamp;
      presence.state += ' (Paused)';
    }

    client.updatePresence(presence);
  }
};

app.on('before-quit', () => {
  client.disconnect();
});

PlaybackAPI.on('change:state', setPresence);
PlaybackAPI.on('change:track', setPresence);
PlaybackAPI.on('change:time', _.throttle(setPresence, 15000));
