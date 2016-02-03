# Nucleus-Player

[![Join the chat at https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Github All Releases](https://img.shields.io/github/downloads/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/total.svg)](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/releases)
 [![GitHub version](https://badge.fury.io/gh/MarshallOfSound%2FGoogle-Play-Music-Desktop-Player-UNOFFICIAL-.svg)](https://badge.fury.io/gh/MarshallOfSound%2FGoogle-Play-Music-Desktop-Player-UNOFFICIAL-)  [![Code Climate](https://codeclimate.com/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/badges/gpa.svg)](https://codeclimate.com/github/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-) <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=23CZGASL6XMLJ" title="Help me out by donating to this project"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a>  
 Windows: [![Build status](https://ci.appveyor.com/api/projects/status/clg5vclqyltff7hg/branch/master?svg=true)](https://ci.appveyor.com/project/MarshallOfSound/google-play-music-desktop-player-unofficial/branch/master)  
 Max OSX: [![Build Status](https://travis-ci.org/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-.svg?branch=dev/3.0.0)](https://travis-ci.org/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-)


A beautiful cross platform Desktop Player for Google Play Music

## WARNING

This repository is not usable in it's current state, it is currently in rapid
development and therefore I can not guarantee the stability of master, force
pushes may occur and breaking changes may happen all the time.  Stay on your
toes :)

## FAQ

### So what is this???

This project is designed to close the gap between the existing Desktop Player
options for Google Play Music.  At the moment they are fragments, different,
support a plethora of different features and are extremely prone to bugs.  This
repo is designed to be as low maintenance and as cross-platform as possible.

### What OS's do you support?

All the major ones, we have automatic CI running for [Mac OSX (Travis CI)][1]
and [Windows (Appveyor)][2].  The application can also be built for Linux
platforms but we do
not currently have CI set up targeting those platforms.

[1]: https://travis-ci.org/MarshallOfSound/Nucleus-Player
[2]: https://ci.appveyor.com/project/MarshallOfSound/nucleus-player

### When will this hit a proper release target?

There is currently an [issue][3] that outlines the tasks left to complete before
a minimum first release can be reached.

[3]: https://github.com/MarshallOfSound/Nucleus-Player/issues/1

### How can I get involved?

Fork the repo, take a look at the issue mentioned above and tackle one of the
release criteria. When you get it working, write some epic tests and PR it in
to the main repo.

## Development Guide

### Getting Started

So to get started we need to clone the repo and install all the dependencies

```bash
git clone https://github.com/[Your Username Here]/Nucleus-Player.git
npm install
```

From there to run the app for development you simply run in two separate
terminals.

```bash
npm run watch
```

**AND**

```bash
npm start
```

The first command runs an initial build of the source code and then starts a
watch task to rebuild it on change.  The second command starts the app.
