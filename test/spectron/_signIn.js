const GOOGLE_MUSIC_JS_EMAIL = process.env.GOOGLE_MUSIC_JS_EMAIL;
const GOOGLE_MUSIC_JS_PASSWORD = process.env.GOOGLE_MUSIC_JS_PASSWORD;

const signIn = (done) => {
  const wC = app.webContents;
  const aC = app.client;
  wC.getTitle().then(console.log.bind(console));
  aC
    .windowByIndex(1)
    .waitForVisible('[data-action=signin]')
    .then(() => wC.executeJavaScript('document.querySelector("[data-action=signin]").click()')
          // app.client
            // .windowByIndex(1)
            // .waitForVisible('#Email')
            // .setValue('#Email', GOOGLE_MUSIC_JS_EMAIL)
            // .waitForVisible('#next')
            // .click('#next')
      // app.client
      //   .windowByIndex(1)
            // .waitForVisible('#signIn')
            // .click('#signIn')
            // .waitForExist('#material-app-bar')
            // .then(done);
    )
    .then(() => {
      console.log('hit');
      wC.getTitle().then(console.log.bind(console));
      aC
        .waitForVisible('#Passwd')
        .setValue('#Passwd', GOOGLE_MUSIC_JS_PASSWORD);
    });
    // .setValue('#Passwd', GOOGLE_MUSIC_JS_PASSWORD);
  // async.waterfall([
  //   function findSignInButton (cb) {
  //     browser.waitForElementByCssSelector('[data-action=signin]', asserters.isDisplayed, cb);
  //   },
  //   function clickSignInButton (el, cb) {
  //     el.click(cb);
  //   },
  //   function findEmailInput (cb) {
  //     browser.waitForElementById('Email', asserters.isDisplayed, cb);
  //   },
  //   function enterEmailIntoInput (el, cb) {
  //     el.type(GOOGLE_MUSIC_JS_EMAIL, cb);
  //   },
  //   function findNextButton (cb) {
  //     browser.waitForElementById('next', asserters.isDisplayed, cb);
  //   },
  //   function clickNextButton (el, cb) {
  //     el.click(cb);
  //   },
  //   function findPasswordInput (cb) {
  //     browser.waitForElementById('Passwd', asserters.isDisplayed, cb);
  //   },
  //   function enterPasswordIntoInput (el, cb) {
  //     el.type(GOOGLE_MUSIC_JS_PASSWORD, cb);
  //   },
  //   function findLoginButton (cb) {
  //     browser.waitForElementById('signIn', asserters.isDisplayed, cb);
  //   },
  //   function clickLoginButton (el, cb) {
  //     el.click(cb);
  //   }
  // ], done);
};

export default signIn;
