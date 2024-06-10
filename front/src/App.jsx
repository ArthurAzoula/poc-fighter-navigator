// src/App.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Stage, Sprite, Text } from '@pixi/react';
import io from 'socket.io-client';
import './App.css';

const socket = io('http://localhost:3000');

const App = () => {
    const [player, setPlayer] = useState({ id: socket.id, x: 100, y: 100 });
    const [otherPlayers, setOtherPlayers] = useState([]);
    const [ping, setPing] = useState(0);
    const pingStartRef = useRef(null);  // Utilisez useRef pour stocker pingStart

    useEffect(() => {
        const handleMove = (data) => {
            setOtherPlayers((currentPlayers) => {
                const updatedPlayers = currentPlayers.filter(p => p.id !== data.id);
                return [...updatedPlayers, data];
            });
        };

        const handlePong = () => {
            const latency = Date.now() - pingStartRef.current;
            setPing(latency);
        };

        socket.on('move', handleMove);
        socket.on('pong', handlePong);

        return () => {
            socket.off('move', handleMove);
            socket.off('pong', handlePong);
        };
    }, []);

    const handleKeyDown = (event) => {
        const newPlayer = { ...player };

        switch (event.key) {
            case 'ArrowUp':
                newPlayer.y -= 5;
                break;
            case 'ArrowDown':
                newPlayer.y += 5;
                break;
            case 'ArrowLeft':
                newPlayer.x -= 5;
                break;
            case 'ArrowRight':
                newPlayer.x += 5;
                break;
            default:
                break;
        }

        setPlayer(newPlayer);
        socket.emit('move', newPlayer);
    };

    const pingServer = useCallback(() => {
        pingStartRef.current = Date.now();
        socket.emit('ping');
    }, []);

    useEffect(() => {
        const interval = setInterval(pingServer, 1000); // Ping every second
        return () => clearInterval(interval);
    }, [pingServer]);

    return (
        <div className="App" onKeyDown={handleKeyDown} tabIndex="0">
            <Stage width={800} height={600} options={{ backgroundColor: 0x10bb99 }}>
                <Sprite image="https://pixijs.io/pixi-react/img/bunny.png" x={player.x} y={player.y} />
                {otherPlayers.map((p) => (
                    <Sprite key={p.id} image="https://pixijs.io/pixi-react/img/bunny.png" x={p.x} y={p.y} />
                ))}
                <Text text={`Ping: ${ping} ms`} x={10} y={10} style={{ fill: 'white', fontSize: 20 }} />
            </Stage>
        </div>
    );
};

export default App;
