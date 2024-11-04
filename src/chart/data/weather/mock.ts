function makeDate(factor: number): Date {
  return new Date(new Date().setMinutes(0, 0, 0) + factor * 60 * 60 * 1000);
}

export const mockRawData = [
  {
    time: makeDate(-1),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992,
          air_temperature: -22,
          cloud_area_fraction: 100,
          relative_humidity: 79.2,
          wind_from_direction: 221.4,
          wind_speed: 10.2,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "lightrain" },
        details: { precipitation_amount: 0.1 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrain" },
        details: { precipitation_amount: 0.5 },
      },
    },
  },
  {
    time: makeDate(0),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992,
          air_temperature: -22,
          cloud_area_fraction: 100,
          relative_humidity: 79.2,
          wind_from_direction: 221.4,
          wind_speed: 10.2,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "lightrain" },
        details: { precipitation_amount: 0.1 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrain" },
        details: { precipitation_amount: 0.5 },
      },
    },
  },
  {
    time: makeDate(1),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992,
          air_temperature: 15.8,
          cloud_area_fraction: 100,
          relative_humidity: 70.8,
          wind_from_direction: 200.9,
          wind_speed: 9.9,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "rain" },
        details: { precipitation_amount: 0.4 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: { precipitation_amount: 0.8 },
      },
    },
  },
  {
    time: makeDate(2),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992,
          air_temperature: 15.8,
          cloud_area_fraction: 100,
          relative_humidity: 67.9,
          wind_from_direction: 233.2,
          wind_speed: 11,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "cloudy" },
        details: { precipitation_amount: 1.2 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: { precipitation_amount: 0.6 },
      },
    },
  },
  {
    time: makeDate(3),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992.2,
          air_temperature: 15.8,
          cloud_area_fraction: 91.6,
          relative_humidity: 61,
          wind_from_direction: 226.8,
          wind_speed: 10.8,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "cloudy" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: { precipitation_amount: 0.7 },
      },
    },
  },
  {
    time: makeDate(4),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992.5,
          air_temperature: 15.5,
          cloud_area_fraction: 81.3,
          relative_humidity: 59.6,
          wind_from_direction: 218,
          wind_speed: 10.9,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_night" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: { precipitation_amount: 0.9 },
      },
    },
  },
  {
    time: makeDate(5),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992.5,
          air_temperature: 14.8,
          cloud_area_fraction: 78.5,
          relative_humidity: 60.1,
          wind_from_direction: 213.9,
          wind_speed: 10.5,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_night" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: { precipitation_amount: 0.5 },
      },
    },
  },
  {
    time: makeDate(6),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992.4,
          air_temperature: 14.9,
          cloud_area_fraction: 86,
          relative_humidity: 59.5,
          wind_from_direction: 218.4,
          wind_speed: 11.1,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_night" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_night" },
        details: { precipitation_amount: 0.6 },
      },
    },
  },
  {
    time: makeDate(7),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992.2,
          air_temperature: 14.6,
          cloud_area_fraction: 61.5,
          relative_humidity: 61,
          wind_from_direction: 212.7,
          wind_speed: 10.2,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_night" },
        details: { precipitation_amount: 2 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: { precipitation_amount: 0.5 },
      },
    },
  },
  {
    time: makeDate(8),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 992.5,
          air_temperature: 14.6,
          cloud_area_fraction: 79.2,
          relative_humidity: 59.3,
          wind_from_direction: 215.5,
          wind_speed: 11.8,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_night" },
        details: { precipitation_amount: 3.3 },
      },
      next_6_hours: {
        summary: { symbol_code: "lightrainshowers_day" },
        details: { precipitation_amount: 0.5 },
      },
    },
  },
  {
    time: makeDate(9),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 993,
          air_temperature: 14.2,
          cloud_area_fraction: 55.5,
          relative_humidity: 63,
          wind_from_direction: 190.9,
          wind_speed: 11.3,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_night" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: { precipitation_amount: 0 },
      },
    },
  },
  {
    time: makeDate(10),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 993.1,
          air_temperature: 14.4,
          cloud_area_fraction: 73.7,
          relative_humidity: 61,
          wind_from_direction: 221.6,
          wind_speed: 12.6,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: { precipitation_amount: 0 },
      },
    },
  },
  {
    time: makeDate(11),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 993.6,
          air_temperature: 14,
          cloud_area_fraction: 78.8,
          relative_humidity: 71.1,
          wind_from_direction: 219.1,
          wind_speed: 14.4,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: { precipitation_amount: 0 },
      },
    },
  },
  {
    time: makeDate(12),
    data: {
      instant: {
        details: {
          air_pressure_at_sea_level: 993.7,
          air_temperature: 14.5,
          cloud_area_fraction: 97.4,
          relative_humidity: 59.1,
          wind_from_direction: 215.3,
          wind_speed: 11.3,
        },
      },
      next_12_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: {},
      },
      next_1_hours: {
        summary: { symbol_code: "cloudy" },
        details: { precipitation_amount: 0 },
      },
      next_6_hours: {
        summary: { symbol_code: "partlycloudy_day" },
        details: { precipitation_amount: 0 },
      },
    },
  },
];
