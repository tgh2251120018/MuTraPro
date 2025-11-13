/**
 * Middleware to extract user information from custom headers
 * passed by the API Gateway.
 *
 * Attaches a 'user' object to the 'req' object if headers are present.
 */
exports.extractUserInfo = (req, res, next) => {
    const userId = req.headers['x-user-id'];
    const userRole = req.headers['x-user-role'];
    const accountType = req.headers['x-account-type'];

    // The 'x-user-id' header is mandatory for all authenticated requests
    if (!userId) {
        return res.status(401).json({
            message: 'Unauthorized: Missing user identification header.',
        });
    }

    // Attach user info to the request object for use in controllers
    req.user = {
        id: userId,
        role: userRole,
        accountType: accountType,
    };

    // Proceed to the next middleware or controller
    next();
};