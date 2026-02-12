import { createApp } from "./src/app.js";
import { config } from "./src/config/config.js";

const app = createApp();

/**
 * Application entry point - starts the HTTP server.
 */
app.listen(config.PORT, () => {
    console.log(`Backend listening on http://localhost:${config.PORT}`);
});
