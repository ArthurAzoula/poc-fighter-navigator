import { useEffect, useState, useRef } from 'react';
import { Stage, Sprite, Text } from '@pixi/react';
import geckos from '@geckos.io/client';
import './App.css';
import { initializeWebRTC, receiveMessage, sendMessage } from './webrtc';

const App = () => {
    const [ping, setPing] = useState(-1);
    const [player, setPlayer] = useState({ x: 10, y: 10 });
    console.log('player:', player);
    const [otherPlayers, setOtherPlayers] = useState({});
    console.log('otherPlayers:', Object.keys(otherPlayers).length);
    const playerId = useRef(null);
    const channelRef = useRef(null);

    useEffect(() => {
        initializeWebRTC().then((peer) => {
            console.log('peer:', peer);
            channelRef.current = peer;
        }).catch((error) => {
            console.error('Erreur lors de l\'initialisation de WebRTC:', error);
        });
    }, []);
    
    useEffect(() => {
        console.log('channelRef:', channelRef.current);
        sendMessage('ping');
        receiveMessage((message) => {
            console.log('Message reçu:', message);
        });
    }, [channelRef]);
    
    // useEffect(() => {        
    //     console.log('Connecting to the server');
    //     const channel = geckos({port: 3000 });
    //     console.log('channel:', channel);
    //     channelRef.current = channel;
        
    //     channel.onConnect(error => {
    //         if (error) {
    //             console.error('error:', error.message);
    //             return;
    //         }
    //         console.log('Connected to the server');
        
    //     });
        
    //     channel.on('pong', data => {
    //         console.log('data:', data);
    //         setPing(new Date() - new Date(data));
    //     });

    //     channel.on('playersUpdate', data => {
    //         setOtherPlayers(data);
    //     });

    //     const handleKeyDown = (e) => {
    //         setPlayer(p => {
    //             console.log('p:', p);
    //             if (e.key === 'ArrowUp') p.y -= 5;
    //             if (e.key === 'ArrowDown') p.y += 5;
    //             if (e.key === 'ArrowLeft') p.x -= 5;
    //             if (e.key === 'ArrowRight') p.x += 5;
                
    //             channel.emit('playerMove', p);
    //             return p;
    //         });
    //     };
        
    //     const interval = setInterval(() => {
    //         channel.emit('ping', new Date());
    //     }, 1000);

    //     window.addEventListener('keydown', handleKeyDown);

    //     return () => {
    //         window.removeEventListener('keydown', handleKeyDown);
    //         clearInterval(interval);
    //     };
    // }, []);

    return (
        <div className="App" tabIndex="0">
            <Stage width={800} height={400} options={{ backgroundColor: 0x10bb99 }}>
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
