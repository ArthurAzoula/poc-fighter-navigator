const setup = async () => {
  const geckos = await import('@geckos.io/server');
  const io = geckos.geckos();

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
      channel.broadcast.emit('pong', data);
    });

    channel.onDisconnect(() => {
      delete players[channel.id];
      io.emit('playersUpdate', players);
      console.log(`Player disconnected: ${channel.id}`);
    });
  });
  
  io.listen(3000)
};

setup();