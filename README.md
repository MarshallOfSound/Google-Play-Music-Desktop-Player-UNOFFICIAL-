Google Play Music™ Desktop Player
=========================

[![Join the chat at https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Github All Releases](https://img.shields.io/github/downloads/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/total.svg)](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases)
 [![GitHub version](https://badge.fury.io/gh/MarshallOfSound%2FGoogle-Play-Music-Desktop-Player-UNOFFICIAL-.svg)](https://badge.fury.io/gh/MarshallOfSound%2FGoogle-Play-Music-Desktop-Player-UNOFFICIAL-)
 [![Code Climate](https://codeclimate.com/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/badges/gpa.svg)](https://codeclimate.com/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-)
 [![Coverage Status](https://coveralls.io/repos/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/badge.svg)](https://coveralls.io/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-)
 [![Average time to resolve an issue](http://isitmaintained.com/badge/resolution/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-.svg)](http://isitmaintained.com/project/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL- "Average time to resolve an issue")
 <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=23CZGASL6XMLJ" title="Help me out by donating to this project"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a>  
 Windows: [![Build status](https://ci.appveyor.com/api/projects/status/clg5vclqyltff7hg/branch/master?svg=true)](https://ci.appveyor.com/project/MarshallOfSound/google-play-music-desktop-player-unofficial/branch/master)  
 MacOS / Linux: [![CircleCI](https://circleci.com/gh/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/tree/master.svg?style=svg)](https://circleci.com/gh/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/tree/master)

![](http://samuel.ninja/img/gpmdp_screen.gif)

Run "Google Play Music" as a standalone desktop app.  Never again will you have to hunt through your tabs to pause your music, or stop listening to your favourite song because Chrome is guzzling up all your RAM. Now also has YouTube Music player fully integrated.

Developed by [Samuel Attard][1].

No affiliation with Google. Google Play is a trademark of Google Inc.

[1]: https://www.samuelattard.com

Download
---------
Head over to our website http://www.googleplaymusicdesktopplayer.com to download the latest release for your platform.

If you'd like to try out the latest "successful" development build, head over to this search tool: https://gpmdp.azurewebsites.net/ Project here: agc93/gpmdp-release
Note: Though a build was successfully build, it may have severe defects. Use at your own risk.

OS Support
------------

* Windows 7 or later
* Mac OS X 10.9.0 or later
* Ubuntu 14.04 or later
* Mint
* Fedora
* Debian

Features
--------

* Supports media keys (play, pause, stop, next, previous)
* [YouTube Music](https://music.youtube.com) fully integrated!
* [last.fm](https://www.last.fm) & [ListenBrainz](https://listenbrainz.org/) Scrobbling and Now Playing support!
* Discord [Rich Presences](https://discordapp.com/rich-presence) Now Playing information
* Hands free [Voice Controls](docs/VoiceControls.md)!
* Desktop notifications on track change
* A simplistic mini player
* Dark Theme
* Customizable accent color + CSS support
* Task bar media controls (media controls embedded into the taskbar) *Windows only*
* Smooth scrolling and overlay scrollbars for a nicer User Experience
* HTML5 Audio Support - No more Adobe Flash Player :+1:
* Minimize to task bar for background music playing
* Customizable hotkeys, no worries if you don't have media keys.  Choose your own shortcuts
* Choose your audio output device from within the player
* Song Lyrics for those Karaoke nights
* And a whole lot more coming soon!

Integrating with GPMDP from External Applications
-------------------------------------------------
There are two methods you can use to integrate with GPMDP from an external application.  
1. [JSON Interface](docs/PlaybackAPI.md)  
2. [Web Socket Interface](docs/PlaybackAPI_WebSocket.md)  

Both are documented in the [Docs](docs) folder.  For one time read access you should
probably use the `JSON` interface.  For an application that requires continuous
updates as to the state of GPMDP or needs to control GPMDP you should use the
`Web Socket` interface.

Issues
-------
If you have any bugs / issues please check the
[FAQ](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/wiki/FAQ)
first before raising an issue


Credits
-------

[Logo](src/assets/icons/svg/vector_logo.svg) designed by @JayToe


Development
-----------

To get started just pull the repo and run the following

```bash
npm install
npm run build
npm start
```

To build the installers / release packages you need to run, you can only build a platforms installer from that platform.
```bash
# Windows
npm run make:win

# Mac OS X
npm run make:darwin

# Ubuntu (Requires the 'dpkg' package)
npm run make:deb

# Fedora (Requires the 'rpm' package)
npm run make:rpm
```

All releases will be signing with my Code Signing Certificates (Authenticode on Windows and Codesign on OS X)

Please see the [development FAQ](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/wiki/Development-FAQ) for additional requirements for building.

Contributing
------------

If you find something wrong (theming issues, app crashes) please report them as an issue.  
If you think you can add something cool or fix a problem, fork the repo and make a pull request :D

**NOTE:** Some of the functionality in this app has been extracted into smaller submodules. In particular
* Google Play Music Interaction - https://github.com/gmusic-utils/gmusic.js
* Theming - https://github.com/gmusic-utils/gmusic-theme.js
* Mini Player - https://github.com/GPMDP/gmusic-mini-player.js
* Electron Chromecast - https://github.com/GPMDP/electron-chromecast

Dev Requirements
----------------
* Node.js (Recommend `6.3.x`)
* NPM (3.x.x)

Continuous Integration
------------------------

We run tests and generate signed installers on three CI platforms
* Windows --> [AppVeyor][2]
* Linux & OS X --> [Circle CI][3]

You can download the latest signed installers for Windows from the artifacts section of AppVeyor  
You can download the latest linux (debian and fedora) and OS X (darwin) builds from the artifacts section on Circle CI

[2]: https://ci.appveyor.com/project/MarshallOfSound/google-play-music-desktop-player-unofficial
[3]: https://circleci.com/gh/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-

License
-------

The MIT License (MIT)

Copyright (c) 2016 Samuel Attard

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
