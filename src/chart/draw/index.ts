import type { CanvasRenderingContext2D } from "skia-canvas";
import { createCanvas, type Canvas } from "@napi-rs/canvas";

import type { Dimensions, Styles, YrTSData } from "../data";
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
  const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  dev && drawTimeTicks(ctx, weatherData, dims, styles);
  drawRain(ctx, weatherData, dims, styles);
  drawTemps(ctx, weatherData, dims, styles);

  await drawTransitInfo(ctx, transitData, dims);

  return canvas;
}

export function createEpdBuffer(
  chart: Canvas,
  dimensions: Dimensions,
): Uint8Array {
  const { width, height } = dimensions;
  const context = chart.getContext("2d");
  const imageData = context.getImageData(0, 0, width, height);
  const rgbaData = imageData.data;

  // The EPD buffer size should be width * height / 4 (2 pixels per byte)
  const epdBuffer = new Uint8Array((width * height) / 4);

  let bufferIndex = 0;
  for (let i = 0; i < width * height; i += 8) {
    let temp3 = 0;
    for (let j = 0; j < 2; j++) {
      for (let k = 0; k < 2; k++) {
        const pixelIndex = i + j * 4 + k * 2;
        const r = rgbaData[pixelIndex * 4];
        const g = rgbaData[pixelIndex * 4 + 1];
        const b = rgbaData[pixelIndex * 4 + 2];

        // Convert RGB to grayscale
        const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

        // Map grayscale to 4 levels
        let temp2;
        if (gray >= 192)
          temp2 = 0xc0; // White
        else if (gray >= 128)
          temp2 = 0x80; // Light gray
        else if (gray >= 64)
          temp2 = 0x40; // Dark gray
        else temp2 = 0x00; // Black

        if (temp2 === 0xc0) temp3 |= 0x03;
        else if (temp2 === 0x80) temp3 |= 0x02;
        else if (temp2 === 0x40) temp3 |= 0x01;
        // If temp2 is 0x00, we don't need to do anything as temp3 is already 0

        if (j !== 1 || k !== 1) {
          temp3 <<= 2;
        }
      }
    }
    epdBuffer[bufferIndex++] = temp3;
  }

  return epdBuffer;
}
