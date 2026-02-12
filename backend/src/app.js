import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import { config } from "./config/config.js";
import { notFound } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { weatherRoutes } from "./routes/weatherRoutes.js";

/**
 * Creates and configures the application instance.
 */
export function createApp() {
    const app = express();

    app.use(helmet());
    app.use(cors({ origin: config.CORS_ORIGIN }));
    app.use(express.json());
    app.use(morgan("dev"));

    app.get("/health", (_req, res) => {
        res.json({ ok: true, service: "nws-weather-backend" });
    });

    app.use("/api/weather", weatherRoutes);
    app.use(notFound);
    app.use(errorHandler);

    return app;
}
