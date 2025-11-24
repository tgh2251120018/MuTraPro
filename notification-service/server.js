const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
const { connectRabbitMQ } = require('./services/rabbitMQConsumer');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

// Cấu hình CORS để frontend React gọi được
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// Inject io vào app để dùng trong controller
app.set('socketio', io);

// Routes
app.use('/api/notifications', notificationRoutes);

// Socket.io Connection
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Khởi động RabbitMQ Consumer
connectRabbitMQ(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));