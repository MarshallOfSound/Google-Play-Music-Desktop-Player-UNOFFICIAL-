let loaded = false;

/**
 * Indicates whether the application has finished loading.
 * @returns {boolean} True if the application has finished loading; otherwise, false.
 */
export function getAppLoaded() {
  return loaded;
}

/**
 * Stores whether the application has finished loading.
 * @param {boolean} value The new value.
 */
export function setAppLoaded(value) {
  loaded = value;
}
