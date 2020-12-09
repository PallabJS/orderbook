import socketIOClient from 'socket.io-client';

const serverAddress = "https://orderbook-pj.herokuapp.com/";

export const socket = socketIOClient(serverAddress);
