Google Play Music™ Desktop Player
=========================

[![Join the chat at https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Github All Releases](https://img.shields.io/github/downloads/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/total.svg)]()
[![Build status](https://ci.appveyor.com/api/projects/status/clg5vclqyltff7hg/branch/master?svg=true)](https://ci.appveyor.com/project/MarshallOfSound/google-play-music-desktop-player-unofficial/branch/master)
 [![GitHub version](https://badge.fury.io/gh/MarshallOfSound%2FGoogle-Play-Music-Desktop-Player-UNOFFICIAL-.svg)](https://badge.fury.io/gh/MarshallOfSound%2FGoogle-Play-Music-Desktop-Player-UNOFFICIAL-) [![Code Climate](https://codeclimate.com/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/badges/gpa.svg)](https://codeclimate.com/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-) <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=23CZGASL6XMLJ" title="Help me out by donating to this project"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a>  

![](https://www.samuel.ninja/img/gpmdp_screen.gif)

Run Google Play Music as a stand alone Windows Desktop app.  Never again will you have to hunt through your tabs to pause your music, or stop listening to your favourite song because Chrome is guzzling up all your RAM..

Developed by [Samuel Attard][1].

No affiliation with Google. Google Play is a trademark of Google Inc.

[1]: https://www.samuelattard.com

Requirements
------------

* Windows Vista or later (Might work on XP, I've never tried)
* [Adobe Flash Player][2]
* [WiX v3.10.1][3]

Using Flash Player is not my choice and this app is in no way based on flash.  However flash is required to play the music because Google's support for HTML5 Audio relies on the MP3 codec and some third party DRM library.  Both of which require licenses and can't be open sourced.  So until Google figures out an open source solution to the DRM media problem, we are stuck with Flash.

[2]: http://get.adobe.com/flashplayer/
[3]: https://wix.codeplex.com/releases/view/618180

Features
--------

* Supports media keys (play, pause, next, previous)
* [last.fm](https://www.last.fm) scrobbling and now playing support!
* Desktop notifications on track change
* A simplistic mini player
* Dark theme
* Task bar media controls (media controls embedded into the taskbar)
* Smooth scrolling and overlay scrollbars for a nicer User Experience
* More coming soon....

Development
-----------

To get started just pull the repo and open `Google Play Music.sln` in Visual Studio, pull down all the NuGet dependencies and it should just work.

Contributing
------------

If you find something wrong (theming issues, app crashes) please report them as an issue.  
If you think you can add something cool or fix a problem, fork the repo and make a pull request :D

Credit
-----------

IgnaceMaes for the Material Skin used in this project --> [Check it out here](https://github.com/IgnaceMaes/MaterialSkin)

License
-------

The MIT License (MIT)

Copyright (c) 2015 Samuel Attard

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
