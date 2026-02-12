
/**
 * Wraps an async Express route handler and forwards errors to next().
 * Used to prevent repetitive try/catch blocks in controllers.
 * 
 * @param {(req: import("express").Request,
 *          res: import("express").Response,
 *          next: import("express").NextFunction) => Promise<any>} fn 
 * 
 * @returns {(req: import("express").Request,
 *          res: import("express").Response,
 *          next: import("express").NextFunction) => void} 
 */
export function asyncHandler(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
}
