/**
 * Cities for which weather data can be fetched.
 * 
 * @typedef {{ id: string, name: string, lat: number, lon: number }} City
 */
const cities = [
    { 
        id: "miami", 
        name: "Miami, FL",
        lat: 25.7743,
        lon: -80.1937
    },
    {
        id: "nyc", 
        name: "New York City, NY", 
        lat: 40.7306,
        lon: -73.9352
    },
    {
        id: "chicago", 
        name: "Chicago, IL",
        lat: 41.8818,
        lon: -87.6232
    },
    {
        id: "los-angeles",
        name: "Los Angeles, CA",
        lat: 34.0522,
        lon: -118.2437
    },
    {
        id: "houston",
        name: "Houston, TX",
        lat: 29.7499,
        lon: -95.3584
    },
    {
        id: "phoenix",
        name: "Phoenix, AZ",
        lat: 33.4484,
        lon: -112.0740
    }
];

/**
 * Repository abstraction for accessing cities.
 */
export const cityRepository = {

    /**
     * Returns all supported cities.
     * 
     * @returns {City[]}
     */
    getAll() {
        return cities;
    },
    
    /**
     * Finds a city by its unique identifier.
     * 
     * @param {string} id   - the unique identifier of the city
     * @returns {City | null}       - The name of the city, or null if unavailable
     */
    getById(id) {
        return cities.find((c) => c.id === id) || null;
    }
};
