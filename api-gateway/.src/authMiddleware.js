require('dotenv').config();
const jwt = require('jsonwebtoken');
const { publicPaths } = require('./security-config');

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * A global middleware to verify JWT tokens.
 * It reads 'publicPaths' from the security config to bypass auth.
 */
const authMiddleware = (req, res, next) => {

    const isPublic = publicPaths.some(path => req.path.startsWith(path));
    if (isPublic) {
        return next();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).send({ error: 'Unauthorized: No token provided.' });
    }

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) {
            return res.status(401).send({ error: 'Unauthorized: Invalid token.' });
        }

        req.user = {
            id: payload.sub,
            accountType: payload.account_type,
            role: payload.role
        };
        console.log(req.user);

        next();
    });
};

module.exports = authMiddleware;