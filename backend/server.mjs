import express from 'express';
import http from 'http';
import { geckos, iceServers } from '@geckos.io/server';
console.log('geckos:', geckos);
console.log('iceServers:', iceServers);

const app = express();
const server = http.createServer(app);
const io = geckos({iceServers: iceServers});

io.addServer(server);

io.onConnection((channel) => {
  console.log(`New player connected: ${channel.id}`);

  channel.onDisconnect(() => {
    console.log(`Player disconnected: ${channel.id}`);
  });

  channel.on('move', (data) => {
    console.log(`Player ${channel.id} moved to ${data}`);
    channel.broadcast.emit('playerMoved', { id: channel.id, position: data });
  });
  
  channel.on('ping', (data) => {
    channel.emit('pong', { sentAt: data.sentAt });
  });
});

server.listen(3000, () => {
  console.log('Server is running on port 3000');
});
