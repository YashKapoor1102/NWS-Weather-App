import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CityWeatherCard } from "../src/components/CityWeatherCard.jsx";

test("clicking a forecast period chip updates the displayed forecast", async () => {
  const user = userEvent.setup();

  render(
    <CityWeatherCard
      item={{
        city: "Miami, FL",
        location: { lat: 25.7743, lon: -80.1937 },
        updated: "2026-01-01T00:00:00Z",
        current: null,
        periods: [
          {
            name: "Thursday",
            startTime: "2026-01-01T06:00:00-05:00",
            isDaytime: true,
            temperature: 70,
            temperatureUnit: "F",
            windSpeed: "5 mph",
            windDirection: "NW",
            shortForecast: "Sunny",
            detailedForecast: "Clear.",
            icon: "",
          },
          {
            name: "Friday",
            startTime: "2026-01-02T18:00:00-05:00",
            isDaytime: false,
            temperature: 60,
            temperatureUnit: "F",
            windSpeed: "3 mph",
            windDirection: "N",
            shortForecast: "Cloudy",
            detailedForecast: "Cloudy overnight.",
            icon: "",
          },
        ],
      }}
    />
  );

  // initial is first period
  expect(screen.getByText(/Details for Thursday/i)).toBeInTheDocument();

  // click second chip
  await user.click(screen.getByRole("button", { name: /Friday Night/i }));

  // updated period should appear
  expect(screen.getByText(/Details for Friday Night/i)).toBeInTheDocument();
});
