import {
  Convert,
  type EstimatedCall,
  type RawEnturData,
} from "./enturQuicktype.ts";

const enturQuery = `{
stopPlaces(ids: ["NSR:StopPlace:60737", "NSR:StopPlace:3272"]) {
    name
    id
    estimatedCalls {
      destinationDisplay {
        frontText
      }
      datedServiceJourney {
        journeyPattern {
          line {
            publicCode
          }
        }
      }
      aimedDepartureTime
      expectedDepartureTime
    }
  }
}`;

async function fetchEnturGql(query: string): Promise<string> {
  try {
    const requestOptions = {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
        "ET-Client-Name": "personlig-infoskjerm",
      }),
      body: JSON.stringify({ query }),
    };
    const res = await fetch(
      "https://api.entur.io/journey-planner/v3/graphql",
      requestOptions,
    );
    if (!res.ok) {
      throw new Error(`entur broke: ${res.statusText}`);
    }
    return await res.text();
  } catch (error) {
    throw new Error(`entur broke: ${JSON.stringify(error)}`);
  }
}

function validateEnturResponse(data: string): RawEnturData {
  try {
    const rawEnturData = Convert.toRawEnturData(data);
    return rawEnturData;
  } catch (error) {
    throw new Error(`entur data validation error: ${JSON.stringify(error)}`);
  }
}

import { mockTransportData } from "./mock.ts";

export async function getTransports(mock = false): Promise<ParsedDeparture[]> {
  if (mock) return mockTransportData.slice(0, 5);
  const rawData = await fetchEnturGql(enturQuery);
  if (!rawData) {
    throw new Error("could not fetch Entur data.");
  }
  const validatedData = validateEnturResponse(rawData);
  const parsedData = parseEnturResponse(validatedData);
  if (!parsedData) {
    throw new Error("Could not parse Entur data.");
  }
  return parsedData;
}

function parseEnturResponse(input: RawEnturData) {
  const stations = input.data.stopPlaces;
  const trainSt = stations.find((s) => s.name === "Bondivann stasjon");
  const busSt = stations.find((s) => s.name === "Rønningen skole");
  if (!trainSt || !busSt) return;
  const trainDepartures = trainSt.estimatedCalls
    .filter((d) => d.destinationDisplay.frontText === "Lillestrøm")
    .map((d) => parseDeparture(d, "train"));
  const busDepartures = busSt.estimatedCalls
    .filter((d) => d.destinationDisplay.frontText === "Asker")
    .map((d) => parseDeparture(d, "bus"));
  const sortedParsedDepartures = [
    ...trainDepartures,
    ...busDepartures,
  ].toSorted((a, b) => a.departureTime.getTime() - b.departureTime.getTime());

  return sortedParsedDepartures.slice(0, 5);
}

type DepartureType = "bus" | "train";

export type ParsedDeparture = {
  type: DepartureType;
  name: string;
  departureTime: Date;
  departureMinutes: number;
  delayMinutes?: number;
};

function parseDeparture(
  departure: EstimatedCall,
  type: DepartureType,
): ParsedDeparture {
  const aimedDepDt = new Date(departure.aimedDepartureTime);
  const expectedDepDt = new Date(departure.expectedDepartureTime);
  const delta = expectedDepDt.getTime() - aimedDepDt.getTime();
  const departureMinutes = expectedDepDt.getMinutes();

  const result: ParsedDeparture = {
    type,
    name: departure.datedServiceJourney.journeyPattern.line.publicCode,
    departureTime: expectedDepDt,
    departureMinutes,
  };

  // one minute = 60000 milliseconds
  if (delta > 60000) {
    result.delayMinutes = Math.floor(delta / 60000);
  }

  return result;
}
