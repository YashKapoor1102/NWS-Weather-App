const API_BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:4000";

async function readErrorMessage(res) {
    const text = await res.text();

    try {
        const json = JSON.parse(text);
        return json.message || json.error || text;
    } catch {
        return text || `Request failed (${res.status})`;
    }
}

export async function fetchWeather({ cityId } = {}) {
    const url = cityId 
        ? `${API_BASE_URL}/api/weather?city=${encodeURIComponent(cityId)}`
        : `${API_BASE_URL}/api/weather`;

    const res = await fetch(url);

    if (!res.ok) {
        const msg = await readErrorMessage(res);
        throw new Error(msg);
    }

    return res.json();
}
