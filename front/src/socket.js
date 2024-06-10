import { io } from 'socket.io-client';

const URL = 'https://poc-fighter-navigator-jekm-back-iwota6nda.vercel.app/';

export const socket = io(URL);