import { Server } from 'socket.io';

const socketConfig = (server) => {
    console.log("Initializing WebSocket server..."); // Debug log

    const io = new Server(server, {
        cors: {
            origin: "*",            // TODO : replace with frontend url
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}`);

        socket.on("sendNotification", (data) => {
            console.log(" New Notification:", data);
            io.emit("receiveNotification", data);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default socketConfig;
