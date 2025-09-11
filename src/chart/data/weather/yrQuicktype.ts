// To parse this data:
//
//   import { Convert, RawYrData } from "./file";
//
//   const rawYrData = Convert.toRawYrData(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export type RawYrData = {
  readonly type: string;
  readonly geometry: Geometry;
  readonly properties: Properties;
};

export type Geometry = {
  readonly type: string;
  readonly coordinates: number[];
};

export type Properties = {
  readonly meta: Meta;
  readonly timeseries: Timesery[];
};

export type Meta = {
  readonly updated_at: Date;
  readonly units: Units;
};

export type Units = {
  readonly air_pressure_at_sea_level?: string;
  readonly air_temperature?: string;
  readonly air_temperature_max?: string;
  readonly air_temperature_min?: string;
  readonly air_temperature_percentile_10?: string;
  readonly air_temperature_percentile_90?: string;
  readonly cloud_area_fraction?: string;
  readonly cloud_area_fraction_high?: string;
  readonly cloud_area_fraction_low?: string;
  readonly cloud_area_fraction_medium?: string;
  readonly dew_point_temperature?: string;
  readonly fog_area_fraction?: string;
  readonly precipitation_amount?: string;
  readonly precipitation_amount_max?: string;
  readonly precipitation_amount_min?: string;
  readonly probability_of_precipitation?: string;
  readonly probability_of_thunder?: string;
  readonly relative_humidity?: string;
  readonly ultraviolet_index_clear_sky?: string;
  readonly wind_from_direction?: string;
  readonly wind_speed?: string;
  readonly wind_speed_of_gust?: string;
  readonly wind_speed_percentile_10?: string;
  readonly wind_speed_percentile_90?: string;
};

export type Timesery = {
  readonly time: Date;
  readonly data: Data;
};

export type Data = {
  readonly instant: Instant;
  readonly next_12_hours?: Next12_Hours;
  readonly next_1_hours?: Next1_Hours;
  readonly next_6_hours?: Next6_Hours;
};

export type Instant = {
  readonly details: { [key: string]: number };
};

export type Next12_Hours = {
  readonly summary: Next12_HoursSummary;
  readonly details?: Next12_HoursDetails;
};

export type Next12_HoursDetails = {
  readonly probability_of_precipitation?: number;
};

export type Next12_HoursSummary = {
  readonly symbol_code: string;
  readonly symbol_confidence?: SymbolConfidence;
};

export type SymbolConfidence = "somewhat certain" | "uncertain" | "certain";

export type Next1_Hours = {
  readonly summary: Next1_HoursSummary;
  readonly details?: Next1_HoursDetails;
};

export type Next1_HoursDetails = {
  readonly precipitation_amount?: number;
  readonly precipitation_amount_max?: number;
  readonly precipitation_amount_min?: number;
  readonly probability_of_precipitation?: number;
  readonly probability_of_thunder?: number;
};

export type Next1_HoursSummary = {
  readonly symbol_code: string;
};

export type Next6_Hours = {
  readonly summary: Next1_HoursSummary;
  readonly details?: Next6_HoursDetails;
};

