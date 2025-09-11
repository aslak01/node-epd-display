import type { ParsedDeparture } from "./index.ts";

export const mockTransportData: ParsedDeparture[] = [
  {
    type: "train",
    name: "L1",
    departureTime: new Date("2024-09-15T19:02:56.000Z"),
    departureMinutes: 10,
    delayMinutes: 10,
  },
  {
    type: "bus",
    name: "281",
    departureTime: new Date("2024-09-15T19:05:00.000Z"),
    departureMinutes: 0,
  },
  {
    type: "train",
    name: "L1",
    departureTime: new Date("2024-09-15T19:31:00.000Z"),
    departureMinutes: 33,
    delayMinutes: 2,
  },
  {
    type: "bus",
    name: "281",
    departureTime: new Date("2024-09-15T19:35:00.000Z"),
    departureMinutes: 35,
  },
  {
    type: "train",
    name: "L1",
    departureTime: new Date("2024-09-15T20:01:00.000Z"),
    departureMinutes: 5,
    delayMinutes: 4,
  },
  {
    type: "bus",
    name: "281",
    departureTime: new Date("2024-09-15T20:05:00.000Z"),
    departureMinutes: 5,
  },
];
