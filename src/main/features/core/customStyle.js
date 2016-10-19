import fs from 'fs';

Emitter.on('FetchMainAppCustomStyles', () => {
  const mainAppPath = Settings.get('mainAppStyleFile');
  if (mainAppPath && fs.existsSync(mainAppPath)) {
    fs.readFile(mainAppPath, 'utf8', (err, css) => {
      Emitter.sendToAll('LoadMainAppCustomStyles', err ? '' : css);
    });
  }
});

Emitter.on('FetchGPMCustomStyles', () => {
  const gpmPath = Settings.get('gpmStyleFile');
  if (gpmPath && fs.existsSync(gpmPath)) {
    fs.readFile(gpmPath, 'utf8', (err, css) => {
      Emitter.sendToGooglePlayMusic('LoadGPMCustomStyles', err ? '' : css);
    });
  }
});