export type Next6_HoursDetails = {
  readonly air_temperature_max?: number;
  readonly air_temperature_min?: number;
  readonly precipitation_amount?: number;
  readonly precipitation_amount_max?: number;
  readonly precipitation_amount_min?: number;
  readonly probability_of_precipitation?: number;
};

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toRawYrData(json: string): RawYrData {
    return cast(JSON.parse(json), r("RawYrData"));
  }

  public static rawYrDataToJson(value: RawYrData): string {
    return JSON.stringify(uncast(value, r("RawYrData")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = "",
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  RawYrData: o(
    [
      { json: "type", js: "type", typ: "" },
      { json: "geometry", js: "geometry", typ: r("Geometry") },
      { json: "properties", js: "properties", typ: r("Properties") },
    ],
    false,
  ),
  Geometry: o(
    [
      { json: "type", js: "type", typ: "" },
      { json: "coordinates", js: "coordinates", typ: a(0) },
    ],
    false,
  ),
  Properties: o(
    [
      { json: "meta", js: "meta", typ: r("Meta") },
      { json: "timeseries", js: "timeseries", typ: a(r("Timesery")) },
    ],
    false,
  ),
  Meta: o(
    [
      { json: "updated_at", js: "updated_at", typ: Date },
      { json: "units", js: "units", typ: r("Units") },
    ],
    false,
  ),
  Units: o(
    [
      {
        json: "air_pressure_at_sea_level",
        js: "air_pressure_at_sea_level",
        typ: u(undefined, ""),
      },
      { json: "air_temperature", js: "air_temperature", typ: u(undefined, "") },
      { json: "air_temperature_max", js: "air_temperature_max", typ: u(undefined, "") },
      { json: "air_temperature_min", js: "air_temperature_min", typ: u(undefined, "") },
      {
        json: "air_temperature_percentile_10",
        js: "air_temperature_percentile_10",
        typ: u(undefined, ""),
      },
      {
        json: "air_temperature_percentile_90",
        js: "air_temperature_percentile_90",
        typ: u(undefined, ""),
      },
      { json: "cloud_area_fraction", js: "cloud_area_fraction", typ: u(undefined, "") },
      {
        json: "cloud_area_fraction_high",
        js: "cloud_area_fraction_high",
        typ: u(undefined, ""),
      },
      {
        json: "cloud_area_fraction_low",
        js: "cloud_area_fraction_low",
        typ: u(undefined, ""),
      },
      {
        json: "cloud_area_fraction_medium",
        js: "cloud_area_fraction_medium",
        typ: u(undefined, ""),
      },
      { json: "dew_point_temperature", js: "dew_point_temperature", typ: u(undefined, "") },
      { json: "fog_area_fraction", js: "fog_area_fraction", typ: u(undefined, "") },
      { json: "precipitation_amount", js: "precipitation_amount", typ: u(undefined, "") },
      {
        json: "precipitation_amount_max",
        js: "precipitation_amount_max",
        typ: u(undefined, ""),
      },
      {
        json: "precipitation_amount_min",
        js: "precipitation_amount_min",
        typ: u(undefined, ""),
      },
      {
        json: "probability_of_precipitation",
        js: "probability_of_precipitation",
        typ: u(undefined, ""),
      },
      { json: "probability_of_thunder", js: "probability_of_thunder", typ: u(undefined, "") },
      { json: "relative_humidity", js: "relative_humidity", typ: u(undefined, "") },
      {
        json: "ultraviolet_index_clear_sky",
        js: "ultraviolet_index_clear_sky",
        typ: u(undefined, ""),
      },
      { json: "wind_from_direction", js: "wind_from_direction", typ: u(undefined, "") },
      { json: "wind_speed", js: "wind_speed", typ: u(undefined, "") },
      { json: "wind_speed_of_gust", js: "wind_speed_of_gust", typ: u(undefined, "") },
      {
        json: "wind_speed_percentile_10",
        js: "wind_speed_percentile_10",
        typ: u(undefined, ""),
      },
      {
        json: "wind_speed_percentile_90",
        js: "wind_speed_percentile_90",
        typ: u(undefined, ""),
      },
    ],
    false,
  ),
  Timesery: o(
    [
      { json: "time", js: "time", typ: Date },
      { json: "data", js: "data", typ: r("Data") },
    ],
    false,
  ),
  Data: o(
    [
      { json: "instant", js: "instant", typ: r("Instant") },
      {
        json: "next_12_hours",
        js: "next_12_hours",
        typ: u(undefined, r("Next12_Hours")),
      },
      {
        json: "next_1_hours",
        js: "next_1_hours",
        typ: u(undefined, r("Next1_Hours")),
      },
      {
        json: "next_6_hours",
        js: "next_6_hours",
        typ: u(undefined, r("Next6_Hours")),
      },
    ],
    false,
  ),
  Instant: o([{ json: "details", js: "details", typ: m(3.14) }], false),
  Next12_Hours: o(
    [
      { json: "summary", js: "summary", typ: r("Next12_HoursSummary") },
      { json: "details", js: "details", typ: u(undefined, r("Next12_HoursDetails")) },
    ],
    false,
  ),
  Next12_HoursDetails: o(
    [
      {
        json: "probability_of_precipitation",
        js: "probability_of_precipitation",
        typ: u(undefined, 3.14),
      },
    ],
    3.14,
  ),
  Next12_HoursSummary: o(
    [
      { json: "symbol_code", js: "symbol_code", typ: "" },
      {
        json: "symbol_confidence",
        js: "symbol_confidence",
        typ: r("SymbolConfidence"),
      },
    ],
    false,
  ),
  Next1_Hours: o(
    [
      { json: "summary", js: "summary", typ: r("Next1_HoursSummary") },
      { json: "details", js: "details", typ: u(undefined, r("Next1_HoursDetails")) },
    ],
    false,
  ),
  Next1_HoursDetails: o(
    [
      { json: "precipitation_amount", js: "precipitation_amount", typ: u(undefined, 3.14) },
      {
        json: "precipitation_amount_max",
        js: "precipitation_amount_max",
        typ: u(undefined, 3.14),
      },
      {
        json: "precipitation_amount_min",
        js: "precipitation_amount_min",
        typ: u(undefined, 3.14),
      },
      {
        json: "probability_of_precipitation",
        js: "probability_of_precipitation",
        typ: u(undefined, 3.14),
      },
      {
        json: "probability_of_thunder",
        js: "probability_of_thunder",
        typ: u(undefined, 3.14),
      },
    ],
    3.14,
  ),
  Next1_HoursSummary: o(
    [{ json: "symbol_code", js: "symbol_code", typ: "" }],
    false,
  ),
  Next6_Hours: o(
    [
      { json: "summary", js: "summary", typ: r("Next1_HoursSummary") },
      { json: "details", js: "details", typ: u(undefined, r("Next6_HoursDetails")) },
    ],
    false,
  ),
  Next6_HoursDetails: o(
    [
      { json: "air_temperature_max", js: "air_temperature_max", typ: u(undefined, 3.14) },
      { json: "air_temperature_min", js: "air_temperature_min", typ: u(undefined, 3.14) },
      { json: "precipitation_amount", js: "precipitation_amount", typ: u(undefined, 3.14) },
      {
        json: "precipitation_amount_max",
        js: "precipitation_amount_max",
        typ: u(undefined, 3.14),
      },
      {
        json: "precipitation_amount_min",
        js: "precipitation_amount_min",
        typ: u(undefined, 3.14),
      },
      {
        json: "probability_of_precipitation",
        js: "probability_of_precipitation",
        typ: u(undefined, 3.14),
      },
    ],
    3.14,
  ),
  SymbolConfidence: ["certain", "somewhat certain", "uncertain"],
};
