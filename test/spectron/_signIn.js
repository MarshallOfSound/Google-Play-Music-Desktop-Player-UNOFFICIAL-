const GOOGLE_MUSIC_JS_EMAIL = process.env.GOOGLE_MUSIC_JS_EMAIL;
const GOOGLE_MUSIC_JS_PASSWORD = process.env.GOOGLE_MUSIC_JS_PASSWORD;

const signIn = (done) => {
  app.client
    .waitUntilWindowLoaded()
    .windowByIndex(1)
    .waitForVisible('[data-action=signin]').should.eventually.be.true
    .click('[data-action=signin]').should.eventually.be.ok
    .then(() => {
      setTimeout(() => {
        app.client // eslint-disable-line
          .waitForVisible('#Email').should.eventually.be.true
          .setValue('#Email', GOOGLE_MUSIC_JS_EMAIL).should.eventually.be.ok
          .waitForVisible('#next')
          .click('#next')
          .waitForVisible('#Passwd').should.eventually.be.true
          .setValue('#Passwd', GOOGLE_MUSIC_JS_PASSWORD).should.eventually.be.ok
          .waitForVisible('#signIn')
          .click('#signIn')
          .then(() => done());
      }, 1000);
    });
};

export default signIn;
