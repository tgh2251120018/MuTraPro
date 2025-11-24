const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user_id: { 
    type: String, // Liên kết với uuid của user_auth trong ERD
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['INFO', 'WARNING', 'ERROR', 'SUCCESS'], 
    default: 'INFO' 
  },
  channel: {
    type: String,
    enum: ['PUSH', 'EMAIL', 'SMS'],
    default: 'PUSH'
  },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', NotificationSchema);