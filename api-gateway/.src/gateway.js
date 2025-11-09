// gateway.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
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


const defaultProxyOptions = {
    changeOrigin: true,
    onProxyReq: attachUserHeaders,
};
app.get("/lmao", (req, res) => {
    const lmao = process.env.JWT_SECRET;
    console.log(lmao);
    res.send(lmao);
})

routes.forEach(route => {

    const combinedOptions = {
        ...defaultProxyOptions,
        ...route.proxyConfig
    };

    app.use(route.prefix, createProxyMiddleware(combinedOptions));
});

app.listen(PORT, () => {
    console.log(`API Gateway started on http://localhost:${PORT}`);
    console.log('Registered routes:');
    routes.forEach(route => {
        console.log(`- ${route.prefix} -> ${route.proxyConfig.target}`);
    });
});