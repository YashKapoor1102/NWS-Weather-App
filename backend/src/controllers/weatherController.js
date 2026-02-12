import { listCities, getWeather } from "../services/weatherService.js";

/**
 * Returns the list of supported cities.
 * 
 * @param {import("express").Request} req - The request object
 * @param {import("express").Response} res - The response object 
 * 
 * @returns {void}
 */
export function getCities(req, res) {
    res.json({ cities: listCities() });
}

/**
 * Returns weather data for:
 *      - all cities (when no query parameter is provided)
 *      - a single city (when city query parameter is present)
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * 
 * @returns {Promise<void>}
 */
export async function getWeatherHandler(req, res) {
    const cityId = req.query.city;
    const payload = await getWeather({ cityId });
    res.json(payload);
}
