// proxy-helper.js

const attachUserHeaders = (proxyReq, req, res) => {

    console.log(`\n--- [PROXY HELPER]: Đã được gọi cho path: ${req.path} ---`);

    if (req.user) {
        console.log(`[PROXY HELPER]: ĐÃ TÌM THẤY req.user (ID: ${req.user.id}). Đang gắn headers...`);

        proxyReq.setHeader('X-User-Id', req.user.id);
        proxyReq.setHeader('X-User-Role', req.user.role);
        proxyReq.setHeader('X-Account-Type', req.user.accountType);
    } else {
        console.warn(`[PROXY HELPER]: CẢNH BÁO: Không tìm thấy 'req.user'.`);
    }
    console.log(`[PROXY HELPER]: Đang xóa header 'authorization'.`);
    proxyReq.removeHeader('authorization');
    console.log('[PROXY HELPER]: Headers SẮP GỬI ĐI (sau khi sửa đổi):', proxyReq.getHeaders());
};

module.exports = {
    attachUserHeaders
};