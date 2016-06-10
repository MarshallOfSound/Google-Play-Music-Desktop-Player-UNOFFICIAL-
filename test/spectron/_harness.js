import { Application } from 'spectron';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import fs from 'fs';
import path from 'path';
import signIn from './_signIn';

chai.should();
chai.use(chaiAsPromised);

let appPath;
if (process.platform === 'win32') {
  appPath = path.resolve(
    __dirname,
    '../../dist/Google Play Music Desktop Player-win32-ia32/Google Play Music Desktop Player.exe'
  );
  if (!fs.existsSync(appPath)) {
    appPath = path.resolve(
      __dirname,
      '../../dist/Google Play Music Desktop Player-win32-x64/Google Play Music Desktop Player.exe'
    );
  }
}

const harness = (name, fn) => {
  describe('When GPMDP launches', function describeWrap() {
    this.timeout(100000);
    global.app = null;

    beforeEach(() => {
      app = new Application({
        path: appPath,
      });
      return app.start();
    });

    beforeEach(() => {
      chaiAsPromised.transferPromiseness = app.transferPromiseness;
    });

    beforeEach((done) =>
      app.client.windowByIndex(1)
        .waitUntilWindowLoaded()
        .getWindowCount().should.eventually.equal(2)
        .then(() => {
          setTimeout(() => {
            app.webContents.getURL()
              .then((url) => {
                if (/u=/gi.test(url)) {
                  done();
                } else {
                  signIn(done);
                }
              });
          }, 5000);
        })
    );

    describe(name, fn);

    afterEach(() => {
      if (app && app.isRunning()) {
        return app.stop();
      }
    });
  });
};

export default harness;
