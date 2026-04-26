# IITC Dev URL Loader

Small IITC plugin for mobile/plugin development.

It loads another IITC plugin from a configurable URL, adding a cache-busting timestamp on each IITC load. This makes it easier to test plugins served from a local development machine without reinstalling the target plugin each time.

## Use

Serve your development plugin:

```bash
cd ~/projects/iitc-plugins/driving-route/dist
python3 -m http.server 8000
```

Install this loader plugin in IITC Mobile.

Open IITC, tap Dev URL Loader, and set the plugin URL:

http://YOUR-IP:8000/driving-route.user.js

Then rebuild your plugin and reload IITC:

./build.sh

## Notes
* Phone and dev machine must be on the same network.
* Fedora firewall may need to allow the chosen port.
* Make sure the loaded plugin will be safe to run after IITC startup.
