import io from 'socket.io-client';
import apiadress from './apiadress';

const socket = io(apiadress);

export default socket;