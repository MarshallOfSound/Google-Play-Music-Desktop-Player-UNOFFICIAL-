import React, { Component } from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';

import GeneralTab from '../components/settings/tabs/GeneralTab';
import HotkeyTab from '../components/settings/tabs/HotkeyTab';
import LastFMTab from '../components/settings/tabs/LastFMTab';
import ListenBrainzTab from '../components/settings/tabs/ListenBrainzTab';
import MiniTab from '../components/settings/tabs/MiniTab';
import PlaybackTab from '../components/settings/tabs/PlaybackTab';
import StyleTab from '../components/settings/tabs/StyleTab';
import WindowContainer from '../components/generic/WindowContainer';

const styles = {
  tab: {
    overflow: 'auto',
    flex: 1,
  },
  tabContainer: {
    height: '100%',
    flex: 1,
    flexDirection: 'column',
    display: 'flex',
  },
};

export default class SettingsPage extends Component {
  render() {
    return (
      <WindowContainer title={TranslationProvider.query('title-settings')}>
        <Tabs style={styles.tabContainer} contentContainerStyle={styles.tab}>
          <Tab label={TranslationProvider.query('title-settings-general')}>
            <GeneralTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-mini')}>
            <MiniTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-lastfm')}>
            <LastFMTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-listenbrainz')}>
            <ListenBrainzTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-hotkeys')}>
            <HotkeyTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-playback')}>
            <PlaybackTab />
          </Tab>
          <Tab label={TranslationProvider.query('title-settings-style')}>
            <StyleTab />
          </Tab>
        </Tabs>
      </WindowContainer>
    );
  }
}
