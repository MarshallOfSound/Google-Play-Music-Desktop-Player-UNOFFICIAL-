import Module from 'module';

const originalRequire = Module.prototype.require;

Module.prototype.require = function fancyCoverageRequireHack(moduleName, ...args) {
  try {
    return originalRequire.call(this, moduleName.replace('build/', 'cov/'), ...args);
  } catch (e) {
    return originalRequire.call(this, moduleName, ...args);
  }
};
