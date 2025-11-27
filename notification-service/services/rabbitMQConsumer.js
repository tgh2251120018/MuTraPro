// Giả lập kết nối RabbitMQ để nhận event
const amqp = require('amqplib');
const Notification = require('../models/Notification');

const connectRabbitMQ = async (io) => {
    try {
        // Code kết nối thực tế (đang comment để bạn chạy local không cần cài RabbitMQ vẫn không lỗi app)
        /*
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        const queue = 'notification_events';
        
        await channel.assertQueue(queue, { durable: false });
        console.log("Waiting for messages in %s", queue);

        channel.consume(queue, async (msg) => {
            const eventData = JSON.parse(msg.content.toString());
            // Xử lý lưu db và bắn socket
            await processNotification(eventData, io);
        }, { noAck: true });
        */
       console.log("RabbitMQ Service initialized (Mock Mode)");
    } catch (error) {
        console.error("RabbitMQ Connection Error:", error);
    }
};

const processNotification = async (data, io) => {
    // 1. Lưu vào DB
    const newNoti = new Notification({
        user_id: data.user_id,
        title: data.title,
        message: data.message,
        type: data.type || 'INFO'
    });
    await newNoti.save();

    // 2. Bắn Real-time qua Socket.io
    io.emit('receive_notification', newNoti);
    console.log("Real-time notification sent via Socket.io");
};

module.exports = { connectRabbitMQ, processNotification };