const http = require('http');
const express = require('express');

const setup = async () => {
  const geckos = await import('@geckos.io/server');
  const app = express();
  const server = http.createServer(app);
  const io = geckos.geckos();

  io.addServer(server);

  let players = {};

  io.onConnection((channel) => {
    console.log(`Player connected: ${channel.id}`);

    players[channel.id] = { x: 10, y: 10 };

    channel.emit('playersUpdate', players);

    channel.on('playerMove', (data) => {
      if (players[channel.id]) {
        players[channel.id] = data;
        io.emit('playersUpdate', players);
      }
    });

    channel.on('ping', (data) => {
      channel.emit('pong', data);
    });

    channel.onDisconnect(() => {
      delete players[channel.id];
      io.emit('playersUpdate', players);
      console.log(`Player disconnected: ${channel.id}`);
    });
  });

  app.get('/', (req, res) => {
    res.send(geckos.toString() ?? 'Hello, world!');
  });

  server.listen(3000, () => {
    console.log('Server is listening on port 3000');
  });
};

setup();