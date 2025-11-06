// app.js
// [INSTRUCTION_B]
// This file will act as your "Product Service".
// It MUST run on the port you defined in your gateway's route-config.js
// [INSTRUCTION_E]
const express = require('express');
const app = express();
const PORT = 3002; // <-- Port của Product Service

/**
 * A test endpoint to verify proxy headers.
 * It reads the custom headers (X-User-Id, etc.) that the
 * API Gateway is supposed to add.
 */
app.get('/', (req, res) => {

    // [INSTRUCTION_B]
    // IMPORTANT: Node.js and Express automatically convert
    // all incoming header keys to lowercase.
    // So 'X-User-Id' becomes 'x-user-id'.
    // [INSTRUCTION_E]

    // 1. Get the custom headers sent by the Gateway
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    const accountType = req.headers['x-account-type'];

    // 2. Get a standard header to prove proxying worked
    const userAgent = req.headers['user-agent'];

    // Construct the JSON payload
    const payload = {
        message: "Product Service đã nhận được request!",
        headers_from_gateway: {
            // [INSTRUCTION_B]
            // We use '|| null' to gracefully handle cases
            // where the header might be missing (e.g., a public route).
            // [INSTRUCTION_E]
            'x-user-id': userId || null,
            'x-user-role': userRole || null,
            'x-account-type': accountType || null
        },
        other_headers: {
            'user-agent': userAgent
        }
    };

    res.json(payload);
});

// Start the Product Service
app.listen(PORT, () => {
    console.log(`(Mock) Product Service đang chạy trên http://localhost:${PORT}`);
    console.log(`Sẵn sàng nhận request tại http://localhost:${PORT}/test-proxy`);
});