import { app, shell } from 'electron';
import fs from 'fs';
import path from 'path';

const packageJSON = require(path.resolve(__dirname, '..', '..', '..', 'package.json'));

const startPath = path.resolve(
  app.getPath('appData'), '..', 'Roaming', 'Microsoft', 'Windows', 'Start Menu', 'Programs',
  packageJSON.author.name, `${packageJSON.productName}.lnk`
);
const desktopPath = path.resolve(app.getPath('home'), 'Desktop', `${packageJSON.productName}.lnk`);
const taskbarPath = path.resolve(
  app.getPath('appData'), '..', 'Roaming', 'Microsoft', 'Internet Explorer', 'Quick Launch', 'User Pinned',
  'TaskBar', `${packageJSON.productName}.lnk`
);
const startPinPath = path.resolve(
  app.getPath('appData'), '..', 'Roaming', 'Microsoft', 'Internet Explorer', 'Quick Launch', 'User Pinned',
  'StartMenu', `${packageJSON.productName}.lnk`
);

const squirrelPath = path.resolve(path.dirname(process.execPath), '..', 'update.exe');

const shortcutAtPath = (targetPath, create) => {
  if (process.platform !== 'win32') return;
  if (!fs.existsSync(targetPath) && !create) return;
  shell.writeShortcutLink(targetPath, fs.existsSync(targetPath) ? 'update' : 'create', {
    target: squirrelPath,
    args: `--processStart "${path.basename(process.execPath)}"`,
    icon: process.execPath,
    iconIndex: 0,
    appUserModelId: 'com.marshallofsound.gpmdp.core',
  });
};

export const createShortcuts = () => {
  shortcutAtPath(desktopPath, true);
  shortcutAtPath(startPath, true);
};

export const updateShortcuts = () => {
  shortcutAtPath(desktopPath);
  shortcutAtPath(startPath);
  shortcutAtPath(taskbarPath);
  shortcutAtPath(startPinPath);
};

export const removeShortcuts = () => {
  if (fs.existsSync(startPath)) fs.unlinkSync(startPath);
  if (fs.existsSync(desktopPath)) fs.unlinkSync(desktopPath);
  if (fs.existsSync(taskbarPath)) fs.unlinkSync(taskbarPath);
  if (fs.existsSync(startPinPath)) fs.unlinkSync(startPinPath);
};
