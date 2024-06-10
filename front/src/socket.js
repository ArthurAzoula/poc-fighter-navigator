import { io } from 'socket.io-client';

const URL = 'https://poc-fighter-navigator-back.vercel.app/';

export const socket = io(URL);