// Service chịu trách nhiệm gửi thông báo ra ngoài (Email, SMS)
const sendEmail = async (to, content) => {
    console.log(`[MOCK EMAIL] Sending to ${to}: ${content}`);
    // Thực tế sẽ dùng nodemailer ở đây
    return true;
};

const sendSMS = async (phone, content) => {
    console.log(`[MOCK SMS] Sending to ${phone}: ${content}`);
    // Thực tế sẽ dùng Twilio/Vibes ở đây
    return true;
};

module.exports = { sendEmail, sendSMS };