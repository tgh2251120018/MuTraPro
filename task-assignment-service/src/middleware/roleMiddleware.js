export function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== "administrator") {
        return res.status(403).json({
            message: "Forbidden: Admin role required."
        });
    }
    next();
}
