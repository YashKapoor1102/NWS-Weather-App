import dotenv from "dotenv";
dotenv.config();

/**
 * Application runtime configuration.
 * Values are loaded from environment variables and
 * exposed as a single configuration object for the 
 * rest of the app.
 * 
 * @type {{ PORT: number, CORS_ORIGIN: string, NWS_USER_AGENT: string }}
 */
export const config = {
    PORT: Number(process.env.PORT),
    CORS_ORIGIN: process.env.CORS_ORIGIN,
    NWS_USER_AGENT: process.env.NWS_USER_AGENT,
}
