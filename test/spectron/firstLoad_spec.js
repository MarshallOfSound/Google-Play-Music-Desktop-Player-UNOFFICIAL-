import { harness } from './util/_harness';

harness('on first load', () => {
  it('should display the welcome modal', () =>
    app.client.waitUntilWindowLoaded()
      .windowByIndex(0)
      .waitForVisible('#welcome').should.eventually.be.ok
  );
}, false, false);
