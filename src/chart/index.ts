import { createChartBuffer, createEpdBuffer } from "./draw";
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

  return await createChartBuffer(weatherData, transitData, dimensions, style);
}

export async function displayChart(mock: boolean) {
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

  return await createEpdBuffer(weatherData, transitData, dimensions, style);
}
