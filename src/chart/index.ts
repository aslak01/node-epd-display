import { createChartBuffer } from "./draw";
import { getTransports } from "./data/transit";
import { getWeather } from "./data/weather";
import { dimensions, style } from "./data";
import isOnline from "is-online";

export async function drawChart(req?: Request) {
  let mock = false;

  if (req) {
    const { searchParams } = new URL(req.url);
    mock = !!searchParams.get("mock");
  }

  const online = await isOnline();

  if (!online) {
    mock = true;
  }

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