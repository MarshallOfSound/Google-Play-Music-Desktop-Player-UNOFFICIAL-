import fs from 'fs';

Emitter.on('FetchMainAppCustomStyles', () => {
  const mainAppPath = Settings.get('mainAppStyleFile');
  const css = mainAppPath && fs.existsSync(mainAppPath) ? fs.readFileSync(mainAppPath, 'utf8') : '';
  Emitter.sendToAll('LoadMainAppCustomStyles', css);
});

Emitter.on('FetchGPMCustomStyles', () => {
  const gpmPath = Settings.get('gpmStyleFile');
  const css = gpmPath && fs.existsSync(gpmPath) ? fs.readFileSync(gpmPath, 'utf8') : '';
  Emitter.sendToGooglePlayMusic('LoadGPMCustomStyles', css);
});
