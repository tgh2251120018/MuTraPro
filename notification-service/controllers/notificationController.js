const Notification = require('../models/Notification');

exports.getHistory = async (req, res) => {
    try {
        // Giả sử lấy user_id từ token (ở đây hardcode để test)
        const user_id = req.query.user_id || "user-uuid-sample"; 
        const notifications = await Notification.find({ user_id }).sort({ created_at: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// API để test tạo thông báo thủ công
exports.createTestNotification = async (req, res) => {
    const { user_id, title, message, type } = req.body;
    const newNoti = new Notification({ user_id, title, message, type });
    await newNoti.save();
    
    // Trigger socket global (được truyền từ server.js qua req nếu cần, hoặc xử lý simple)
    const io = req.app.get('socketio');
    io.emit('receive_notification', newNoti);

    res.json(newNoti);
};