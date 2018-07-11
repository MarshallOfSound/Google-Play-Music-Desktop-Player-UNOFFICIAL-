window.wait(() => {
  const volumeContainer = document.querySelector('#material-player-right-wrapper #volume');
  const down = volumeContainer.querySelector('[icon="av:volume-down"]');
  const up = volumeContainer.querySelector('#material-volume-indicator[icon="av:volume-up"]');
  down.style.cursor = 'pointer';
  up.style.cursor = 'pointer';
  down.addEventListener('click', () => GPM.volume.decreaseVolume());
  up.addEventListener('click', () => GPM.volume.increaseVolume());
});
