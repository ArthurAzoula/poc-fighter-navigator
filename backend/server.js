const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('message', (msg, rinfo) => {
    console.log(`Message from ${rinfo.address}:${rinfo.port} - ${msg}`);
    if (msg.toString() === 'ping') {
        server.send('pong', rinfo.port, rinfo.address, (err) => {
            if (err) {
                console.error('Erreur lors de l\'envoi du pong :', err);
            }
        });
    }
});

server.bind(12345);