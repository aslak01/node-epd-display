export type DataPoint = { value: number } & YrTSData;

import { getWeather, type YrTSData } from "./weather/index.ts";
export { getWeather, type YrTSData };
