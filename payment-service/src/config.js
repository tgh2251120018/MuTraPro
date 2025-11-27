module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/mutrapro_payment',
  vnpaySecret: process.env.PROVIDER_VNPAY_SECRET || 'change_me',
  notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || ''
};
