import { app, systemPreferences } from 'electron';

const updateThemeBasedOnSystem = () => {
  if (Settings.get('themeTypeShouldTrackSystem')) {
    Settings.set('themeType', systemPreferences.isDarkMode() ? 'FULL' : 'HIGHLIGHT_ONLY');
  }
};

const subscriptionID = systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', updateThemeBasedOnSystem);

updateThemeBasedOnSystem();

app.on('will-quit', () => {
  systemPreferences.unsubscribeNotification(subscriptionID);
});
