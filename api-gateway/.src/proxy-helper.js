/**
 * An Express middleware that prepares the request for proxying.
 * It injects user information (from req.user) into request headers
 * and removes the original 'authorization' header.
 */
const proxyHeaderMiddleware = (req, res, next) => {

    console.log(`\n--- [PROXY HELPER]: Đã gọi cho path: ${req.path} ---`);

    if (req.user) {
        console.log(`[PROXY HELPER]: ĐÃ TÌM THẤY req.user (ID: ${req.user.id}). Đang gắn headers...`);

        req.headers['X-User-Id'] = req.user.id;
        req.headers['X-User-Role'] = req.user.role;
        req.headers['X-Account-Type'] = req.user.accountType;

        delete req.headers['authorization'];

        console.log('[PROXY HELPER]: Headers SẮP GỬI ĐI (sau khi sửa đổi):', {
            'X-User-Id': req.headers['X-User-Id'],
            'X-User-Role': req.headers['X-User-Role'],
            'X-Account-Type': req.headers['X-Account-Type'],
            'authorization': req.headers['authorization'] // Should be undefined
        });

    } else {
        console.warn(`[PROXY HELPER]: CẢNH BÁO: Không tìm thấy 'req.user' (Đây là bình thường cho public path).`);
    }

    next();
};

module.exports = {
    proxyHeaderMiddleware
};