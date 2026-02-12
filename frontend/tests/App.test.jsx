import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import App from "../src/App.jsx";
import { fetchWeather } from "../src/api/weatherApi.js";

vi.mock("../src/api/weatherApi.js", () => ({
  fetchWeather: vi.fn(),
}));

test("shows loading then renders city cards", async () => {
  fetchWeather.mockResolvedValue({
    data: [
      {
        city: "Miami, FL",
        location: { lat: 25.7743, lon: -80.1937 },
        updated: "2026-01-01T00:00:00Z",
        current: null,
        periods: [
          {
            name: "Today",
            startTime: "2026-01-01T06:00:00-05:00",
            endTime: "2026-01-01T18:00:00-05:00",
            isDaytime: true,
            temperature: 70,
            temperatureUnit: "F",
            windSpeed: "5 mph",
            windDirection: "NW",
            shortForecast: "Sunny",
            detailedForecast: "Clear.",
            icon: "",
          },
        ],
      },
    ],
  });

  render(<App />);

  expect(screen.getByText(/Fetching forecast/i)).toBeInTheDocument();
  expect(
    await screen.findByRole("heading", { name: /Miami, FL/i })
  ).toBeInTheDocument();
});

test("filters cities using the dropdown", async () => {
  fetchWeather.mockResolvedValue({
    data: [
      {
        city: "Miami, FL",
        location: { lat: 25.7743, lon: -80.1937 },
        updated: "2026-01-01T00:00:00Z",
        current: null,
        periods: [
          {
            name: "Today",
            startTime: "2026-01-01T06:00:00-05:00",
            endTime: "2026-01-01T18:00:00-05:00",
            isDaytime: true,
            temperature: 70,
            temperatureUnit: "F",
            windSpeed: "5 mph",
            windDirection: "NW",
            shortForecast: "Sunny",
            detailedForecast: "Clear.",
            icon: "",
          },
        ],
      },
      {
        city: "Chicago, IL",
        location: { lat: 41.8818, lon: -87.6232 },
        updated: "2026-01-01T00:00:00Z",
        current: null,
        periods: [
          {
            name: "Today",
            startTime: "2026-01-01T06:00:00-06:00",
            endTime: "2026-01-01T18:00:00-06:00",
            isDaytime: true,
            temperature: 10,
            temperatureUnit: "F",
            windSpeed: "20 mph",
            windDirection: "N",
            shortForecast: "Snow",
            detailedForecast: "Cold.",
            icon: "",
          },
        ],
      },
    ],
  });

  render(<App />);
  await screen.findByRole("heading", { name: /Miami, FL/i });

  const user = userEvent.setup();
  const select = screen.getByRole("combobox");

  await user.selectOptions(select, "Chicago, IL");

  expect(
    screen.getByRole("heading", { name: /Chicago, IL/i })
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: /Miami, FL/i })
  ).not.toBeInTheDocument();
});

test("shows error banner if API call fails", async () => {
  fetchWeather.mockRejectedValue(new Error("boom"));

  render(<App />);

  expect(await screen.findByText(/Error:/i)).toBeInTheDocument();
  expect(screen.getByText(/boom/i)).toBeInTheDocument();
});
