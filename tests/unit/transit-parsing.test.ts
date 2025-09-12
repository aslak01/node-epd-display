import { test, describe } from "node:test";
import assert from "node:assert";
import { mockTransportData } from "../../src/chart/data/transit/mock.ts";

void describe("Transit Data Parsing Unit Tests", () => {
  void test("mock transit data should have valid structure", () => {
    assert(Array.isArray(mockTransportData), "Mock data should be an array");
    assert(mockTransportData.length > 0, "Mock data should not be empty");
    
    for (const departure of mockTransportData) {
      assert(typeof departure.type === "string", "Type should be string");
      assert(["bus", "train"].includes(departure.type), "Type should be bus or train");
      assert(typeof departure.name === "string", "Name should be string");
      assert(departure.departureTime instanceof Date, "Departure time should be Date");
      assert(typeof departure.departureMinutes === "number", "Departure minutes should be number");
      assert(departure.departureMinutes >= 0 && departure.departureMinutes <= 59, "Minutes should be 0-59");
    }
  });

  void test("should include departure at 0 minutes (testing nullish bug)", () => {
    const zeroMinuteDepartures = mockTransportData.filter(d => d.departureMinutes === 0);
    
    assert(zeroMinuteDepartures.length > 0, "Should have at least one departure at :00");
    
    const zeroDeparture = zeroMinuteDepartures[0];
    assert.strictEqual(zeroDeparture.departureMinutes, 0, "Should have exactly 0 minutes");
    assert(zeroDeparture.departureTime instanceof Date, "Should have valid date");
    assert(["bus", "train"].includes(zeroDeparture.type), "Should have valid type");
  });

  void test("should handle delay information correctly", () => {
    const delayedDepartures = mockTransportData.filter(d => d.delayMinutes);
    
    assert(delayedDepartures.length > 0, "Should have some delayed departures in mock data");
    
    for (const departure of delayedDepartures) {
      assert(typeof departure.delayMinutes === "number", "Delay should be a number");
      assert(departure.delayMinutes > 0, "Delay should be positive");
      assert(Number.isInteger(departure.delayMinutes), "Delay should be whole minutes");
    }
  });

  void test("should handle no delay information", () => {
    const onTimeDepartures = mockTransportData.filter(d => !d.delayMinutes);
    
    if (onTimeDepartures.length > 0) {
      for (const departure of onTimeDepartures) {
        assert(departure.delayMinutes === undefined, "No delay should be undefined");
      }
    }
  });

  void test("should have mixed transport types", () => {
    const buses = mockTransportData.filter(d => d.type === "bus");
    const trains = mockTransportData.filter(d => d.type === "train");
    
    assert(buses.length > 0, "Should have bus departures");
    assert(trains.length > 0, "Should have train departures");
    
    // Check bus data
    for (const bus of buses) {
      assert.strictEqual(bus.type, "bus", "Bus type should be 'bus'");
      assert(typeof bus.name === "string", "Bus should have route name");
    }
    
    // Check train data
    for (const train of trains) {
      assert.strictEqual(train.type, "train", "Train type should be 'train'");
      assert(typeof train.name === "string", "Train should have line name");
    }
  });

  void test("departure times should be chronological", () => {
    // Mock data should be pre-sorted by departure time
    for (let i = 1; i < mockTransportData.length; i++) {
      const prevTime = mockTransportData[i - 1].departureTime.getTime();
      const currTime = mockTransportData[i].departureTime.getTime();
      assert(currTime >= prevTime, "Departures should be in chronological order");
    }
  });

  void test("should validate departure minutes represent time until departure", () => {
    // departureMinutes represents minutes until departure, not absolute time
    for (const departure of mockTransportData) {
      assert(typeof departure.departureMinutes === "number", "departureMinutes should be a number");
      assert(departure.departureMinutes >= 0, "departureMinutes should be non-negative");
      assert(departure.departureTime instanceof Date, "departureTime should be a Date");
    }
  });

  void test("should handle various delay scenarios", () => {
    // Test different delay ranges that affect color classification
    const delays = mockTransportData
      .filter(d => d.delayMinutes)
      .map(d => d.delayMinutes);
    
    if (delays.length > 0) {
      // Should have variety of delays for proper color testing
      const hasSmallDelay = delays.some(d => d > 0 && d < 5);
      const hasMediumDelay = delays.some(d => d >= 5 && d < 10);
      const hasLargeDelay = delays.some(d => d >= 10);
      
      // At least one type should be present
      assert(hasSmallDelay || hasMediumDelay || hasLargeDelay, 
        "Should have delays for color classification testing");
    }
  });
});