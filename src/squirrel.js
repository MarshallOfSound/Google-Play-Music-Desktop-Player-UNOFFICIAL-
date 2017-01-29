import { app } from 'electron';

import { createShortcuts, updateShortcuts, removeShortcuts } from './main/utils/_shortcutManager';

const handleStartupEvent = () => {
  if (process.platform !== 'win32') {
    return false;
  }

  for (let i = 0; i < process.argv.length; i++) {
    const squirrelCommand = process.argv[i];
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
        break;
    }
  }
  return false;
};

export default handleStartupEvent;
