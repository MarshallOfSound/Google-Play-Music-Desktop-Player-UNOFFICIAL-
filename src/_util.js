import { screen } from 'electron';

export const positionOnScreen = (position) => {
  let inBounds = false;
  if (position) {
    screen.getAllDisplays().forEach((display) => {
      if (position[0] >= display.workArea.x &&
          position[0] <= display.workArea.x + display.workArea.width &&
          position[1] >= display.workArea.y &&
          position[1] <= display.workArea.y + display.workArea.height) {
        inBounds = true;
      }
    });
  }
  return inBounds;
};

function searchCache(moduleName, callback) {
  let mod;
  try {
    mod = require.resolve(moduleName);
  } catch (err) {
    return;
  }

  if (mod && ((mod = require.cache[mod]) !== undefined)) { // eslint-disable-line
    (function traverse(mod2) {
      mod2.children.forEach((child) => {
        traverse(child);
      });

      callback(mod2);
    }(mod));
  }
}

export const purgeCache = (moduleName) => {
  searchCache(moduleName, (mod) => {
    delete require.cache[mod.id];
  });

  Object.keys(module.constructor._pathCache).forEach((cacheKey) => {
    if (cacheKey.indexOf(moduleName) > 0) {
      delete module.constructor._pathCache[cacheKey];
    }
  });
};
