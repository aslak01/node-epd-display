import { Convert, type Timesery } from "./yrQuicktype.ts";

async function getYrData(lat: string, lon: string): Promise<Timesery[]> {
  const req = await fetch(
    `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`,
  );
  const data = await req.text();
  const rawYrData = Convert.toRawYrData(data);
  return rawYrData.properties.timeseries;
}

function getNextNHrs(data: Timesery[], n = 10) {
  const now = new Date(new Date().setMinutes(0, 0, 0)).getTime();

  const nHrsInMs = n * 60 * 60 * 1000;

  const nextNhours = data.filter(
    (t: Timesery) =>
      new Date(t.time).getTime() >= now &&
      new Date(t.time).getTime() <= now + nHrsInMs,
  );
  return nextNhours;
}

import type { TWeatherSymbolKey } from "./weathericons";

function getTSData(w: Timesery[]): YrTSData[] {
  return w.map((t: Timesery) => ({
    temp: t.data.instant.details.air_temperature,
    rain: t?.data?.next_1_hours?.details.precipitation_amount || 0,
    date: new Date(t.time),
    icon: t?.data?.next_1_hours?.summary.symbol_code as TWeatherSymbolKey,
  }));
}

import { mockRawData } from "./mock.ts";

export async function getWeather(
  mock = false,
  { lat = "60", lon = "11", hrs = 8 } = {},
) {
  const response = mock ? mockRawData : await getYrData(lat, lon);
  const trimmedResponse = getNextNHrs(response, hrs);
  const tsData = getTSData(trimmedResponse);
  return tsData;
}

export type YrTSData = {
  temp: number;
  rain: number;
  date: Date;
  icon?: TWeatherSymbolKey;
};

export type DataPoint = {
  value: number;
  date: Date;
};
