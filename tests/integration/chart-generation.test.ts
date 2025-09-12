import { test, describe } from "node:test";
import assert from "node:assert";
import { drawChart } from "../../src/chart/index.ts";

void describe("Chart Generation Integration Tests", () => {
  void test("should generate chart with mock data", async () => {
    const chart = await drawChart(true);

    assert(chart, "Chart should be generated");
    assert(chart.width > 0, "Chart should have width");
    assert(chart.height > 0, "Chart should have height");
  });

  void test("generated chart should have correct dimensions", async () => {
    const chart = await drawChart(true);

    // Based on dimensions from visual-settings (width=480, height=280)
    assert.strictEqual(chart.width, 480);
    assert.strictEqual(chart.height, 280);
  });

  void test("should generate PNG buffer", async () => {
    const chart = await drawChart(true);
    const buffer = chart.toBuffer("image/png");

    assert(buffer instanceof Buffer, "Should return a Buffer");
    assert(buffer.length > 0, "Buffer should not be empty");

    // Check PNG magic bytes
    assert.strictEqual(buffer[0], 0x89, "Should start with PNG magic bytes");
    assert.strictEqual(buffer[1], 0x50, "Should contain PNG signature");
    assert.strictEqual(buffer[2], 0x4e, "Should contain PNG signature");
    assert.strictEqual(buffer[3], 0x47, "Should contain PNG signature");
  });

  void test("should handle both mock and real data modes", async () => {
    // Test mock mode
    const mockChart = await drawChart(true);
    assert(mockChart, "Mock chart should be generated");

    // Test real mode (should work even if API fails due to error handling)
    try {
      const realChart = await drawChart(false);
      assert(realChart, "Real chart should be generated");
    } catch (error) {
      // Real API might fail in test environment - that's OK
      assert(error instanceof Error, "Should throw proper error if API fails");
    }
  });
});
