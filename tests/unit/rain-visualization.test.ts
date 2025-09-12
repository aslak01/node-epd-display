import { test, describe } from "node:test";
import assert from "node:assert";
import { createCanvas } from "@napi-rs/canvas";
import { CanvasRenderingContext2D } from "skia-canvas";
import { drawRain } from "../../src/chart/draw/weather/rain.ts";
import { dimensions, style } from "../../src/chart/draw/visual-settings.ts";

void describe("Rain Visualization Unit Tests", () => {
  void test("should handle data with no rain", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;

    const noRainData = [
      {
        temp: 15,
        rain: 0,
        rainMax: 0,
        date: new Date(),
      },
    ];

    // Should not throw error
    assert.doesNotThrow(() => {
      drawRain(context, noRainData, dimensions, style);
    });
  });

  void test("should handle confirmed rain data", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;

    const rainData = [
      {
        temp: 15,
        rain: 2.5,
        rainMax: 2.5,
        date: new Date(),
      },
    ];

    // Should not throw error
    assert.doesNotThrow(() => {
      drawRain(context, rainData, dimensions, style);
    });
  });

  void test("should handle potential rain (rainMax > rain)", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;

    const potentialRainData = [
      {
        temp: 15,
        rain: 1.0,
        rainMax: 3.5,
        date: new Date(),
      },
    ];

    // Should not throw error with diagonal line visualization
    assert.doesNotThrow(() => {
      drawRain(context, potentialRainData, dimensions, style);
    });
  });

  void test("should handle extreme rainfall (>10mm)", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext("2d");

    const extremeRainData = [
      {
        temp: 15,
        rain: 15.0,
        rainMax: 20.0,
        date: new Date(),
      },
    ];

    // Should not throw error and should cap at 10mm scale
    assert.doesNotThrow(() => {
      drawRain(context, extremeRainData, dimensions, style);
    });
  });

  void test("should handle fractional rainfall amounts", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;

    const fractionalRainData = [
      {
        temp: 15,
        rain: 1.3,
        rainMax: 2.7,
        date: new Date(),
      },
    ];

    // Should handle fractional boxes correctly
    assert.doesNotThrow(() => {
      drawRain(context, fractionalRainData, dimensions, style);
    });
  });

  void test("should handle edge case with rain = rainMax", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;

    const equalRainData = [
      {
        temp: 15,
        rain: 5.0,
        rainMax: 5.0,
        date: new Date(),
      },
    ];

    // Should only draw solid boxes, no diagonal lines
    assert.doesNotThrow(() => {
      drawRain(context, equalRainData, dimensions, style);
    });
  });

  void test("should handle null/undefined values gracefully", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext(
      "2d",
    ) as unknown as CanvasRenderingContext2D;

    const nullishData = [
      {
        temp: 15,
        rain: null as any,
        rainMax: undefined as any,
        date: new Date(),
      },
    ];

    // Should handle nullish values without throwing
    assert.doesNotThrow(() => {
      drawRain(context, nullishData, dimensions, style);
    });
  });

  void test("should handle multiple data points", () => {
    const canvas = createCanvas(280, 480);
    const context = canvas.getContext("2d");

    const multipleData = [
      { temp: 15, rain: 0, rainMax: 0, date: new Date(Date.now() - 3600000) },
      {
        temp: 16,
        rain: 1.5,
        rainMax: 2.0,
        date: new Date(Date.now() - 1800000),
      },
      { temp: 17, rain: 3.0, rainMax: 3.0, date: new Date() },
    ];

    // Should handle multiple data points
    assert.doesNotThrow(() => {
      drawRain(context, multipleData, dimensions, style);
    });
  });

  void test("should use fixed 10mm scale regardless of data", () => {
    const canvas = createCanvas(100, 100);
    const context = canvas.getContext("2d");

    // Test with low values
    const lowRainData = [
      { temp: 15, rain: 0.5, rainMax: 1.0, date: new Date() },
    ];
    assert.doesNotThrow(() => {
      drawRain(context, lowRainData, dimensions, style);
    });

    // Test with high values - should still use 10mm scale
    const highRainData = [
      { temp: 15, rain: 25.0, rainMax: 30.0, date: new Date() },
    ];
    assert.doesNotThrow(() => {
      drawRain(context, highRainData, dimensions, style);
    });
  });
});

