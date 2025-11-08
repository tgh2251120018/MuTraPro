// gateway.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// [INSTRUCTION_B]
// Import all configurations and helper functions
// [INSTRUCTION_E]
const routes = require('./route-config');
const authMiddleware = require('./authMiddleware');
const { attachUserHeaders } = require('./proxy-helper');

const app = express();
const PORT = 8000;

// 1. Apply global authentication middleware
app.use(authMiddleware);
app.use((req, res, next) => {
    console.log(`[DEBUG TRACER]: Path đã qua auth: ${req.method} ${req.path}`);
    next();
});

// [INSTRUCTION_B]
// Define default options that will be applied to EVERY proxy.
// [INSTRUCTION_E]
const defaultProxyOptions = {
    changeOrigin: true,      // Essential for virtual hosted sites & CORS
    onProxyReq: attachUserHeaders, // Our reusable function to add user headers
};
app.get("/lmao", (req, res) => {
    const lmao = process.env.JWT_SECRET;
    console.log(lmao);
    res.send(lmao);
})
// 2. Dynamically create all proxies from the config file
routes.forEach(route => {

    // [INSTRUCTION_B]
    // Combine the default options with the specific route options.
    // The route-specific config (like target, pathRewrite)
    // will be merged with the defaults.
    // [INSTRUCTION_E]
    const combinedOptions = {
        ...defaultProxyOptions, // Apply defaults first
        ...route.proxyConfig    // Apply route-specific config (target, pathRewrite)
    };

    // Apply the proxy middleware for this prefix
    app.use(route.prefix, createProxyMiddleware(combinedOptions));
});

// 3. Start the server
app.listen(PORT, () => {
    console.log(`API Gateway started on http://localhost:${PORT}`);
    console.log('Registered routes:');
    routes.forEach(route => {
        console.log(`- ${route.prefix} -> ${route.proxyConfig.target}`);
    });
});