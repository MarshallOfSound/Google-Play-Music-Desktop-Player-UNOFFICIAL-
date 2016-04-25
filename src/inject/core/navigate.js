/**
 * Created by dennis on 4/25/16.
 */

window.addEventListener('load', () => {
  if (!window.$) return;

  Emitter.on('navigate:back', () => {
    document.querySelector('webview').executeJavaScript('window.history.back();');
  });

  Emitter.on('navigate:forward', () => {
    document.querySelector('webview').executeJavaScript('window.history.forward();');
  });
});
