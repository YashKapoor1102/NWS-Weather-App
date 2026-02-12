/**
 * Centralized error-handling middleware.
 * 
 * Logs the error and sends a response.
 * 
 * @param {Error & { statusCode?: number}} err 
 * @param {import("express").Request} _req  
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} _next 
 * 
 * @returns {void}
 */
export function errorHandler(err, _req, res, _next) {
    console.error(err);
    
    const status = err.statusCode || 500;

    res.status(status).json({
        error: true,
        message: err.message || "Internal Server Error"
    });
}
