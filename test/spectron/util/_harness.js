import { Application } from 'spectron';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import path from 'path';
import signIn from './_signIn';

chai.should();
chai.use(chaiAsPromised);

process.on('unhandledRejection', console.error.bind(console));
process.on('uncaughtException', console.error.bind(console));

let appPath;
if (process.platform === 'win32') {
  appPath = path.resolve(
    __dirname,
    '../../../node_modules/electron-prebuilt/dist/electron.exe'
  );
} else if (process.platform === 'darwin') {
  appPath = path.resolve(
    __dirname,
    '../../../node_modules/electron-prebuilt/dist/electron.app/Contents/MacOS/electron'
  );
} else {
  appPath = path.resolve(
    __dirname,
    '../../../node_modules/electron-prebuilt/dist/electron'
  );
}

export const harness = (name, fn, handleSignIn = true, handleFirstStart = true) => {
  describe('When GPMDP launches', function describeWrap() {
    this.timeout(100000);
    global.app = null;

    before(() => {
      app = new Application({
        path: appPath,
        env: {
          TEST_SPEC: true,
        },
        args: ['.'],
      });
      return app.start()
        .then(() => {
          chaiAsPromised.transferPromiseness = app.transferPromiseness;
          return app;
        });
    });

    if (handleFirstStart) {
      before(() =>
        app.client.windowByIndex(0)
          .waitUntilWindowLoaded()
          .waitForVisible('#welcome .modal-close')
          .click('#welcome .modal-close')
      );
    }

    before((done) =>
      app.client.windowByIndex(1)
        .waitUntilWindowLoaded()
        .getWindowCount().should.eventually.equal(2)
        .then(() => {
          if (!handleSignIn) {
            return done();
          }
          setTimeout(() => {
            app.webContents.getURL()
              .then((url) => {
                if (/#/gi.test(url)) {
                  done();
                } else {
                  signIn(done);
                }
              });
          }, 5000);
        })
    );

    describe(name, fn);

    after(() => {
      if (app && app.isRunning()) {
        return app.stop();
      }
    });
  });
};
