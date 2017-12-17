import { app } from 'electron';
import createDiscordClient from 'discord-rich-presence';

let client;

let lastTrack = null;
let lastStart = new Date(0);

const setPresence = () => {
  if (!Settings.get('discordRichPresence', false)) return;

  client = client || createDiscordClient('391934620418965504');
  const time = PlaybackAPI.currentTime();
  const currentTrack = PlaybackAPI.currentSong();
  const track = currentTrack || lastTrack;
  const start = new Date(Date.now() - time.current);
  if (JSON.stringify(track) !== JSON.stringify(lastTrack) || Math.round(start.getTime() / 1000) !== Math.round(lastStart.getTime() / 1000)) {
    const end = new Date(start.getTime() + time.total);
    lastTrack = track;
    lastStart = start;

    if (!track) return;

    client.updatePresence({
      state: `👤  ${track.artist}`,
      details: `🎵  ${track.title}`,
      startTimestamp: start,
      endTimestamp: end,
      instance: false,
      largeImageKey: 'playing',
      largeImageText: 'Google Play Music',
    });
  }
};

app.on('before-quit', () => {
  client.updatePresence();
});

PlaybackAPI.on('change:track', setPresence);
PlaybackAPI.on('change:time', setPresence);
