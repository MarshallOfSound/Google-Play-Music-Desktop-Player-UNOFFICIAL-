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
    '../../../node_modules/electron/dist/electron.exe'
  );
} else if (process.platform === 'darwin') {
  appPath = path.resolve(
    __dirname,
    '../../../node_modules/electron/dist/electron.app/Contents/MacOS/electron'
  );
} else {
  appPath = path.resolve(
    __dirname,
    '../../../node_modules/electron/dist/electron'
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
          .waitForVisible('body > div > div > div > div > div > div:last-child > button')
          .click('body > div > div > div > div > div > div:last-child > button')
      );
    }

    before(() =>
      app.client.windowByIndex(1)
        .waitUntilWindowLoaded()
        .then(() => {
          if (!handleSignIn) {
            return Promise.resolve();
          }
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              app.webContents.getURL()
                .then((url) => {
                  if (/#/gi.test(url)) {
                    resolve();
                  } else {
                    signIn((err) => {
                      if (err) {
                        resolve();
                      } else {
                        reject(err);
                      }
                    });
                  }
                });
            }, 5000);
          });
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
