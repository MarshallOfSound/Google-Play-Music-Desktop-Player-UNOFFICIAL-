import { exec } from 'child_process';

class I3IpcHelper {

  isI3(): boolean {
    return WindowManager.getWindowManagerName() === 'i3';
  }

  private hasI3Msg(callback: Function) {
    if (this.isI3()) {
      exec('command -v i3-msg', (error) => {
        // we'll get a non 0 exit code if the command doesn't exist
        // this should work on any POSIX compatible shell
        callback(error === null);
      });
    }
    return false;
  }

  private getWindowTitleRegex(): string {
    const title = WindowManager.get(global.mainWindowID).getTitle();
    return `^${title}$`;
  }

  private escapeShellArg(str): string {
    return str.replace(/'/g, "\\'").replace(/"/g, '\\"');
  }

  setFloating(mode: string) {
    this.hasI3Msg(hasMsg => {
      if (hasMsg) {
        const title = this.escapeShellArg(this.getWindowTitleRegex());
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
