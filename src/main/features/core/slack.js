import _ from 'lodash';
import { app } from 'electron';
import { WebClient } from '@slack/client';

const EMOJI = ':headphones:';
const clients = {};

const formatTrackForStatus = (title, artist) => {
  const text = `${title} - ${artist}`;

  if (text.length < 100) {
    return text;
  }

  return `${text.substr(0, 97)}...`;
};

const getStatusResetProfileUpdate = () => ({
  profile: {
    status_emoji: '',
    status_text: '',
  },
});

const getProfileUpdateForTrack = (title, artist) => ({
  profile: {
    status_emoji: EMOJI,
    status_text: formatTrackForStatus(title, artist),
  },
});

function getProfileUpdate(title, artist, reset) {
  if (PlaybackAPI.isPlaying() && !reset) {
    return getProfileUpdateForTrack(title, artist);
  }

  return getStatusResetProfileUpdate();
}

const setClientProfile = (client, status) => client.users.profile
  .set(status)
  .then(() => Logger.debug(`Profile status updated on slack for ${client.token}`))
  .catch(err => Logger.error('Error updating profile status', err));

const updateStatus = (reset = false) => {
  const {
    title,
    artist,
  } = PlaybackAPI.currentSong(true);

  const profileUpdate = getProfileUpdate(title, artist, reset);

  // Create any uninitialized clients
  Settings.get('slackToken').forEach(token => {
    if (!clients[token]) { clients[token] = new WebClient(token); }
  });
  Object.values(clients)
    .forEach(client => setClientProfile(client, profileUpdate));
};

const statusUpdater = _.debounce(() => _.delay(updateStatus, 1000), 1000);

PlaybackAPI.on('change:state', statusUpdater);
PlaybackAPI.on('change:track', statusUpdater);

// When the tokens change, reset the clients and update the status
Settings.onChange('slackToken', () => {
  const newTokens = Settings.get('slackToken');
  const oldTokens = Object.keys(clients);

  // Find any tokens that are being removed and reset their status
  oldTokens.filter(v => !newTokens.includes(v)).forEach(v => {
    setClientProfile(clients[v], getStatusResetProfileUpdate());
    delete clients[v];
  });

  // Update the status for any remaining clients. This will initialize new clients
  updateStatus(); // Set the correct statuses
});

app.on('before-quit', updateStatus.bind(null, true));
