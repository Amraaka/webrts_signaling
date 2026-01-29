const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 3000 });
let peers = [];

wss.on("connection", ws => {
  peers.push(ws);

  ws.on("message", msg => {
    peers.forEach(p => {
      if (p !== ws && p.readyState === WebSocket.OPEN) {
        p.send(msg.toString());
      }
    });
  });

  ws.on("close", () => {
    peers = peers.filter(p => p !== ws);
  });
});

console.log("Signaling server running on ws://localhost:3000");
