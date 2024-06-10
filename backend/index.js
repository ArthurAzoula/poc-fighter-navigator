const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require('cors');

// Configuration CORS pour autoriser votre front-end spécifique
app.use(cors({
  origin: "https://poc-fighter-navigator-front.vercel.app"
}));

const io = new Server(server, {
  cors: {
    origin: "https://poc-fighter-navigator-front.vercel.app",
    methods: ["GET", "POST"]
  },
  transports: ['websocket', 'polling'] // WebSocket d'abord, puis fallback vers polling
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

app.get('/test', (req, res) => {
  res.send('<p>test new route</p>');
})

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('move', (data) => {
    console.log('move', data);
    socket.broadcast.emit('move', data);
  });

  socket.on('ping', () => {
    socket.emit('pong');
  });
});

// Utilisation de la variable d'environnement PORT fournie par Vercel
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
