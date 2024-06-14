import { useEffect, useState, useRef } from 'react';
import { Stage, Sprite, Text } from '@pixi/react';
import geckos from '@geckos.io/client';
import './App.css';

const App = () => {
    const [ping, setPing] = useState(-1);
    const [player, setPlayer] = useState({ x: 10, y: 10 });
    console.log('player:', player);
    const [otherPlayers, setOtherPlayers] = useState({});
    console.log('otherPlayers:', Object.keys(otherPlayers).length);
    const playerId = useRef(null);
    const channelRef = useRef(null);

    useEffect(() => {
        const channel = geckos({port: 3000, url: 'https://api.raptor-fight.bryan-ferrando.fr' });
        channelRef.current = channel;

        channel.onConnect(error => {
            if (error) {
                console.error(error.message);
                return;
            }
            console.log('Connected to the server');
        
        });
        
        channel.on('pong', data => {
            setPing(new Date() - new Date(data));
        });

        channel.on('playersUpdate', data => {
            setOtherPlayers(data);
        });

        const handleKeyDown = (e) => {
            setPlayer(p => {
                if (e.key === 'ArrowUp') p.y -= 5;
                if (e.key === 'ArrowDown') p.y += 5;
                if (e.key === 'ArrowLeft') p.x -= 5;
                if (e.key === 'ArrowRight') p.x += 5;
                
                channel.emit('playerMove', p);
                return p;
            });
        };
        
        const interval = setInterval(() => {
            channel.emit('ping', new Date());
        }, 1000);

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="App" tabIndex="0">
            <Stage width={800} height={600} options={{ backgroundColor: 0x10bb99 }}>
                {Object.keys(otherPlayers).map((id) => (
                    <Sprite
                        key={id}
                        image="https://pixijs.io/pixi-react/img/bunny.png"
                        x={otherPlayers[id].x}
                        y={otherPlayers[id].y}
                    />
                ))}
                <Text
                    text={`Ping: ${ping} ms`}
                    x={10}
                    y={10}
                    style={{ fill: 'white', fontSize: 20 }}
                />
            </Stage>
        </div>
    );
};

export default App;
