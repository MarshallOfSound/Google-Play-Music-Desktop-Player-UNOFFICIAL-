---
layout: docs
title:  "Installation"
target: "User"
index: 1
---

##### Windows

Click the `Download Latest` button in the top right of the screen.  Choose `Windows` and wait for the Setup file to download.
Once it is downloaded run the file.  A "Installing" animation will appear shortly, the installation process should take a few
seconds but can take up to a minute to complete.  

Once the install is complete GPMDP will automatically launch and ask you to sign in.  It will also create a shortcut for you
to use on your start menu.  When a new update is released a notification will appear inside the app asking you to update.
The update process takes a few seconds and is handled by the app.

##### OS X / macOS

Click the `Download Latest` button in the top right of the screen.  Choose `Mac OS X` and wait for the ZIP file to download.
Once it is downloaded, extract the ZIP file, this can be done by double clicking it.  Once it is extracted copy the application
to your Applications directory and run it.

When a new update is released a notification will appear inside the app asking you to update.  The update process takes a few
seconds and is handled by the app.

##### Debian Linux

Installations and Updates on Debian are handled through the built in package manager `apt`.  All you need to do is add our
code signing key, add our release repository and install the app.  The commands you need to run are listed below.

```bash
wget -qO - https://gpmdp.xyz/bintray-public.key.asc | sudo apt-key add -
echo "deb https://dl.bintray.com/marshallofsound/deb trusty main" | sudo tee -a /etc/apt/sources.list.d/gpmdp.list
sudo apt-get update
sudo apt-get install google-play-music-desktop-player
```

When you want to update the player, simply run `sudo apt-get update && sudo apt-get upgrade`

##### Fedora Linux

Installations and Updates on Fedora are handled manually as we don't currently have a release process.  Simply click the
`Download Latest` button in the top right of the screen.  Choose `Linux` and then choose your distribution type.  A `.rpm`
file will be downloaded.  Install this using the `rpm` command.

When you want to update the player, simply install the newer `.rpm` over the top of the old one.
