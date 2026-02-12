import axios from "axios";
import { config } from "../config/config.js";

const NWS_BASE_URL = "https://api.weather.gov";

// configure axios client for NWS API requests.
const client = axios.create({
    timeout: 10000,
    headers: {
        "User-Agent": config.NWS_USER_AGENT,
        Accept: "application/geo+json, application/json" 
    }
});

/**
 * Fetches weather forecast data from the National Weather Service (NWS) API
 * for the given latitude and longitude.
 * 
 * @param {{ lat: number, lon: number }} params     - The latitude and longitude for the city
 * 
 * @returns {Promise<{ updated: string | undefined, periods: any[] }}   - Returns the last updated timestamp and an array of forecast periods
 * @throws {Error & { statusCode?: number }}   - When the NWS response is invalid
 */
export async function fetchForecast({ lat, lon }) {
    const pointsUrl = `${NWS_BASE_URL}/points/${lat},${lon}`;
    const pointsResp = await client.get(pointsUrl);

    const forecastUrl = pointsResp?.data?.properties?.forecast;
    if (!forecastUrl) {
        const err = new Error("NWS did not provide a forecast URL for this location.");
        err.statusCode = 502;
        throw err;
    }

    const forecastResp = await client.get(forecastUrl);
    const periods = forecastResp?.data?.properties?.periods || [];

    if (!periods.length) {
        const err = new Error("NWS did not return forecast periods.");
        err.statusCode = 502;
        throw err;
    }

    return {
        updated: forecastResp?.data?.properties?.updateTime,
        periods
    };
}

