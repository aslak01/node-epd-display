import type { CanvasRenderingContext2D } from "skia-canvas";
import { createCanvas, type Canvas } from "@napi-rs/canvas";

import type { Dimensions, Styles, YrTSData } from "../data";
import { drawRain, drawTemps, drawTimeTicks } from "./weather";
import { drawTransitInfo } from "./transit";

import { multiplyNumberValues } from "@/utils";
import type { ParsedDeparture } from "@/chart/data/transit";

const dev = process.env.NODE_ENV === "development";

const createChart = async (
  weatherData: YrTSData[],
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
  style: Styles,
): Promise<Canvas> => {
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
};

export async function createChartBuffer(
  weatherData: YrTSData[],
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
  style: Styles,
): Promise<Buffer> {
  const chart = await createChart(weatherData, transitData, dimensions, style);
  return chart.toBuffer("image/png");
}

export async function createEpdBuffer(
  weatherData: YrTSData[],
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
  style: Styles,
) {
  const { width, height } = dimensions;
  const chart = await createChart(weatherData, transitData, dimensions, style);
  const context = chart.getContext("2d");
  const grayData = context.getImageData(0, 0, width, height);
  const grayBuffer = new Uint8Array(width * height);

  for (let i = 0, j = 0; i < grayData.data.length; i += 4, j++) {
    const r = grayData.data[i];
    const g = grayData.data[i + 1];
    const b = grayData.data[i + 2];
    grayBuffer[j] = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
  }

  // Step 3: Convert grayscale to 4-bit (16 levels) for EPD
  const epdBuffer = new Uint8Array(Math.ceil((width * height) / 2));
  for (let i = 0, j = 0; i < grayBuffer.length; i += 2, j++) {
    const pixel1 = Math.floor(grayBuffer[i] / 16); // Convert to 4-bit (0-15)
    const pixel2 = Math.floor(grayBuffer[i + 1] / 16);
    epdBuffer[j] = (pixel1 << 4) | pixel2; // Combine two 4-bit values into one byte
  }

  return epdBuffer;
}
