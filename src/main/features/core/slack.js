import _ from 'lodash';
import { app } from 'electron';
import { WebClient } from '@slack/client';

const EMOJI = ':headphones:';

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

let clients;

const getClients = () => {
  const tokens = Settings.get('slackToken');
  if (!tokens || tokens.length === 0) {
    return null;
  }

  clients = clients || tokens.map(token => new WebClient(token.trim()));
  return clients;
};

const updateStatus = (reset = false) => {
  const slackClients = getClients();

  if (slackClients.length === 0) {
    return;
  }

  const {
    title,
    artist,
  } = PlaybackAPI.currentSong(true);

  const profileUpdate = getProfileUpdate(title, artist, reset);

  clients.forEach(client => client.users.profile
    .set(profileUpdate)
    .then(() => {
      Logger.debug('Profile status updated on slack:');
    })
    .catch(err => {
      Logger.error('Error updating profile status', err);
    }));
};

const statusUpdater = _.debounce(() => _.delay(updateStatus, 1000), 1000);

PlaybackAPI.on('change:state', statusUpdater);
PlaybackAPI.on('change:track', statusUpdater);

app.on('before-quit', updateStatus.bind(null, true));
