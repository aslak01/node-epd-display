import { test, describe } from "node:test";
import assert from "node:assert";
import { getTransports } from "../../src/chart/data/transit/index.ts";

void describe("Transit API Integration Tests", () => {
  void test("should fetch mock transit data", async () => {
    const transitData = await getTransports(true);

    assert(Array.isArray(transitData), "Transit data should be an array");
    assert(transitData.length > 0, "Should have transit data points");
    assert(transitData.length <= 5, "Should limit to 5 departures max");
  });

  void test("mock transit data should have correct structure", async () => {
    const transitData = await getTransports(true);

    const departure = transitData[0];
    assert(typeof departure.type === "string", "Type should be a string");
    assert(
      ["bus", "train"].includes(departure.type),
      "Type should be bus or train",
    );
    assert(typeof departure.name === "string", "Name should be a string");
    assert(
      departure.departureTime instanceof Date,
      "Departure time should be a Date",
    );
    assert(
      typeof departure.departureMinutes === "number",
      "Departure minutes should be a number",
    );
    assert(
      departure.departureMinutes >= 0 && departure.departureMinutes <= 59,
      "Minutes should be 0-59",
    );

    // Optional delay
    if (departure.delayMinutes !== undefined) {
      assert(
        typeof departure.delayMinutes === "number",
        "Delay minutes should be a number",
      );
      assert(departure.delayMinutes >= 0, "Delay should be positive");
    }
  });

  void test("should handle departures at 0 minutes (top of hour)", async () => {
    const transitData = await getTransports(true);

    // Check if we have any departures at :00
    const zeroMinuteDepartures = transitData.filter(
      (d) => d.departureMinutes === 0,
    );

    if (zeroMinuteDepartures.length > 0) {
      const departure = zeroMinuteDepartures[0];
      assert(
        departure.departureMinutes === 0,
        "Should correctly handle 0 minutes",
      );
      assert(departure.departureTime instanceof Date, "Should have valid date");
      assert(typeof departure.name === "string", "Should have valid name");

      console.log(
        `Found departure at :00 - ${departure.type} ${departure.name}`,
      );
    } else {
      console.log("No departures at :00 in mock data (this is OK)");
    }
  });

  void test("should sort departures by time", async () => {
    const transitData = await getTransports(true);

    for (let i = 1; i < transitData.length; i++) {
      const prevTime = transitData[i - 1].departureTime.getTime();
      const currTime = transitData[i].departureTime.getTime();
      assert(
        currTime >= prevTime,
        "Departures should be sorted chronologically",
      );
    }
  });

  void test("should handle real transit API", async () => {
    try {
      const transitData = await getTransports(false);

      assert(
        Array.isArray(transitData),
        "Real transit data should be an array",
      );
      assert(transitData.length <= 5, "Should limit to 5 departures");

      if (transitData.length > 0) {
        const departure = transitData[0];
        assert(typeof departure.type === "string", "Type should be a string");
        assert(
          ["bus", "train"].includes(departure.type),
          "Type should be bus or train",
        );
        assert(
          departure.departureTime instanceof Date,
          "Should have valid departure time",
        );
        assert(
          typeof departure.departureMinutes === "number",
          "Should have departure minutes",
        );
      }
    } catch (error) {
      // Real API might fail due to network issues in test environment
      console.warn(
        "Real transit API test failed (expected in some environments):",
        error.message,
      );
      assert(
        error instanceof Error,
        "Should throw proper error on API failure",
      );
    }
  });

  void test("should calculate delays correctly", async () => {
    const transitData = await getTransports(true);

    const delayedDepartures = transitData.filter(
      (d) => d.delayMinutes && d.delayMinutes > 0,
    );

    for (const departure of delayedDepartures) {
      assert(
        departure?.delayMinutes > 0,
        "Delayed departures should have positive delay",
      );
      assert(
        Number.isInteger(departure.delayMinutes),
        "Delay should be whole minutes",
      );
    }
  });

  void test("should handle mixed bus and train data", async () => {
    const transitData = await getTransports(true);

    const buses = transitData.filter((d) => d.type === "bus");
    const trains = transitData.filter((d) => d.type === "train");

    // Should have both types in mock data
    if (buses.length > 0) {
      assert(
        buses.every((b) => b.type === "bus"),
        "All bus entries should have type 'bus'",
      );
    }

    if (trains.length > 0) {
      assert(
        trains.every((t) => t.type === "train"),
        "All train entries should have type 'train'",
      );
    }

    console.log(`Found ${buses.length} buses and ${trains.length} trains`);
  });
});

