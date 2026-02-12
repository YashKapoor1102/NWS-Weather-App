import { useEffect, useMemo, useState } from "react"; 
import { fetchWeather } from "./api/weatherApi.js";
import { Loading } from "./components/Loading.jsx";
import { ErrorBanner } from "./components/ErrorBanner.jsx";
import { CityWeatherCard } from "./components/CityWeatherCard.jsx";

/**
 * Responsible for fetching weather data from the backend
 * and rendering UI components.
 * 
 * @returns {import("react").ReactElement}
 */
export default function App() {
    const [allWeather, setAllWeather] = useState([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const cityOptions = useMemo(() => {
        return allWeather.map((w) => w.city);
    }, [allWeather]);

    const visibleWeather = useMemo(() => {
        if (!selectedCity) {
            return allWeather;
        }
        return allWeather.filter((w) => w.city === selectedCity);
    }, [allWeather, selectedCity]);

    async function load() {
        setError("");
        setLoading(true);

        try {
            const res = await fetchWeather();
            setAllWeather(res.data || []);
        } catch(e) {
            setError(e?.message || "Failed to load weather");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="page">
            <header className="header">
                <h1>NWS Weather</h1>

                <p className="muted">
                    Forecast data
                </p>

                <div className="toolbar">
                    <label className="toolbar">
                        City:
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option value="">All cities</option>

                            {cityOptions.map((name) => (
                                <option key={name} value={name}>
                                    {name}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button className="button" onClick={load}>
                        Refresh 
                    </button>

                    <div className="muted">
                        Showing: <strong>{selectedCity || "All cities"}</strong>
                    </div>
                </div>
                
                <ErrorBanner message={error} />
            </header>

            <main className="grid">
                {loading ? (
                    <Loading text="Fetching forecast..." />
                ) : (
                    visibleWeather.map((item) => (
                        <CityWeatherCard key={item.city} item={item} />
                    ))
                )}
            </main>
        </div>
    );
}
