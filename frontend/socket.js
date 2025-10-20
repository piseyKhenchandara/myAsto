import { io } from "socket.io-client";

export const socket = io('/', {
    autoConnect : true,
    reconnection : true,
    withCredentials : true
})