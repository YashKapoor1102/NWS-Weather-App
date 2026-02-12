import { config } from "../config/config.js";
import { cityRepository } from "../repositories/cityRespository.js";
import { SimpleCache } from "../utils/SimpleCache.js";
import { fetchForecast } from "./nwsService.js";

const cache = new SimpleCache({ ttlMs: config.CACHE_TTL_SECONDS * 1000 });

/**
 * Transforms NWS forecast data into a simplified,
 * frontend user-friendly weather object for a specific city.
 * 
 * This trims the external API response down to only what we need.
 * 
 * @param {Object} data     - forecast data from NWS
 * @param {Object} city     - City metadata (id, name, lat, lon)
 * @returns {Object}    - Simplified weather object
 */
function mapForecast(data, city) {
    const periods = (data.periods || []).map((p) => ({
        name: p.name,
        startTime: p.startTime,
        endTime: p.endTime,
        isDaytime: p.isDaytime,
        temperature: p.temperature,
        temperatureUnit: p.temperatureUnit,
        windSpeed: p.windSpeed,
        windDirection: p.windDirection,
        shortForecast: p.shortForecast,
        detailedForecast: p.detailedForecast,
        icon: p.icon
    }));

    const current = periods[0] || null;

    return {
        city: city.name,
        location: { lat: city.lat, lon: city.lon },
        updated: data.updated,
        current,
        periods
    };
}

/**
 * Returns all configured cities.
 * @returns {City[]}   
 */
export function listCities() {
    return cityRepository.getAll();
}

/**
 * 
 * Retrieves weather for one specific city or all cities.
 * 
 * @param {Object} [options]            - Optional configuration object
 * @param {string} [options.cityId]     - Optional city identifier
 * @returns {Promise<Object>}     - Weather response payload
 */
export async function getWeather({ cityId } = {}) {
    const cities = cityRepository.getAll();
    const selected = cityId ? cities.filter((c) => c.id === cityId) : cities;

    if (cityId && selected.length === 0) {
        const err = new Error("Unknown city id");
        err.statusCode = 404;
        throw err;
    }

    const results = await Promise.all(
        selected.map(async (city) => {
            const cacheKey = `forecast:${city.id}`;

            const cached = cache.get(cacheKey);
            if (cached) {
                return { ...cached, cached: true };
            }

            const data = await fetchForecast({ lat: city.lat, lon: city.lon });
            
            const dto = mapForecast(data, city);

            cache.set(cacheKey, dto);
            
            return { ...dto, cached: false };
        })
    );

    return {
        count: results.length,
        ttlSeconds: config.CACHE_TTL_SECONDS,
        data: results
    };
}
