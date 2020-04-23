const WebSocket = require('ws');
const ip = require('ip');
const uuid = require('uuid');

let serverPort = 8080;
let serverIP = ip.address();

const wss = new WebSocket.Server({ port: serverPort }, () => {
   console.log(`WebSocket Server is running! (URL: ws://${serverIP}:${serverPort})`);
   console.log("Signaling server is now listening on port " + serverPort);
});

wss.sendTo = (ws, data, id) => {
    wss.clients.forEach((client) => {
        console.log(`Current Client ID: ${client.id}, Target Client ID: ${id}`);
        console.log(`Status: ${client.readyState === WebSocket.OPEN}`);
        if (client.id === id && client.readyState === WebSocket.OPEN) {
            console.log(`Sending to client with id ${client.id}`);
            client.send(data);
        }
    });
};

wss.getMatchingClient = (id, pairId) => {
    var matchingClients = [];
    wss.clients.forEach( (client) => {
        console.log("Checking for pairs.");
        console.log(`keys: ${client.id} ? ${id}, pairIds: ${client.pairId} ? ${pairId}`);
        if ((client.id !== id) && (client.pairId === pairId)) {
            console.log("Found pair.");
            matchingClients.push(client);
        }
    });
    return matchingClients;
};

wss.on('connection', (ws, req) => {
    ws.id = uuid.v4();
    ws.offer = false;
    ws.answer = false;
    var id = ws.id;
    var ip = req.connection.remoteAddress;
    console.log(`Client with IP ${ip} connected. Assigned uuid ${id}. Total connected clients: ${wss.clients.size}`);
    ws.onmessage = (message) => {
        console.log(`Received message from ${ws.id}`); // unsure if will work.
        try {
            var jsonObject = JSON.parse(message.data);
            
            if (jsonObject.type === 'login') {
                var pairId = jsonObject.payload;
                console.log(`Logging in with pairId ${pairId}`);
                ws.pairId = pairId;
            } else if (jsonObject.type === 'SessionDescription') {
                var pairId = jsonObject.payload.pairId; 
                if(jsonObject.payload.type === 'offer') {
                    ws.pairId = pairId;
                }
                console.log(`${jsonObject.payload.type} made to pairId ${pairId}`);
                var matchingClients = wss.getMatchingClient(id, pairId);
                matchingClients.forEach( (client) => {
                    if(jsonObject.payload.type === 'offer') {
                        ws.offer = true;
                        client.offer = true;
                    } else if (jsonObject.payload.type === 'answer') {
                        ws.answer = true;
                        client.answer = true;
                    }
                    wss.sendTo(ws, message.data, client.id);
                });   
            } else if (jsonObject.type === 'IceCandidate') {
                var pairId = jsonObject.payload.pairId
                console.log(`Received IceCandidate for pairId ${pairId}`);
                if(ws.answer && ws.offer) {
                    var matchingClients = wss.getMatchingClient(id, pairId);
                    matchingClients.forEach( (client) => {
                        wss.sendTo(ws, message.data, client.id);
                    });
                }
            }
        } catch (e) {
            console.log("Error encountered");
            console.log(e);
        }
    }

    ws.onclose = () => {
        // need to remove from list don't forget
        console.log(`Client with IP ${req.connection.remoteAddress} disconnected. Total connected clients: ${wss.clients.size}`)
    }
});

