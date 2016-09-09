import { harness } from './util/_harness';

harness('on first load', () => {
  it('should display the welcome modal', () =>
    app.client.waitUntilWindowLoaded()
      .windowByIndex(0)
      .waitForVisible('body > div > div > div > div > div > div:last-child > button').should.eventually.be.ok
  );
}, false, false);
