// src/App.js
import React, { useEffect, useState, useCallback, useRef } from 'react';
import * as PIXI from 'pixi.js';
import { Stage, Sprite, Text } from '@pixi/react';
import io from 'socket.io-client';
import './App.css';

const socket = io('https://poc-fighter-navigator-back.vercel.app/');

const App = () => {
    const [player, setPlayer] = useState({ id: socket.id, x: 100, y: 100 });
    const [otherPlayers, setOtherPlayers] = useState([]);
    const [ping, setPing] = useState(0);
    const pingStartRef = useRef(null); 
    const playerRef = useRef(player); 
    const otherPlayersRef = useRef([]); 

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

    useEffect(() => {
        playerRef.current = player;
    }, [player]);

    useEffect(() => {
        otherPlayersRef.current = otherPlayers;
    }, [otherPlayers]);

    const handleKeyDown = (event) => {
        const newPlayer = { ...playerRef.current };

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
        const interval = setInterval(pingServer, 1000);
        return () => clearInterval(interval);
    }, [pingServer]);

    const gameLoop = useCallback(() => {
        setPlayer((prevPlayer) => ({ ...prevPlayer }));
        
        requestAnimationFrame(gameLoop);
    }, []);

    useEffect(() => {
        gameLoop();
    }, [gameLoop]);

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
