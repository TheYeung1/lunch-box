import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000');

function establishConnection(callback) {
    socket.on('latestFoodMap', foodMap => callback(null, foodMap));
    socket.emit('newConnection');
}

export { establishConnection }