import { createChartBuffer } from "./draw";
import { getTransports } from "./data/transit";
import { getWeather } from "./data/weather";
import { dimensions, style } from "./data";

export async function drawChart(mock: boolean) {
  const [weatherData, transitData] = await Promise.all([
    getWeather(mock),
    getTransports(mock),
  ]);

  if (!weatherData) {
    throw new Error("no weather data");
  }

  if (!transitData) {
    throw new Error("no transit data");
  }

  try {
    const buffer = await createChartBuffer(
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
