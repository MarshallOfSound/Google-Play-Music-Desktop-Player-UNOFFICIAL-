Installing On Debian (Ubuntu)
----------------------

Installations and Updates on Ubuntu are handled through the built in package
manager `apt`.  All you need to do is add our code signing key, add our release
repository and install the app.  The commands you need to run are listeed below.

```bash
wget -qO - https://gpmdp.xyz/bintray-public.key.asc | sudo apt-key add -
echo "deb https://dl.bintray.com/marshallofsound/deb trusty main" | sudo tee -a /etc/apt/sources.list.d/gpmdp.list
sudo apt-get update
sudo apt-get install google-play-music-desktop-player
```

When you want to update the player, simply run `sudo apt-get update && sudo apt-get upgrade`
