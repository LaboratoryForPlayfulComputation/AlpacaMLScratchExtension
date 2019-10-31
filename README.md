# AlpacaMLScratchExtension
A custom Scratch 3.0 server with an extension to control sprites with AlpacaML gestures

![AlpacaML Extension screenshot](https://i.ibb.co/P10xpZk/Screen-Shot-2019-10-30-at-3-46-08-PM.png)

## How to use
1. `git clone https://github.com/LaboratoryForPlayfulComputation/AlpacaMLScratchExtension.git`
2. Change the signaling server URL (see "Connecting to the signaling server" below)
3. `cd AlpacaMLScratchExtension/scratch-gui/`
4. `npm install`
5. `npm start --no-inline`
6. Navigate to http://0.0.0.0:8601/ (works best in Chrome)
7. Add the AlpacaML Extension to your Scratch project

## Connecting to the signaling server
The web socket URL of the signaling server is hardcoded in this code base. Once you know your URL, set it in line 16 of `scratch-gui/node_modules/scratch-vm/src/extensions/scratch3_alpacaml/index.js`.

For example:
`this.socket = new WebSocket('ws://10.201.45.10:8080');`

