# Plugin API

As of GPMDP `4.0.0` we have built in support for third party plugins.  You can
write your own plugins really easily using our [Yeoman Generator](#).  The API
spec and guidelines are outlined below.

## API

Your Plugin module must resolve to a class that has the following API.

```js
class PluginAPI {
  static PLUGIN_NAME = 'Your Plugin Name Here';

  constructor(electronRequire, Emitter, PlaybackAPI, WindowManager, buildDir, additionals) {
    console.log('Plugin created');
  }

  install() {
    console.log('Called once in the main process when installing');
  }

  uninstall() {
    console.log('Called once in each process when uninstalling');
  }

  activate() {
    console.log('Called once in each process during the preload phase');
  }
}
```

**NOTE:** Your module can not have any NPM dependencies that require resolution
upon install.  If you need external dependencies please use [browserify](http://browserify.org/).
Our generator already does this for you.

### `Plugin(electronRequire, Emitter, PlaybackAPI, WindowManager, buildDir, additionals)`

* `electronRequire` - `Function` The global `require` method from inside
Electron.  Use this to `require` modules that aren't browserified such as `electron`
itself.
* `Emitter` - `Object` The global `Emitter` object.  This is GPMDP's wrapper
over Electron's IPC events.  Please use this instead of `ipcMain` and `ipcRenderer`
as it is more reliable.  Be warned the API is different between the `main` and
`renderer` processes. You can see the API's here [Emitter (Main)](EmitterMain.md)
and [Emitter (Renderer)](EmitterRenderer.md)
* `PlaybackAPI` - `Object` The global `PlaybackAPI` object.  This stores the state
of the player at all times.  It is only available in the `main` process, in the
`renderer` process it will be `null`.  Check out the [`PlaybackAPI (Internal)`](PlaybackAPI_Internal.md)
documentation to learn how to utilize it in both processes.
* `WindowManager` - `Object` The global `WindowManager` object, if you need to
create any new `BrowserWindow` objects you **must** add them to the `WindowManager`.
Check out it's API [`WindowManager`](WindowManager.md).  It is only available in
the `main` process, in the `renderer` process it will be `null`.
* `buildDir` - `String` The current path to the build directory of GPMDP.  Use it
with `electronRequire` to require files from GPMDP's src like our React Components.
* `additionals` - `Object` Currently an empty object but in the future extra params could be added

### `Plugin.install()`

This method will be called once in the main process when the Plugin is first
installed.  It will not be called again unless the plugin is uninstalled and then
reinstalled.

### `Plugin.uninstall()`

This method will be called once in each process when the Plugin is requested to
be uninstalled.  You must respect this method call and clean up anything you
are doing.  Plugins that do not respect this call correctly will not be added to
the whitelist.

### `Plugin.activate()`

This method will be called once in each process during the preload phase.  Be
warned that the DOM is not available during this time so DOM interaction will
have to be initiated on the window `load` event.

## Guidelines

### Who can write a plugin?

Anyone :)  If you want to write a crazy plugin to do something epic, do it :)

### How do I get my plugin listed inside the app?

Due to how much access a plugin has to both the users machine and an
authenticated Chromium instance we currently enforce a whitelist of plugins.
This is both for our users security and ours, we would hate to see malicious
plugins being built and we want to do everything we can to prevent that.

To get your plugin listed just send a PR to the `website` branch of this
repository and one of our team will review it ASAP.  Your plugin **must** be
Open Source or we will not approve it.

Guidelines for submitting that pull request can be found [here](#)
