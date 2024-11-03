import type { CanvasRenderingContext2D } from "skia-canvas";
import { createCanvas, type Canvas } from "@napi-rs/canvas";

import type { YrTSData } from "../data";
import type { Dimensions, Styles } from "./visual-settings";

import { drawRain, drawTemps, drawTimeTicks } from "./weather";
import { drawTransitInfo } from "./transit";

import type { ParsedDeparture } from "@/chart/data/transit";

const dev = process.env.NODE_ENV === "development";

export async function createChart(
  weatherData: YrTSData[],
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
  style: Styles,
): Promise<Canvas> {
  const dims = dimensions;
  const styles = style;

  const canvas = createCanvas(dims.width, dims.height);

  // overwriting native canvas types
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  dev && drawTimeTicks(ctx, weatherData, dims, styles);
  drawRain(ctx, weatherData, dims, styles);
  drawTemps(ctx, weatherData, dims, styles);

  await drawTransitInfo(ctx, transitData, dims, styles);

  return canvas;
}

export function createEpdBuffer(
  chart: Canvas,
  dimensions: Dimensions,
): Uint8Array {
  const { width, height } = dimensions;

  // Create a new canvas for the rotated image
  const rotatedCanvas = createCanvas(height, width);
  const rotatedContext = rotatedCanvas.getContext("2d");

  // Rotate 90 degrees counterclockwise
  rotatedContext.translate(0, width);
  rotatedContext.rotate(-Math.PI / 2);
  rotatedContext.drawImage(chart, 0, 0);

  const imageData = rotatedContext.getImageData(0, 0, height, width);
  const rgbaData = imageData.data;

  const bufferSize = Math.floor((width * height) / 4);
  const epdBuffer = new Uint8Array(bufferSize);

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x += 4) {
      const bufferIndex = Math.floor((y * height + x) / 4);
      let value = 0;

      for (let i = 0; i < 4; i++) {
        const pixelIndex = (y * height + x + i) * 4;
        const r = rgbaData[pixelIndex];
        const g = rgbaData[pixelIndex + 1];
        const b = rgbaData[pixelIndex + 2];

        // Convert RGB to grayscale
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        // Map grayscale to 2 bits
        let pixelValue;
        if (gray >= 192)
          pixelValue = 3; // White
        else if (gray >= 128)
          pixelValue = 2; // Light gray
        else if (gray >= 64)
          pixelValue = 1; // Dark gray
        else pixelValue = 0; // Black

        value |= pixelValue << (6 - i * 2);
      }

      epdBuffer[bufferIndex] = value;
    }
  }

  return epdBuffer;
}

export function createEpdTestBuffer(dimensions: Dimensions): Uint8Array {
  const { width, height } = dimensions;
  const bufferSize = Math.floor((width * height) / 4);
  const epdBuffer = new Uint8Array(bufferSize);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x += 4) {
      const bufferIndex = Math.floor((y * width + x) / 4);
      let value = 0;

      // Create a more distinctive pattern:
      // - Top-left quarter: vertical stripes
      // - Top-right quarter: horizontal stripes
      // - Bottom-left quarter: diagonal stripes
      // - Bottom-right quarter: checkerboard

      if (y < height / 2) {
        if (x < width / 2) {
          // Vertical stripes
          value = x % 8 < 4 ? 0xff : 0x00;
        } else {
          // Horizontal stripes
          value = y % 8 < 4 ? 0xff : 0x00;
        }
      } else {
        if (x < width / 2) {
          // Diagonal stripes
          value = (x + y) % 8 < 4 ? 0xff : 0x00;
        } else {
          // Checkerboard
          value = (x / 4 + y) % 2 === 0 ? 0xff : 0x00;
        }
      }

      epdBuffer[bufferIndex] = value;
    }
  }

  return epdBuffer;
}
