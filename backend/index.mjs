import geckos, { iceServers } from '@geckos.io/server';
import http from 'http';
import express from 'express';

const port = 3000;
const app = express();
const server = http.createServer(app);
const io = geckos({
  iceServers: process.env.NODE_ENV === 'production' ? iceServers : [],
  portRange: {
    min: process.env.PORT_RANGE_MIN
      ? parseInt(process.env.PORT_RANGE_MIN)
      : 10000,
    max: process.env.PORT_RANGE_MAX
      ? parseInt(process.env.PORT_RANGE_MAX)
      : 10007,
  },
  cors: { allowAuthorization: true },
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

io.addServer(server);

io.onConnection((channel) => {
  console.log('New connection:', channel.id);
  channel.onDisconnect(() => {
    console.log('Disconnected:', channel.id);
  });

  channel.on('ping', (data) => {
    channel.emit('pong', data);
  });

  channel.on('playerMove', (data) => {
    channel.broadcast('playersUpdate', { [channel.id]: data });
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
