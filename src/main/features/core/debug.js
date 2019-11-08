import { app, shell } from 'electron';
import archiver from 'archiver';
import fs from 'fs';
import os from 'os';
import path from 'path';

const packageJSON = require(path.resolve(__dirname, '../../../..', 'package.json'));

Emitter.on('generateDebugInfo', () => {
  const debugInfo =
  `Dump Details:
Timestamp: ${new Date()}

App Details:
Version: ${packageJSON.version}
Electron Version: ${packageJSON.dependencies.electron}
Development Build: ${fs.existsSync(path.resolve(__dirname, '../../../..', 'circle.yml')) ? 'true' : 'false'}

Operating System Details:
OS: ${os.platform()}
OS Version: ${os.release()}
OS Arch: ${os.arch()}
System Memory: ${os.totalmem()}
  `;
  const debugFolder = path.resolve(os.tmpdir(), 'gpmdp_debug_info');
  if (!fs.existsSync(debugFolder)) fs.mkdirSync(debugFolder);
  const zip = archiver('zip');
  const output = fs.createWriteStream(path.resolve(debugFolder, 'debug_info.zip'));
  const toRemove = [];
  const addStringToZip = (name, data) => {
    fs.writeFileSync(path.resolve(debugFolder, name), data);
    zip.file(path.resolve(debugFolder, name), {
      name,
    });
    toRemove.push(path.resolve(debugFolder, name));
  };
  const addFileToZip = (filePath) => {
    zip.file(filePath, {
      name: path.basename(filePath),
    });
  };
  output.on('close', () => {
    toRemove.forEach((removePath) => {
      if (fs.existsSync(removePath)) fs.unlinkSync(removePath);
    });
    shell.showItemInFolder(path.resolve(debugFolder, 'debug_info.zip'));
  });

  zip.on('error', (err) => {
    Logger.error(err);
  });

  zip.pipe(output);

  addStringToZip('install.txt', debugInfo.replace(/\n/g, os.EOL));
  addStringToZip('settings.json', JSON.stringify(Object.assign(
    {},
    Settings.data,
    {
      lastFMKey: 'HIDDEN',
      slackToken: 'HIDDEN',
      gpmdp_connect_email: 'HIDDEN',
    }
  ), null, 4));
  addFileToZip(path.resolve(app.getPath('userData'), 'gpmdp.log'));
  if (process.platform === 'win32') {
    addFileToZip(path.resolve(process.env['LOCALAPPDATA'], 'GPMDP_3', 'SquirrelSetup.log')); // eslint-disable-line
  }
  zip.finalize();
});
