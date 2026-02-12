import { jest } from "@jest/globals";

const fetchForecastMock = jest.fn();

jest.unstable_mockModule("../src/services/nwsService.js", () => ({
    fetchForecast: fetchForecastMock 
}));

const { getWeather } = await import("../src/services/weatherService.js");

describe("weatherService.getWeather caching", () => {
    beforeEach(() => {
        fetchForecastMock.mockReset();
    });

    test("caches results for the same cityId (fetchForecast called once)", async () => {
        const forecastPayload = {
            updated: "2026-02-12T00:20:55+00:00",
            periods: [
                {
                    name: "Tonight",
                    temperature: 58,
                    temperatureUnit: "F",
                    windSpeed: "0 to 5 mph",
                    windDirection: "NW",
                    shortForecast: "Partly Cloudy",
                    detailedForecast: "Partly cloudy, with a low around 58.",
                    icon: "test-icon"
                },
                {
                    name: "Thursday",
                    temperature: 79,
                    temperatureUnit: "F",
                    windSpeed: "0 to 5 mph",
                    windDirection: "E",
                    shortForecast: "Mostly Sunny",
                    detailedForecast: "Mostly sunny, with a high near 79.",
                    icon: "test-icon"
                }
            ]
        };

        fetchForecastMock.mockResolvedValue(forecastPayload);

        const first = await getWeather({ cityId: "miami" });
        const second = await getWeather({ cityId: "miami" });

        expect(first.data[0].cached).toBe(false);
        expect(second.data[0].cached).toBe(true);
        expect(fetchForecastMock).toHaveBeenCalledTimes(1);

        expect(first.data[0]).toMatchObject({
            city: expect.any(String),
            location: { lat: expect.any(Number), lon: expect.any(Number) },
            updated: "2026-02-12T00:20:55+00:00",
            current: {
                name: "Tonight",
                temperature: 58,
                temperatureUnit: "F",
                windSpeed: "0 to 5 mph",
                windDirection: "NW",
                shortForecast: "Partly Cloudy",
                detailedForecast: "Partly cloudy, with a low around 58.",
                icon: "test-icon"
            }
        });

        expect(first.data[0].periods).toHaveLength(2);

        expect(first.data[0].periods[0]).toMatchObject(first.data[0].current);
        expect(first.data[0].periods[1]).toMatchObject({
            name: "Thursday",
            temperature: 79,
            temperatureUnit: "F",
            windSpeed: "0 to 5 mph",
            windDirection: "E",
            shortForecast: "Mostly Sunny",
            detailedForecast: "Mostly sunny, with a high near 79.",
            icon: "test-icon"
        });
    });

    test("throws 404 when cityId is unknown and does not call fetchForecast", async () => {
        fetchForecastMock.mockResolvedValue({ updated: "2026-02-12T00:20:55+00:00", periods: [] });

        await expect(getWeather({ cityId: "not-a-real-city" })).rejects.toMatchObject({
            message: "Unknown city id",
            statusCode: 404,
        });

        expect(fetchForecastMock).not.toHaveBeenCalled();
    });
});
