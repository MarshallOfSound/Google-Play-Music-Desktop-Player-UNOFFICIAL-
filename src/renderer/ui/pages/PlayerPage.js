import { remote, shell } from 'electron';
import React, { Component } from 'react';
import { parse as parseURL } from 'url';

import LoadError from '../components/generic/LoadError';
import LyricsViewer from '../components/generic/LyricsViewer';
import OfflineWarning from '../components/generic/OfflineWarning';
import WebView from '../components/generic/WebView';
import WindowContainer from '../components/generic/WindowContainer';

// Modals
import AboutModal from '../components/modals/AboutModal';
import AlarmModal from '../components/modals/AlarmModal';
import APICodeModal from '../components/modals/APICodeModal';
import ConfirmTrayModal from '../components/modals/ConfirmTrayModal';
import GoToModal from '../components/modals/GoToModal';
import OpenPortModal from '../components/modals/OpenPortModal';
import UpdateModal from '../components/modals/UpdateModal';
import UninstallV2Modal from '../components/modals/UninstallV2Modal';
import WelcomeNewVersionModal from '../components/modals/WelcomeNewVersionModal';

export default class PlayerPage extends Component {
  constructor(...args) {
    super(...args);

    this.once = true;
    const service = Settings.get('service');
    this.ready = false;
    if (service === 'youtube-music') {
      this.targetPage = Settings.get('savePage', true) ?
        Settings.get('lastYTMPage', 'https://music.youtube.com/')
        : 'https://music.youtube.com/';
      this.state = {
        loading: true,
        webviewTarget: 'https://music.youtube.com/',
        title: 'Youtube Music Desktop Player',
        loadFailure: null,
      };
    } else if (service === 'google-play-music' || true) {
      this.targetPage = Settings.get('savePage', true) ?
        Settings.get('lastPage', 'https://play.google.com/music/listen')
        : 'https://play.google.com/music/listen';
      this.state = {
        loading: true,
        webviewTarget: 'https://play.google.com/music/listen#/wmp',
        title: 'Google Play Music Desktop Player',
        loadFailure: null,
      };
    }
  }

  componentDidMount() {
    Emitter.on('window:updateTitle', this._updateTitle);
  }

  componentWillUnmount() {
    Emitter.off('window:updateTitle', this._updateTitle);
  }

  _confirmCloseWindow = () => {
    this.refs.trayModal.show();
  }

  _didStopLoading = () => {
    if (this.once) {
      this.once = false;
      this.refs.view.executeJavaScript(`window.location = "${this.targetPage}"`);
      setTimeout(() => {
        document.body.removeAttribute('loading');
      }, 900);
      setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 2000);
    }
  }

  _didFailLoad = (e) => {
    // Only handle load failures when they come from the main frame.
    // There may be other things that fail to load (API requests, etc.),
    // but that can be expected. We only want to handle the main page failing
    // to load so that we can show a "load failed" page instead of a blank page.
    if (e.isMainFrame && this.once) {
      this.once = false;
      document.body.removeAttribute('loading');
      this.setState({
        loading: false,
        loadFailure: e.errorDescription || `Error code: ${e.errorCode || '?'}`,
      });
    }
  }

  _domReady = () => {
    setTimeout(() => {
      this.refs.view.focus();
      this.ready = true;

      const focusWebview = () => {
        document.querySelector('webview').focus();
      };
      window.addEventListener('beforeunload', () => {
        remote.getCurrentWindow().removeListener('focus', focusWebview);
      });
      remote.getCurrentWindow().on('focus', focusWebview);
    }, 700);
  };

  _didNavigate = (...args) => {
    if (this.ready) this._savePage(...args);
  }

  _didNavigateInPage = (...args) => {
    if (this.ready) this._savePage(...args);
  }

  _newWindow = ({ url }) => {
    const protocol = parseURL(url).protocol;
    if (protocol === 'http:' || protocol === 'https:') {
      shell.openExternal(url);
    }
  }

  _updateTitle = (event, newTitle) => {
    if (process.platform === 'darwin') {
      this.setState({
        title: newTitle,
      });
    }
  }

  _savePage = (param) => {
    const url = param.url || param;

    const service = Settings.get('service');
    if (service === 'youtube-music') {
      if (!/https?:\/\/music\.youtube\.com\//g.test(url)) return;
      Settings.set('lastYTMPage', url);
    } else if (service === 'google-play-music' || true) {
      if (!/https?:\/\/play\.google\.com\/music/g.test(url)) return;
      Settings.set('lastPage', url);
    }
  }

  render() {
    return (
      <WindowContainer isMainWindow title={process.platform === 'darwin' ? this.state.title : ''} confirmClose={this._confirmCloseWindow}>
        <div className="drag-handle-large"></div>
        <div className={`loader ${this.state.loading ? '' : 'hidden'}`}>
          <svg className="circular" viewBox="25 25 50 50">
            <circle className="path" cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
          </svg>
        </div>
        <WebView
          ref="view"
          src={this.state.webviewTarget}
          className={`embedded-player ${process.platform}`}
          preload="../renderer/windows/GPMWebView"
          didStopLoading={this._didStopLoading}
          didFailLoad={this._didFailLoad}
          domReady={this._domReady}
          didNavigate={this._didNavigate}
          didNavigateInPage={this._didNavigateInPage}
          newWindow={this._newWindow}
        />
        <LoadError reason={this.state.loadFailure} />
        <OfflineWarning />
        <LyricsViewer />

        <AboutModal />
        <AlarmModal />
        <APICodeModal />
        <ConfirmTrayModal ref="trayModal" />
        <GoToModal />
        <OpenPortModal />
        <UpdateModal />
        <UninstallV2Modal />
        <WelcomeNewVersionModal />
      </WindowContainer>
    );
  }
}
