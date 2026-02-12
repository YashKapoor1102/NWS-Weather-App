/**
 * Middleware for handling unknown routes.
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * 
 * @returns {void}
 */
export function notFound(req, res) {
    res.status(404).json({
        error: true,
        message: `Route not found: ${req.method} ${req.originalUrl}`
    });
}
