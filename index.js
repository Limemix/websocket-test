const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let messages = [];

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.send(JSON.stringify({ type: 'history', payload: messages }));

  ws.on('message', (data) => {
    const parsed = JSON.parse(data);
    console.log("New Message")
    if (parsed.type === 'message') {
        const { text, name, color } = parsed.payload;
      
        const msg = {
          id: Date.now(),
          text,
          name,
          color,
        };
      
        messages.push(msg);
      
        // розсилка всім клієнтам
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type: 'message', payload: msg }));
          }
        });
      }
      
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3001, () => {
  console.log('Server running on http://localhost:3001');
});
