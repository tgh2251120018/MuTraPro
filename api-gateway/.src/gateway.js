// gateway.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const routes = require('./route-config');
const authMiddleware = require('./authMiddleware');
const { proxyHeaderMiddleware } = require('./proxy-helper');

const app = express();
const PORT = 8000;

app.use(authMiddleware);


app.use((req, res, next) => {
    console.log(`[DEBUG TRACER]: Path đã qua auth: ${req.method} ${req.path}`);
    if (req.user) {
        console.log(`[DEBUG TRACER]: User ID: ${req.user.id}`);
    }
    next();
});


app.get("/lmao", (req, res) => {
    const lmao = process.env.JWT_SECRET;
    console.log(lmao);
    res.send(lmao);
});


routes.forEach(route => {

    const combinedOptions = {
        changeOrigin: true,
        ...route.proxyConfig
    };

    app.use(
        route.prefix,
        proxyHeaderMiddleware,
        createProxyMiddleware(combinedOptions)
    );
});

app.listen(PORT, () => {
    console.log(`API Gateway started on http://localhost:${PORT}`);
    console.log('Registered routes:');
    routes.forEach(route => {
        console.log(`- ${route.prefix} -> ${route.proxyConfig.target}`);
    });
});