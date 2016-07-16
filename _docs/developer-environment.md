---
layout: docs
title:  "Setting Up a Developer Environment"
target: "Dev"
index: 1
---

<style>
.dev ul li {
  list-style-type: disc;
}
</style>

##### All Platforms

* Node.js: `6.2.X`  
* NPM: `3.X.X`

##### Platform Specific

__Windows__  

* C++ Compilers (Easiest way to get these working is to install [Visual C++ Build Tools](http://landinghub.visualstudio.com/visual-cpp-build-tools)  
* [Python 2.7](https://www.python.org/downloads/release/python-2710/)  
* [Bonjour SDK for Windows](https://developer.apple.com/bonjour/)  

You can easily set up the dependencies on windows by running [this powershell script](https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-/blob/master/vendor/setup_window.ps1).

__OS X__  
* [NVM](https://github.com/creationix/nvm) *Not a requirement per se but it is very useful for getting `node`*  

__Linux__  

**NOTE:** *Lots come standard and these are the dependency names for Ubuntu*

* g++-multilib
* lib32z1
* lib32ncurses5
* lib32bz2-1.0
* rpm
* fakeroot
* dpkg
* libdbus-1-dev
* libx11-dev
* g++
* libavahi-compat-libdnssd-dev
* gcc-4.8-multilib
* g++-4.8-multilib
* libnotify4

Or for lazy people  

```bash
sudo apt-get install g++-multilib lib32z1 lib32ncurses5 lib32bz2-1.0 rpm fakeroot dpkg libdbus-1-dev libx11-dev g++ libavahi-compat-libdnssd-dev gcc-4.8-multilib g++-4.8-multilib libnotify4
```

## Getting the project running
```bash
git clone https://github.com/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-.git gpmdp
cd gpmdp
npm install
npm run build
npm start
```

That sequence of commands should get the app running.  If they don't head over to [Gitter](https://gitter.im/MarshallOfSound/Google-Play-Music-Desktop-Player-UNOFFICIAL-) and someone will try to help you out.

## Easy development process

We have a `watch` task that will constantly recompile certain parts of the app as you change the files.  To get this going you will need 2 command prompts / terminal windows.  

**Terminal 1**
```bash
npm run watch
```

**Terminal 2**
```bash
npm start
```

Then change whatever files you want and restart `npm start` in Terminal 2 whenever you want to see your changes
