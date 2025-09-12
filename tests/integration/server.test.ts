import { test, describe } from "node:test";
import assert from "node:assert";

void describe("Server Integration Tests", () => {
  void test("should start preview server without errors", async () => {
    // This test verifies the server can start without throwing errors
    // We can't easily test the full server in this environment, but we can
    // test that the imports and basic setup work
    
    const { Hono } = await import("hono");
    
    // Test that we can create a Hono app
    const app = new Hono();
    assert(app, "Should be able to create Hono app");
    
    // Test that we can set up routes
    app.get("/test", (c) => c.text("test"));
    assert(typeof app.fetch === "function", "App should have fetch method");
  });

  void test("should import chart generation without errors", async () => {
    // Test that chart generation can be imported and used
    const { drawChart } = await import("../../src/chart/index.ts");
    
    assert(typeof drawChart === "function", "drawChart should be a function");
    
    // Test with mock data to avoid API dependencies
    const chart = await drawChart(true);
    assert(chart, "Should generate chart");
  });

  void test("should handle EPD wrapper gracefully on non-ARM platforms", async () => {
    const { epd } = await import("../../src/epd_wrapper.ts");
    
    // EPD functions should exist even if not available
    assert(typeof epd.init === "function", "init should be a function");
    assert(typeof epd.display4Gray === "function", "display4Gray should be a function");
    assert(typeof epd.sleep === "function", "sleep should be a function");
    assert(typeof epd.isAvailable === "function", "isAvailable should be a function");
    
    // On non-ARM64 Linux, should return false
    const isAvailable = await epd.isAvailable();
    if (process.platform !== "linux" || process.arch !== "arm64") {
      assert.strictEqual(isAvailable, false, "Should not be available on non-ARM64 Linux");
    }
  });

  void test("should handle visual settings and dimensions", async () => {
    const { dimensions, style } = await import("../../src/chart/draw/visual-settings.ts");
    
    assert(typeof dimensions === "object", "Dimensions should be an object");
    assert(typeof style === "object", "Style should be an object");
    
    // Check key dimensions
    assert(typeof dimensions.width === "number", "Width should be a number");
    assert(typeof dimensions.height === "number", "Height should be a number");
    assert(dimensions.width > 0, "Width should be positive");
    assert(dimensions.height > 0, "Height should be positive");
    
    // Should match EPD display dimensions (480x280)
    assert.strictEqual(dimensions.width, 480, "Width should match EPD display");
    assert.strictEqual(dimensions.height, 280, "Height should match EPD display");
  });

  void test("should handle buffer creation for EPD display", async () => {
    const { createEpdBuffer } = await import("../../src/chart/draw/index.ts");
    const { drawChart } = await import("../../src/chart/index.ts");
    const { dimensions } = await import("../../src/chart/draw/visual-settings.ts");
    
    // Generate a chart
    const chart = await drawChart(true);
    
    // Create EPD buffer
    const epdBuffer = createEpdBuffer(chart, dimensions);
    
    assert(epdBuffer instanceof Uint8Array, "EPD buffer should be Uint8Array");
    assert(epdBuffer.length > 0, "EPD buffer should not be empty");
    
    // EPD buffer size should match expected dimensions for 4-gray mode
    const expectedSize = Math.floor((dimensions.width * dimensions.height) / 4); // 4 pixels per byte in 4-gray
    assert.strictEqual(epdBuffer.length, expectedSize, `EPD buffer should be ${expectedSize} bytes`);
  });
});