/**
 * Settings wrapper for the micro player.
 */
export class MicroPlayerSettings {
  /**
   * Gets or sets the enabled state of the micro player.
   * @returns {boolean} The enabled state.
   */
  get enabled() {
    return this._get('enabled', false);
  }

  set enabled(value) {
    this._set('enabled', value);
  }

  /**
   * Gets or sets the size of the micro player.
   * @returns {[number, number]} The width and height.
   */
  get size() {
    return this._get('size', [400, 40]);
  }

  set size(value) {
    this._set('size', value);
  }

  /**
   * Gets or sets the position of the micro player.
   * @returns {[number, number] | undefined} The x- and y-coordinates or `undefined` if no position has been saved.
   */
  get position() {
    return this._get('position');
  }

  set position(value) {
    this._set('position', value);
  }

  /**
   * Gets the value of a setting.
   * @param {string} key The settings key.
   * @param {any} defaultValue The value to return if the setting is not defined.
   * @returns {any} The setting value.
   */
  _get(key, defaultValue) {
    return Settings.get(`microplayer-${key}`, defaultValue);
  }

  /**
   * Sets the value of a setting.
   * @param {string} key The settings key.
   * @param {any} value The value of the setting.
   */
  _set(key, value) {
    Settings.set(`microplayer-${key}`, value);
  }
}
