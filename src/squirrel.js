import { app } from 'electron';
import path from 'path';
import { spawn } from 'child_process';

import { createShortcuts, updateShortcuts, removeShortcuts } from './main/utils/_shortcutManager';

const handleStartupEvent = () => {
  if (process.platform !== 'win32') {
    return false;
  }

  const squirrelCommand = process.argv[1];

  const target = path.basename(process.execPath);

  switch (squirrelCommand) {
    case '--squirrel-install':
      createShortcuts();
      app.quit();
      return true;
    case '--squirrel-updated':
      updateShortcuts();
      app.quit();
      return true;
    case '--squirrel-uninstall':
      removeShortcuts();
      app.quit();
      return true;
    case '--squirrel-obsolete':
      app.quit();
      return true;
    default:
      return false;
  }
};

export default handleStartupEvent;
