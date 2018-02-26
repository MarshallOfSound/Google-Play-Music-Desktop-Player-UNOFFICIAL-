let trigID = 0;
const receiverFn = (receivers) =>
  new Promise((resolve, reject) => {
    let dialog = document.createElement('paper-dialog');
    trigID++;
    const body = document.getElementsByTagName('body')[0];
    const title = 'Choose Cast Device'; // TODO: New translate key needed
    const h3 = document.createElement('h3');
    h3.textContent = title;
    dialog.appendChild(h3);

    const listContainer = document.createElement('paper-listbox');
    receivers.forEach((receiver) => {
      const cast = document.createElement('paper-item');
      cast.textContent = receiver.friendlyName;
      cast.setAttribute('data-reciever-id', `${receiver.ipAddress}_${receiver.port}_${trigID}`);
      listContainer.appendChild(cast);
      document.body.addEventListener('click', (e) => {
        if (!dialog || !dialog.opened) return;
        if (e.target.getAttribute('data-reciever-id') === `${receiver.ipAddress}_${receiver.port}_${trigID}`) {
          dialog.close();
          dialog.parentNode.removeChild(dialog);
          dialog = null;
          resolve(receiver);
        }
      });
    });
    dialog.appendChild(listContainer);

    listContainer.style.display = 'block';
    listContainer.style.maxHeight = '50vh';
    listContainer.style.overflowY = 'auto';

    dialog.innerHTML += `
    <div class="buttons">
      <paper-button data-cancel dialog-dismiss>Cancel</paper-button>
      <paper-button data-stop-cast dialog-dismiss>Stop</paper-button>
    </div>`;

    // Handle Close and Cancel Buttons
    const closeHandler = (e) => {
      if (!dialog) {
        return;
      } else if (!dialog.opened) {
        dialog.parentNode.removeChild(dialog);
        dialog = null;
        document.body.removeEventListener('mousedown', closeHandler);
        return;
      }
      if (e.target.hasAttribute('data-stop-cast')) {
        reject('STOP');
      } else if (e.target.hasAttribute('data-cancel')) {
        reject('CANCEL');
      }
    };
    document.body.addEventListener('mousedown', closeHandler);

    body.appendChild(dialog);

    dialog.alwaysOnTop = true;
    dialog.withBackdrop = true;
    dialog.toggle();
  });

require('electron-chromecast')(receiverFn);

const GOOGLE_MINI_PLAYER_EXT_ID = 'fahmaaghhglfmonjliepjlchgpgfmobi';
const PING = 206;
const PONG = 207;
const TRIGGER_CONNECT = 21;
const CONNECTED = 111;
const SYNC = 211;
const SYNC_RESPOND = 305;
const STATUS_UPDATE = 15;

/**
 * This is effectively voodoo, basically we fake being the official Google Play Music
 * Mini Player and receive a whole bunch of handy events.  Would love to rewrite gmusic.js
 * to use this but really don't have the time.
 */
global.chrome.runtime = {
  connect: (extensionId) => {
    const createChannel = (label) => { // eslint-disable-line
      const fns = [];
      return {
        addListener: (...args) => {
          // console.info(extensionId, label, 'addL', args);
          fns.push(args[0]);
        },
        removeListener: () => {
          // console.info(extensionId, label, 'removeL', args);
        },
        call: (...args) => fns.forEach(fn => fn(...args)),
      };
    };
    // console.info('Connect:', extensionId, opts);

    const onDisconnect = createChannel('onDisconnect');
    const onMessage = createChannel('onMessage');

    // Immediately disconnect if it isn't the connection we're looking for
    if (extensionId !== GOOGLE_MINI_PLAYER_EXT_ID) {
      setTimeout(() => {
        // console.info('Disconnecting');
        onDisconnect.call();
      }, 0);
    }

    return {
      postMessage: (obj) => {
        if (extensionId === GOOGLE_MINI_PLAYER_EXT_ID) {
          if (obj.type === PING) {
            onMessage.call({ type: PONG, sentFrom: 'bg' });
          } else if (obj.type === TRIGGER_CONNECT) {
            onMessage.call({ type: CONNECTED, message: [true, null, false], sentFrom: 'bg' });
          } else if (obj.type === SYNC) {
            onMessage.call({ type: SYNC_RESPOND, message: [true, false, 3], sentFrom: 'bg' });
          } else if (obj.type === STATUS_UPDATE) {
            const rawMessage = obj.message[0];
            // descontruct
            const rawSongInfo = rawMessage[1];
            const songInfo = {
              id: rawSongInfo[0],
              title: rawSongInfo[1],
              artist: rawSongInfo[2],
              album: rawSongInfo[3],
              duration: rawSongInfo[9],
              albumArt: rawSongInfo[10],
            };
            const currentTime = rawMessage[2];
            const isPlaying = !rawMessage[5]; // eslint-disable-line

            window.GPM.emit('change:playback-time-internal', {
              current: currentTime,
              total: songInfo.duration,
            });
          }
        }
      },
      onMessage,
      onDisconnect,
    };
  },
};
