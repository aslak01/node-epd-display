export type DataPoint = { value: number } & YrTSData;

import {
  getWeather,
  type YrTSData,
  type YrDailyData,
} from "./weather/index.ts";

export { getWeather, type YrTSData, type YrDailyData };
