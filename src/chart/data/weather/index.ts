import {
  convertSymbolKeyToId,
  type TWeatherSymbolId,
  type TWeatherSymbolKey,
} from "./weathericons.ts";
import { type Timesery } from "./yrQuicktype.ts";
import { mockRawData } from "./mock.ts";

export type YrTSData = {
  temp: number;
  rain: number;
  rainMax: number;
  date: Date;
  icon?: TWeatherSymbolKey;
};

export type YrDailyData = {
  date: Date;
  icon: TWeatherSymbolKey;
  iconCode?: TWeatherSymbolId;
};

export async function getWeather(
  mock = false,
  { lat = "60", lon = "11", hrs = 8 } = {},
) {
  const response = mock
    ? (mockRawData as Timesery[])
    : await getYrData(lat, lon);
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
    `https://api.met.no/weatherapi/locationforecast/2.0/complete?lat=${lat}&lon=${lon}`,
    {
      headers: {
        "User-Agent":
          "node-epd-display/1.0 (github.com/aslak01/node-epd-display)",
      },
    },
  );

  if (!req.ok) {
    throw new Error(`HTTP error! status: ${req.status}`);
  }

  const data = await req.text();
  const rawJson = JSON.parse(data);
  return rawJson.properties.timeseries;
}

function getNextNHrs(data: Timesery[], n = 10) {
  // Get current time in local timezone, rounded down to current hour
  const nowLocal = new Date();
  nowLocal.setMinutes(0, 0, 0);
  // console.log("Current time (now local):", nowLocal.toLocaleString());

  const nHrsInMs = n * 60 * 60 * 1000;

  const nextNhours = data.filter((t: Timesery) => {
    // Convert UTC API time to local time for comparison
    const timeSeriesTimeLocal = new Date(t.time);
    const include =
      timeSeriesTimeLocal >= nowLocal &&
      timeSeriesTimeLocal <= new Date(nowLocal.getTime() + nHrsInMs);
    // console.log(
    //   `Time: ${t.time} (local: ${timeSeriesTimeLocal.toLocaleString()}), Include: ${include}`,
    // );
    return include;
  });
  return nextNhours;
}

function getTSData(w: Timesery[]): YrTSData[] {
  return w.map((t: Timesery) => {
    console.table(JSON.stringify(t));
    const rainAmount =
      t?.data?.next_1_hours?.details?.precipitation_amount || 0;
    const rainMax =
      t?.data?.next_1_hours?.details?.precipitation_amount_max || rainAmount;

    const base = {
      temp: t.data.instant.details.air_temperature,
      rain: rainAmount,
      rainMax: rainMax,
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
      iconCode: convertSymbolKeyToId(
        t.data.next_12_hours?.summary.symbol_code as TWeatherSymbolKey,
      ),
    }));
}
