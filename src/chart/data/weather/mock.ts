function makeDate(factor: number): Date {
  return new Date(new Date().setMinutes(0, 0, 0) + factor * 60 * 60 * 1000);
}

export const mockRawData = [
  {
    time: makeDate(-1),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1000,
          air_temperature: 13.2,
          air_temperature_percentile_10: 12.4,
          air_temperature_percentile_90: 14,
          cloud_area_fraction: 81.2,
          cloud_area_fraction_high: 1.8,
          cloud_area_fraction_low: 55.6,
          cloud_area_fraction_medium: 36.6,
          dew_point_temperature: 13,
          fog_area_fraction: 0,
          relative_humidity: 97.8,
          ultraviolet_index_clear_sky: 0,
          wind_from_direction: 159.9,
          wind_speed: 1.6,
          wind_speed_of_gust: 4.1,
          wind_speed_percentile_10: 0.8,
          wind_speed_percentile_90: 1.6,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "lightrain",
          symbol_confidence: "somewhat certain",
        },
        details: {
          probability_of_precipitation: 73,
        },
      },
      next_1_hours: {
        summary: {
          symbol_code: "partlycloudy_night",
        },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0.4,
          precipitation_amount_min: 0,
          probability_of_precipitation: 20.4,
          probability_of_thunder: 7.4,
        },
      },
      next_6_hours: {
        summary: {
          symbol_code: "lightrain",
        },
        details: {
          air_temperature_max: 14.3,
          air_temperature_min: 12.3,
          precipitation_amount: 0.5,
          precipitation_amount_max: 3.5,
          precipitation_amount_min: 0.2,
          probability_of_precipitation: 53.3,
        },
      },
    },
  },
  {
    time: makeDate(0),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992,
          air_temperature: 11.8,
          air_temperature_percentile_10: 10.9,
          air_temperature_percentile_90: 12.7,
          cloud_area_fraction: 95.5,
          cloud_area_fraction_high: 8.2,
          cloud_area_fraction_low: 72.3,
          cloud_area_fraction_medium: 45.1,
          dew_point_temperature: 11.5,
          fog_area_fraction: 2.1,
          relative_humidity: 89.2,
          ultraviolet_index_clear_sky: 0.2,
          wind_from_direction: 221.4,
          wind_speed: 10.2,
          wind_speed_of_gust: 18.5,
          wind_speed_percentile_10: 5.8,
          wind_speed_percentile_90: 14.2,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "lightrainshowers_day",
          symbol_confidence: "somewhat certain",
        },
        details: {
          probability_of_precipitation: 68,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "lightrain" },
        details: {
          precipitation_amount: 0.1,
          precipitation_amount_max: 0.3,
          precipitation_amount_min: 0,
          probability_of_precipitation: 45.2,
          probability_of_thunder: 2.1,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrain" },
        details: {
          air_temperature_max: 13.1,
          air_temperature_min: 10.5,
          precipitation_amount: 0.5,
          precipitation_amount_max: 1.2,
          precipitation_amount_min: 0.1,
          probability_of_precipitation: 58.7,
        },
      },
    },
  },
  {
    time: makeDate(1),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 995.2,
          air_temperature: 15.8,
          air_temperature_percentile_10: 14.9,
          air_temperature_percentile_90: 16.7,
          cloud_area_fraction: 87.2,
          cloud_area_fraction_high: 12.5,
          cloud_area_fraction_low: 65.8,
          cloud_area_fraction_medium: 38.9,
          dew_point_temperature: 12.3,
          fog_area_fraction: 0.5,
          relative_humidity: 75.8,
          ultraviolet_index_clear_sky: 1.2,
          wind_from_direction: 200.9,
          wind_speed: 9.9,
          wind_speed_of_gust: 16.8,
          wind_speed_percentile_10: 6.2,
          wind_speed_percentile_90: 13.1,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "lightrainshowers_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 82,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "rain" },
        details: {
          precipitation_amount: 0.4,
          precipitation_amount_max: 0.8,
          precipitation_amount_min: 0.1,
          probability_of_precipitation: 78.5,
          probability_of_thunder: 5.2,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: {
          air_temperature_max: 17.2,
          air_temperature_min: 14.1,
          precipitation_amount: 0.8,
          precipitation_amount_max: 2.1,
          precipitation_amount_min: 0.3,
          probability_of_precipitation: 71.4,
        },
      },
    },
  },
  {
    time: makeDate(2),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 988.7,
          air_temperature: 16.2,
          air_temperature_percentile_10: 15.1,
          air_temperature_percentile_90: 17.4,
          cloud_area_fraction: 92.8,
          cloud_area_fraction_high: 18.7,
          cloud_area_fraction_low: 58.3,
          cloud_area_fraction_medium: 52.1,
          dew_point_temperature: 13.8,
          fog_area_fraction: 1.2,
          relative_humidity: 82.9,
          ultraviolet_index_clear_sky: 0.8,
          wind_from_direction: 233.2,
          wind_speed: 11.0,
          wind_speed_of_gust: 19.3,
          wind_speed_percentile_10: 7.8,
          wind_speed_percentile_90: 14.7,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "lightrainshowers_day",
          symbol_confidence: "uncertain",
        },
        details: {
          probability_of_precipitation: 91,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "cloudy" },
        details: {
          precipitation_amount: 1.2,
          precipitation_amount_max: 2.1,
          precipitation_amount_min: 0.5,
          probability_of_precipitation: 89.3,
          probability_of_thunder: 8.7,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: {
          air_temperature_max: 18.1,
          air_temperature_min: 15.2,
          precipitation_amount: 0.6,
          precipitation_amount_max: 1.5,
          precipitation_amount_min: 0.2,
          probability_of_precipitation: 65.8,
        },
      },
    },
  },
  {
    time: makeDate(3),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 994.8,
          air_temperature: 14.3,
          air_temperature_percentile_10: 13.2,
          air_temperature_percentile_90: 15.6,
          cloud_area_fraction: 78.4,
          cloud_area_fraction_high: 5.8,
          cloud_area_fraction_low: 48.2,
          cloud_area_fraction_medium: 31.7,
          dew_point_temperature: 10.9,
          fog_area_fraction: 0,
          relative_humidity: 68.5,
          ultraviolet_index_clear_sky: 2.1,
          wind_from_direction: 226.8,
          wind_speed: 10.8,
          wind_speed_of_gust: 15.2,
          wind_speed_percentile_10: 6.9,
          wind_speed_percentile_90: 12.8,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "lightrainshowers_day",
          symbol_confidence: "somewhat certain",
        },
        details: {
          probability_of_precipitation: 45,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "cloudy" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0.1,
          precipitation_amount_min: 0,
          probability_of_precipitation: 15.7,
          probability_of_thunder: 1.2,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: {
          air_temperature_max: 16.4,
          air_temperature_min: 12.8,
          precipitation_amount: 0.7,
          precipitation_amount_max: 1.8,
          precipitation_amount_min: 0.2,
          probability_of_precipitation: 52.3,
        },
      },
    },
  },
  {
    time: makeDate(4),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 997.1,
          air_temperature: 18.2,
          air_temperature_percentile_10: 16.8,
          air_temperature_percentile_90: 19.7,
          cloud_area_fraction: 65.7,
          cloud_area_fraction_high: 3.2,
          cloud_area_fraction_low: 42.1,
          cloud_area_fraction_medium: 28.5,
          dew_point_temperature: 9.7,
          fog_area_fraction: 0,
          relative_humidity: 55.8,
          ultraviolet_index_clear_sky: 4.2,
          wind_from_direction: 218.0,
          wind_speed: 8.3,
          wind_speed_of_gust: 12.7,
          wind_speed_percentile_10: 5.1,
          wind_speed_percentile_90: 10.9,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "partlycloudy_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 28,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 8.2,
          probability_of_thunder: 0.5,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          air_temperature_max: 20.3,
          air_temperature_min: 16.1,
          precipitation_amount: 0.1,
          precipitation_amount_max: 0.3,
          precipitation_amount_min: 0,
          probability_of_precipitation: 25.7,
        },
      },
    },
  },
  {
    time: makeDate(5),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 999.8,
          air_temperature: 21.1,
          air_temperature_percentile_10: 19.5,
          air_temperature_percentile_90: 22.8,
          cloud_area_fraction: 45.2,
          cloud_area_fraction_high: 1.5,
          cloud_area_fraction_low: 28.7,
          cloud_area_fraction_medium: 18.9,
          dew_point_temperature: 8.3,
          fog_area_fraction: 0,
          relative_humidity: 42.1,
          ultraviolet_index_clear_sky: 6.8,
          wind_from_direction: 213.9,
          wind_speed: 6.2,
          wind_speed_of_gust: 9.8,
          wind_speed_percentile_10: 3.7,
          wind_speed_percentile_90: 8.4,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "fair_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 12,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "fair_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 3.1,
          probability_of_thunder: 0.2,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          air_temperature_max: 23.2,
          air_temperature_min: 18.9,
          precipitation_amount: 0,
          precipitation_amount_max: 0.1,
          precipitation_amount_min: 0,
          probability_of_precipitation: 8.5,
        },
      },
    },
  },
  {
    time: makeDate(6),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1002.3,
          air_temperature: 19.7,
          air_temperature_percentile_10: 18.2,
          air_temperature_percentile_90: 21.4,
          cloud_area_fraction: 32.8,
          cloud_area_fraction_high: 2.1,
          cloud_area_fraction_low: 18.5,
          cloud_area_fraction_medium: 15.2,
          dew_point_temperature: 6.9,
          fog_area_fraction: 0,
          relative_humidity: 38.7,
          ultraviolet_index_clear_sky: 7.5,
          wind_from_direction: 218.4,
          wind_speed: 5.8,
          wind_speed_of_gust: 8.3,
          wind_speed_percentile_10: 3.2,
          wind_speed_percentile_90: 7.9,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "clearsky_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 5,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 1.5,
          probability_of_thunder: 0.1,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {
          air_temperature_max: 22.1,
          air_temperature_min: 17.3,
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 2.8,
        },
      },
    },
  },
  {
    time: makeDate(7),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 986.7,
          air_temperature: 17.3,
          air_temperature_percentile_10: 15.9,
          air_temperature_percentile_90: 18.8,
          cloud_area_fraction: 88.4,
          cloud_area_fraction_high: 25.7,
          cloud_area_fraction_low: 52.1,
          cloud_area_fraction_medium: 41.8,
          dew_point_temperature: 14.2,
          fog_area_fraction: 3.7,
          relative_humidity: 78.5,
          ultraviolet_index_clear_sky: 1.8,
          wind_from_direction: 212.7,
          wind_speed: 12.6,
          wind_speed_of_gust: 21.4,
          wind_speed_percentile_10: 8.9,
          wind_speed_percentile_90: 16.2,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "heavyrain",
          symbol_confidence: "somewhat certain",
        },
        details: {
          probability_of_precipitation: 95,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "rain" },
        details: {
          precipitation_amount: 2.0,
          precipitation_amount_max: 3.5,
          precipitation_amount_min: 1.2,
          probability_of_precipitation: 92.7,
          probability_of_thunder: 15.8,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "heavyrain" },
        details: {
          air_temperature_max: 19.1,
          air_temperature_min: 15.7,
          precipitation_amount: 5.8,
          precipitation_amount_max: 8.2,
          precipitation_amount_min: 3.1,
          probability_of_precipitation: 88.9,
        },
      },
    },
  },
  {
    time: makeDate(8),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 982.1,
          air_temperature: 16.8,
          air_temperature_percentile_10: 15.2,
          air_temperature_percentile_90: 18.5,
          cloud_area_fraction: 96.7,
          cloud_area_fraction_high: 35.8,
          cloud_area_fraction_low: 72.1,
          cloud_area_fraction_medium: 58.3,
          dew_point_temperature: 15.1,
          fog_area_fraction: 8.2,
          relative_humidity: 87.3,
          ultraviolet_index_clear_sky: 0.5,
          wind_from_direction: 215.5,
          wind_speed: 15.2,
          wind_speed_of_gust: 26.7,
          wind_speed_percentile_10: 11.3,
          wind_speed_percentile_90: 19.8,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "heavyrain",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 98,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "heavyrain" },
        details: {
          precipitation_amount: 3.3,
          precipitation_amount_max: 5.1,
          precipitation_amount_min: 2.1,
          probability_of_precipitation: 97.2,
          probability_of_thunder: 22.4,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "heavyrain" },
        details: {
          air_temperature_max: 18.9,
          air_temperature_min: 14.7,
          precipitation_amount: 7.2,
          precipitation_amount_max: 10.8,
          precipitation_amount_min: 4.5,
          probability_of_precipitation: 94.7,
        },
      },
    },
  },
  {
    time: makeDate(9),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 996.4,
          air_temperature: 12.7,
          air_temperature_percentile_10: 11.3,
          air_temperature_percentile_90: 14.2,
          cloud_area_fraction: 68.9,
          cloud_area_fraction_high: 8.7,
          cloud_area_fraction_low: 41.2,
          cloud_area_fraction_medium: 28.5,
          dew_point_temperature: 8.9,
          fog_area_fraction: 0.8,
          relative_humidity: 71.5,
          ultraviolet_index_clear_sky: 3.2,
          wind_from_direction: 190.9,
          wind_speed: 8.7,
          wind_speed_of_gust: 13.8,
          wind_speed_percentile_10: 5.9,
          wind_speed_percentile_90: 11.3,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "partlycloudy_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 18,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 5.3,
          probability_of_thunder: 0.3,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          air_temperature_max: 15.8,
          air_temperature_min: 10.9,
          precipitation_amount: 0,
          precipitation_amount_max: 0.1,
          precipitation_amount_min: 0,
          probability_of_precipitation: 12.7,
        },
      },
    },
  },
  {
    time: makeDate(10),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1003.7,
          air_temperature: 16.8,
          air_temperature_percentile_10: 15.1,
          air_temperature_percentile_90: 18.5,
          cloud_area_fraction: 41.3,
          cloud_area_fraction_high: 4.2,
          cloud_area_fraction_low: 25.8,
          cloud_area_fraction_medium: 17.9,
          dew_point_temperature: 7.2,
          fog_area_fraction: 0,
          relative_humidity: 48.3,
          ultraviolet_index_clear_sky: 5.8,
          wind_from_direction: 221.6,
          wind_speed: 7.9,
          wind_speed_of_gust: 11.4,
          wind_speed_percentile_10: 4.8,
          wind_speed_percentile_90: 10.2,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "partlycloudy_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 8,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 2.1,
          probability_of_thunder: 0.1,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {
          air_temperature_max: 19.7,
          air_temperature_min: 14.2,
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 4.8,
        },
      },
    },
  },
  {
    time: makeDate(11),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1008.2,
          air_temperature: 20.3,
          air_temperature_percentile_10: 18.7,
          air_temperature_percentile_90: 22.1,
          cloud_area_fraction: 28.5,
          cloud_area_fraction_high: 1.8,
          cloud_area_fraction_low: 15.2,
          cloud_area_fraction_medium: 12.7,
          dew_point_temperature: 5.8,
          fog_area_fraction: 0,
          relative_humidity: 33.7,
          ultraviolet_index_clear_sky: 8.2,
          wind_from_direction: 219.1,
          wind_speed: 5.3,
          wind_speed_of_gust: 7.8,
          wind_speed_percentile_10: 2.9,
          wind_speed_percentile_90: 6.8,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "fair_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 3,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "fair_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 0.8,
          probability_of_thunder: 0.1,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "fair_day" },
        details: {
          air_temperature_max: 23.5,
          air_temperature_min: 17.9,
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 1.7,
        },
      },
    },
  },
  {
    time: makeDate(12),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 1011.8,
          air_temperature: 23.7,
          air_temperature_percentile_10: 21.9,
          air_temperature_percentile_90: 25.8,
          cloud_area_fraction: 15.2,
          cloud_area_fraction_high: 0.5,
          cloud_area_fraction_low: 8.7,
          cloud_area_fraction_medium: 6.8,
          dew_point_temperature: 4.1,
          fog_area_fraction: 0,
          relative_humidity: 25.3,
          ultraviolet_index_clear_sky: 9.1,
          wind_from_direction: 215.3,
          wind_speed: 4.2,
          wind_speed_of_gust: 6.1,
          wind_speed_percentile_10: 2.3,
          wind_speed_percentile_90: 5.7,
        },
      },
      next_12_hours: {
        summary: {
          symbol_code: "clearsky_day",
          symbol_confidence: "certain",
        },
        details: {
          probability_of_precipitation: 1,
        },
      },
      next_1_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 0.3,
          probability_of_thunder: 0,
        },
      },
      next_6_hours: {
        summary: { symbol_code: "clearsky_day" },
        details: {
          air_temperature_max: 26.2,
          air_temperature_min: 20.8,
          precipitation_amount: 0,
          precipitation_amount_max: 0,
          precipitation_amount_min: 0,
          probability_of_precipitation: 0.7,
        },
      },
    },
  },
];
