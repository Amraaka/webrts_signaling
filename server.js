const http = require("http");
const WebSocket = require("ws");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>WebRTC Signaling Server</title>
    </head>
    <body>
      <h1>WebRTC Signaling Server</h1>
      <p>WebSocket server is running on ws://localhost:3000</p>
      <p>Connect using a WebSocket client to use the signaling server.</p>
    </body>
    </html>
  `);
});

const wss = new WebSocket.Server({ server });
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

server.listen(3000, () => {
  console.log("Signaling server running on http://localhost:3000");
  console.log("WebSocket endpoint: ws://localhost:3000");
});
