import harness from './_harness';

harness('when initializing', () => {
  it('should load an initial window', () =>
    app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(2) // Window and WebView
  );

  it('should hide the loader eventually', () =>
    app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(2) // Window and WebView
      .windowByIndex(0)
      .waitForExist('body').should.eventually.be.true
      .waitUntil(() =>
        app.client.getAttribute('body', 'loaded').then((loaded) => loaded === 'loaded')
      ).should.eventually.be.true
  );

  it('should show the intial window eventually', () =>
    app.client.waitUntilWindowLoaded()
      .getWindowCount().should.eventually.equal(2) // Window and WebView
      .windowByIndex(0)
      .browserWindow.isMinimized().should.eventually.be.false
      .browserWindow.isDevToolsOpened().should.eventually.be.false
      .browserWindow.isVisible().should.eventually.be.true
      .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
      .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
  );
});
