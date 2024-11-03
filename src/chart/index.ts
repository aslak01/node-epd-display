import { createChart } from "./draw";
import { getTransports } from "./data/transit";
import { getWeather } from "./data/weather";
import { dimensions, style } from "./draw/visual-settings";

const lat = process.env.LAT || "11";
const lon = process.env.LON || "60";

export async function drawChart(mock: boolean) {
  const [weatherData, transitData] = await Promise.all([
    getWeather(mock, { lat, lon }),
    getTransports(mock),
  ]);

  if (!weatherData) {
    throw new Error("no weather data");
  }

  if (!transitData) {
    throw new Error("no transit data");
  }

  try {
    const buffer = await createChart(
      weatherData,
      transitData,
      dimensions,
      style,
    );
    return buffer;
  } catch (err) {
    throw new Error(`Couldn't create buffer: ${JSON.stringify(err)}`);
  }
}
