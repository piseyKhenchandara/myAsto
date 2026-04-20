import { io } from "socket.io-client";

export const socket = io('/', {
    autoConnect : true,
    reconnection : true,
    withCredentials : true
})

socket.on('connect', () => {
    console.log(' Socket CONNECTED:', socket.id);
});

socket.on('disconnect', (reason) => {
    console.log(' Socket DISCONNECTED:', reason);
});

socket.on('connect_error', (error) => {
    console.error(' Socket CONNECTION ERROR:', error.message, error);
});