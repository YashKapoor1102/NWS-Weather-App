import { useState, useMemo } from "react";

/**
 * Converts an ISO datetime string into a specific day of the week.
 * 
 * @param {string | undefined | null} isoString - ISO date string (from NWS API startTime field)
 * @returns {string}    - Full day of the week name (e.g., Monday) or an 
 *                        empty string if the input is invalid.
 */
function formatWeekdayFromIso(isoString) {
    if (!isoString) {
        return "";
    }

    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleDateString(undefined, { weekday: "long" });
}

/**
 * Creates a display label like "Monday" or "Monday Night" using stable fields.
 * This avoids NWS "name" field, which may be a holiday name like "Washington's Birthday"
 * 
 * @param {Object} period       - list of weather information for different days of the week
 * @returns {string}    - A display-ready label such as "Monday" or "Monday Night"
 */
function getPeriodDisplayLabel(period) {
    if (!period) {
        return "";
    }

    const dayName = formatWeekdayFromIso(period.startTime);

    if (!dayName) {
        return period.isDaytime ? "Day" : "Night";
    }

    return period.isDaytime ? dayName : `${dayName} Night`;
}

/**
 * Shows weather information for a single city, including:
 *      - Current period summary
 *      - Expandable current detailed forecast
 *      - Horizontal strip of upcoming periods
 * 
 * @param {Object props} props
 * @param {Object} props.item   - Weather data object returned from the backend. 
 * @returns {import("react").ReactElement}
 */
export function CityWeatherCard({ item }) {
  const { city, location, current, updated, periods = [] } = item;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const safePeriods = useMemo(
    () => (Array.isArray(periods) ? periods : []),
    [periods]
  );

  const selected = safePeriods[selectedIndex] || current || null;
  const selectedLabel = useMemo(
    () => getPeriodDisplayLabel(selected),
    [selected]
  );

  return (
    <div className="card">
      <div className="cardHeader">
        <div>
          <h3 className="city">{city}</h3>
          <div className="muted">
            {location?.lat?.toFixed?.(4)}, {location?.lon?.toFixed?.(4)}
          </div>
        </div>
      </div>

      <div className="cardBody">
        {selected ? (
          <div className="currentRow">
            {selected.icon ? (
              <img className="icon" src={selected.icon} alt={selected.shortForecast} />
            ) : null}

            <div className="currentMain">
              <div className="temp">
                {selected.temperature}°{selected.temperatureUnit}
              </div>

              <div className="summary">{selected.shortForecast}</div>

              <div className="muted">
                Wind: {selected.windSpeed} {selected.windDirection}
              </div>

              <div className="muted" style={{ marginTop: 4 }}>
                <strong>{selectedLabel}</strong>
              </div>
            </div>
          </div>
        ) : (
          <div className="muted">No forecast available.</div>
        )}

        {safePeriods.length > 0 ? (
          <div className="stripWrap">
            <div className="stripTitle muted">Forecast</div>

            <div
              className="forecastStrip"
              role="list"
              aria-label={`Forecast periods for ${city}`}
            >
              {safePeriods.map((p, idx) => {
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={`${p.startTime}-${idx}`}
                    type="button"
                    className={`periodChip ${isSelected ? "selected" : ""}`}
                    onClick={() => setSelectedIndex(idx)}
                    aria-pressed={isSelected}
                    title={p.shortForecast}
                  >
                    <div className="chipName">{getPeriodDisplayLabel(p)}</div>

                    {p.icon ? (
                      <img className="chipIcon" src={p.icon} alt="" aria-hidden="true" />
                    ) : null}

                    <div className="chipTemp">
                      {p.temperature}°{p.temperatureUnit}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {selected?.detailedForecast ? (
          <details className="details">
            <summary>Details for {selectedLabel}</summary>
            <p>{selected.detailedForecast}</p>
          </details>
        ) : null}

        <div className="footer muted">
          Updated: {updated ? new Date(updated).toLocaleString() : "-"}
        </div>
      </div>
    </div>
  );
}
