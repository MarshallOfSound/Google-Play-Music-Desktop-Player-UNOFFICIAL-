import { screen } from 'electron';
import _ from 'lodash';

const SNAP_THRESHOLD = 5;

/**
 * Clamps a window coordinate to be within the display.
 * @param {number} windowPoint The x- or y-coordinate of the window.
 * @param {number} windowSize The width or height of the window.
 * @param {number} displayPoint The x- or y-coordinate of the display.
 * @param {number} displaySize The width or height of the display.
 * @returns {number} The clamped coordinate.
 */
function clampWindowCoordinate(windowPoint, windowSize, displayPoint, displaySize) {
  // Make sure the edge of the window is not to the
  // left/top of the display, and the other side of the
  // window is not past the other side of the display.
  return _.clamp(
    windowPoint,
    displayPoint,
    displayPoint + (displaySize - windowSize),
  );
}

/**
 * Ensures that the given position is fully on a screen.
 * @param {[number, number]} size The size of the window.
 * @param {[number, number] | undefined} position The window position to adjust.
 * @returns {[number, number]} The adjusted window position.
 */
function ensurePositionOnScreen(size, position) {
  if (!position) {
    // There isn't a previous window position, so return a position that will
    // put the window the top-center of the screen that contains the main window.
    const mainScreen = screen.getDisplayMatching(WindowManager.getAll('main')[0].getBounds());

    return [
      mainScreen.bounds.x + ((mainScreen.bounds.width - size[0]) / 2),
      mainScreen.bounds.y,
    ];
  }

  // Make sure the window is fully on screen. Find the display that the
  // window is on the most (or the primary display if it's not on any
  // display), and move the window so that it's fully on that screen.
  const display = screen.getDisplayMatching({
    x: position[0],
    y: position[1],
    width: size[0],
    height: size[1],
  }) || screen.getPrimaryDisplay();

  return [
    clampWindowCoordinate(position[0], size[0], display.bounds.x, display.bounds.width),
    clampWindowCoordinate(position[1], size[1], display.bounds.y, display.bounds.height),
  ];
}

/**
 * Manages the size and position of the micro player window.
 */
export class MicroPlayerBoundsManager {
  /**
   * @constructor
   * @param {import('electron').BrowserWindow} window The window to manage.
   * @param {import('./MicroPlayerSettings').MicroPlayerSettings} settings The settings to use.
   */
  constructor(window, settings) {
    /** @type [string, Function][] */
    this._listeners = [];

    this._window = window;
    this._settings = settings;

    const position = ensurePositionOnScreen(
      this._window.getSize(),
      this._settings.position,
    );

    this._window.setPosition(...position);

    // Debounce save requests so that we don't save
    // while the window is being moved or resized.
    const save = _.debounce(() => {
      this._settings.position = window.getPosition();
      this._settings.size = window.getSize();
    }, 1000);

    // Debounce the screen edge snapping. If we snapped to the edge of
    // the screen on every move event, then you would never be able to
    // move the window from one display to another when your displays
    // are laid out vertically. This isn't the ideal behavior but it's
    // the best we can do given that we are only notified that the window
    // has moved, and not that it has started or stopped being moved.
    const snap = _.debounce(() => {
      this._snapToScreenEdge();
    }, 250);

    this._addListener('resize', save);

    this._addListener('move', () => {
      save();
      snap();
    });

    // Cancel the debounced functions when the window closes
    // to prevent those functions operating on a closed window.
    this._addListener('closed', () => {
      save.cancel();
      snap.cancel();
    });
  }

  /**
   *Adds an event listener to the window and records the listener for disposal.
   * @param {string} event The event name.
   * @param {Function} listener The event listener to add.
   */
  _addListener(event, listener) {
    this._window.on(event, listener);
    this._listeners.push([event, listener]);
  }

  /**
   * Moves the window so that it touches the top or bottom of the display that
   * it's primarly on if the window is near to the top or bottom of the display.
   *
   * Because the window has a landscape orientation and is designed to be put at the top
   * or the bottom of the display, no changes are made to the x-coordinate of the window.
   */
  _snapToScreenEdge() {
    const bounds = this._window.getBounds();
    const display = screen.getDisplayMatching(bounds);

    // If the window has been moved so that part of it is
    // above the top of the display, then move the window
    // down so that it's touching the top of the display.
    const windowTop = bounds.y;
    const displayTop = display.bounds.y;

    if (windowTop <= (displayTop + SNAP_THRESHOLD)) {
      this._window.setPosition(bounds.x, displayTop);
      return;
    }

    // If the window has been moved so that part of it is
    // below the bottom of the display, then move the window
    // up so that it's touching the bottom of the display.
    const windowBottom = bounds.y + bounds.height;
    const displayBottom = display.bounds.y + display.bounds.height;

    if (windowBottom >= (displayBottom - SNAP_THRESHOLD)) {
      this._window.setPosition(bounds.x, displayBottom - bounds.height);
    }
  }

  /**
   * Removes event listeners.
   */
  dispose() {
    this._listeners.forEach(([event, listener]) => {
      this._window.removeListener(event, listener);
    });
  }
}
