# AlpacaMLScratchExtension
A custom Scratch 3.0 server with an extension to control sprites with AlpacaML gestures

![AlpacaML Extension screenshot](https://i.ibb.co/P10xpZk/Screen-Shot-2019-10-30-at-3-46-08-PM.png)

## How to use

### Set up the signaling server
1. `git clone https://github.com/LaboratoryForPlayfulComputation/AlpacaMLScratchExtension.git`
2. `cd AlpacaMLScratchExtension/signaling/`
3. `npm install`
4. `node app.js`, which starts the signaling server. It prints its URL like shown below:
![Signaling server output](https://i.ibb.co/Qk7tJXR/signaling-Server-Output.png)

You will need that URL soon.

### Set up the Scratch server
1. Download the source code for the Scratch server at: https://drive.google.com/file/d/18_Jm6u0LArYsIBWWuor2HRQBtb4_f6eZ/view?usp=sharing
2. Extract the downloaded file, which gives you a folder called "scratch-gui"
3. _(Optional)_ Configure the AlpacaML extension for your personal signaling server:
   - The WebSocket URL of the signaling server is hardcoded in the extension
   - `this.socket = new WebSocket('ws://scratchpaca.playfulcomputation.group:1230');` will connect to an internet-facing server (assuming it is running), _avoiding the need to run your own signaling server_
   - **Alternatively:** Replace the URL in line 16 of `scratch-gui/node_modules/scratch-vm/src/extensions/scratch3_alpacaml/index.js` with the URL printed by your signaling server
   - For example: `this.socket = new WebSocket('ws://192.168.0.11:8080');`
4. `cd scratch-gui/`
5. `npm install`
6. `npm start --no-inline`
7. Navigate to http://0.0.0.0:8601/ *(works best in Chrome)*
8. Add the AlpacaML Extension to your Scratch project by clicking the "Add Extension" button in the lower left corner

### Set up AlpacaML
The AlpacaML codebase is hosted on GitHub, here: https://github.com/LaboratoryForPlayfulComputation/AlpacaML

1. Open that project in Xcode
2. Configure AlpacaML for your signaling server:
   - The WebSocket URL of the signaling server is hardcoded in the app
   - Replace the URL in line 12 of `LPC Wearable Toolkit/Config.swift` with the URL printed by your signaling server (the same URL you put in the extension earlier)
   - For example: `fileprivate let defaultSignalingServerUrl = URL(string: "ws://192.168.0.11:8080")! //personal server`
3. Run the AlpacaML app

### Connect AlpacaML and Scratch
1. In AlpacaML, tap "Connect to Scratch" 
   - It will show a 4-digit alphanumeric "secret code"
2. In Scratch, type that secret code into the "Connect to AlpacaML" block then click it
3. You will see the message "Hi from Scratch!" which confirms the WebRTC connection has been established
   - You can use the "Send a message" button in AlpacaML to test the connection


