import { createChart } from "./draw/index.ts";
import { getTransports } from "./data/transit/index.ts";
import { getWeather } from "./data/weather/index.ts";
import { dimensions, style } from "./draw/visual-settings.ts";

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

  const { today: todayWeather, nextDays: nextDaysWeather } = weatherData;
  console.log(nextDaysWeather);

  try {
    const buffer = await createChart(
      todayWeather,
      nextDaysWeather,
      transitData,
      dimensions,
      style,
    );
    return buffer;
  } catch (err) {
    throw new Error(`Couldn't create buffer: ${JSON.stringify(err)}`);
  }
}
