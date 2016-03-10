import { exec } from 'child_process';

class I3IpcHelper {

  isI3() {
    return WindowManager.getWindowManagerName() === 'i3';
  }

  _hasI3Msg(callback) {
    if (this.isI3()) {
      exec('command -v i3-msg', (error) => {
        // we'll get a non 0 exit code if the command doesn't exist
        // this should work on any POSIX compatible shell
        callback(error === null);
      });
    }
    return false;
  }

  _getWindowTitleRegex() {
    const title = WindowManager.get(global.mainWindowID).getTitle();
    return '^' + title + '$';
  }

  _escapeShellArg(str) {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\\"');
  }

  setFloating(mode) {
    this._hasI3Msg(hasMsg => {
      if (hasMsg) {
        const title = this._escapeShellArg(this._getWindowTitleRegex());
        const floatingMode = mode ? 'enable' : 'disable';
        exec(`i3-msg '[title="${title}"] floating ${floatingMode}'`, () => {});
      }
    });
  }

  setupEventListener() {
    Emitter.on('mini', (event, eventArguments) => {
      this.setFloating(eventArguments.state);
    });
  }

}

export default I3IpcHelper;
