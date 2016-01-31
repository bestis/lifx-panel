LIFX Panel
===

Standalone Panel implementation for LIFX HTTP API (http://api.developer.lifx.com/docs/introduction).

It isn't complete implementation just a quick PoC with engineer designed UI.

### Online demo
https://jmto.fi/lifx/ or http://jmto.fi/lifx/

### Installation
Run following commands in your web servers root
```
git clone https://github.com/bestis/lifx-panel.git
cd lifx-panel
npm install
node_modules/bower/bin/bower install
```
and then open /lifx-panel from your server.

### Notes
I'm not loving that I had to use npm and bower just to get the colorwheel, but t
his is the state of things. Otherwise it uses Javascript from CDNs.

As it needs network to communicate with LIFX, so it's all the same to use javascript from CDNs.

