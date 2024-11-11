import type { TWeatherSymbolKey } from "./weathericons";
import { Convert, type Timesery } from "./yrQuicktype.ts";
import { mockRawData } from "./mock.ts";

export type YrTSData = {
  temp: number;
  rain: number;
  date: Date;
  icon?: TWeatherSymbolKey;
};

export type YrDailyData = {
  date: Date;
  icon: TWeatherSymbolKey;
};

export async function getWeather(
  mock = false,
  { lat = "60", lon = "11", hrs = 8 } = {},
) {
  const response = mock ? mockRawData : await getYrData(lat, lon);
  const nextDays = getNextThreeDaysIcons(response);
  const trimmedResponse = getNextNHrs(response, hrs);
  const today = getTSData(trimmedResponse);
  return {
    nextDays,
    today,
  };
}

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

function getTSData(w: Timesery[]): YrTSData[] {
  return w.map((t: Timesery) => {
    const base = {
      temp: t.data.instant.details.air_temperature,
      rain: t?.data?.next_1_hours?.details.precipitation_amount || 0,
      date: new Date(t.time),
    };
    const icon = t?.data?.next_1_hours?.summary.symbol_code;
    return icon ? { ...base, icon: icon as TWeatherSymbolKey } : base;
  });
}

function getNextThreeDaysIcons(data: Timesery[]): YrDailyData[] {
  const now = new Date();

  const todayForecast = data.find(
    (t) =>
      new Date(t.time) >= now && t.data.next_12_hours?.summary?.symbol_code,
  );

  const nextDaysForecasts = data
    .filter((t) => {
      const date = new Date(t.time);
      return (
        date.getHours() === 8 &&
        date.getTime() > now.getTime() &&
        t.data.next_12_hours?.summary?.symbol_code
      );
    })
    .slice(0, 2);

  return [todayForecast, ...nextDaysForecasts]
    .filter((t): t is Timesery => !!t)
    .map((t) => ({
      date: new Date(t.time),
      icon: t.data.next_12_hours?.summary.symbol_code as TWeatherSymbolKey,
    }));
}
