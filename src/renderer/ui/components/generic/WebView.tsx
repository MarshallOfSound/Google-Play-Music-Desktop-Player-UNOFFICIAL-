import * as _ from 'lodash';
import * as React from 'react';
import { findDOMNode } from 'react-dom';

const { PropTypes } = React;

const EVENTS = [
  'load-commit',
  'did-finish-load',
  'did-fail-load',
  'did-frame-finish-load',
  'did-start-loading',
  'did-stop-loading',
  'did-get-response-details',
  'did-get-redirect-request',
  'dom-ready',
  'page-title-set',
  'page-favicon-updated',
  'enter-html-full-screen',
  'leave-html-full-screen',
  'console-message',
  'new-window',
  'close',
  'ipc-message',
  'crashed',
  'gpu-crashed',
  'plugin-crashed',
  'destroyed',
];

const METHODS = [
  'focus',
  'executeJavaScript',
];

export default class WebView extends React.Component<{
  src: string,
  className: string,
  preload: string,
  didNavigate?: Function,
  didNavigateInPage?: Function
}, {}> {
  view: any;
  executeJavaScript: (code: string) => void;
  focus: () => void;

  static propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
    preload: PropTypes.string.isRequired,
  }

  componentDidMount() {
    const view = findDOMNode(this.view);
    EVENTS.forEach((eventKey) => {
      view.addEventListener(eventKey, (...args) => {
        // console.info(eventKey, args);
        if (this.props[_.camelCase(eventKey)]) {
          this.props[_.camelCase(eventKey)](...args);
        }
      });
    });

    METHODS.forEach(method => {
      this[method] = (...args) => {
        if (!view[method]) return;
        view[method](...args);
      };
    });

    view.addEventListener('dom-ready', () => {
      view.addEventListener('did-navigate', (...args) => {
        if (this.props.didNavigate) this.props.didNavigate(...args); // eslint-disable-line
      });
      view.addEventListener('did-navigate-in-page', (...args) => {
        if (this.props.didNavigateInPage) this.props.didNavigateInPage(...args); // eslint-disable-line
      });
    });
  }

  render() {
    return (
      <webview
        ref={view => this.view = view}
        src={this.props.src}
        className={this.props.className}
        preload={this.props.preload}
      />
    );
  }
}

EVENTS.forEach((event) => {
  WebView.propTypes[_.camelCase(event)] = React.PropTypes.func;
});
