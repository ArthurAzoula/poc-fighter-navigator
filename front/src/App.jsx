import { useEffect, useState } from 'react';
import geckos from '@geckos.io/client';

const App = () => {
  const [players, setPlayers] = useState({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [ping, setPing] = useState(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const newChannel = geckos({ port: 3000, iceServers: [
      { urls: 'stun:localhost:3478' },
      {
        urls: 'turn:localhost:3478',
        username: 'turn_username',
        credential: 'turn_password'
      }
    ]});
    console.log('newChannel:', newChannel);
    newChannel.on('error', (error) => {
        console.error('Error:', error);
    });

    newChannel.onConnect(() => {
      console.log('Connected to server');
      setChannel(newChannel);

      newChannel.on('playerMoved', (data) => {
        setPlayers((prevPlayers) => ({
          ...prevPlayers,
          [data.id]: data.position
        }));
      });

      newChannel.on('pong', (data) => {
        const now = Date.now();
        setPing(now - data.sentAt);
      });
    });

    return () => {
      if (channel) {
        channel.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (channel) {
      const sendPing = () => {
        channel.emit('ping', { sentAt: Date.now() });
      };

      const pingInterval = setInterval(sendPing, 1000);

      const handleKeyDown = (e) => {
        let newPosition = { ...position };
        switch (e.key) {
          case 'ArrowUp':
            newPosition.y -= 10;
            break;
          case 'ArrowDown':
            newPosition.y += 10;
            break;
          case 'ArrowLeft':
            newPosition.x -= 10;
            break;
          case 'ArrowRight':
            newPosition.x += 10;
            break;
          default:
            break;
        }
        setPosition(newPosition);
        channel.emit('move', newPosition);
      };

      window.addEventListener('keydown', handleKeyDown);

      return () => {
        clearInterval(pingInterval);
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [channel, position]);

  return (
    <div style={{marginLeft: '100px'}}>
      <h1>Geckos.io Game</h1>
      <div>Ping: {ping ? `${ping} ms` : 'Calculating...'}</div>
      <div style={{ position: 'relative', width: '500px', height: '500px', border: '1px solid black' }}>
        {Object.keys(players).map((id) => (
          <div
            key={id}
            style={{
              position: 'absolute',
              left: `${players[id].x}px`,
              top: `${players[id].y}px`,
              width: '10px',
              height: '10px',
              backgroundColor: 'red'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default App;
