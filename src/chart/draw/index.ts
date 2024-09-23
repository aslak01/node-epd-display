import type { CanvasRenderingContext2D } from "skia-canvas";
import { createCanvas, type Canvas } from "@napi-rs/canvas";
import { writeFile } from "fs/promises";
import { createWriteStream } from "fs";

import type { Dimensions, Styles, YrTSData } from "../data";
import { drawRain } from "./weather/rain";
import { drawTemps } from "./weather/temps";
import { drawTimeTicks } from "./weather/time";
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
  // const ratio = dev ? 1 : 1;
  // const dims = multiplyNumberValues(dimensions, ratio);
  // const styles = multiplyNumberValues(style, ratio);
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

const createChartBuffer = async (
  weatherData: YrTSData[],
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
  style: Styles,
): Promise<Buffer> => {
  const chart = await createChart(weatherData, transitData, dimensions, style);
  const buffer = chart.toBuffer("image/png");

  return buffer;
};

const saveBufferToPng = async (
  buffer: Buffer,
  filePath: string,
): Promise<void> => {
  try {
    await writeFile(filePath, buffer);
    console.log(`PNG file saved successfully to ${filePath}`);
  } catch (error) {
    console.error("Error saving PNG file:", error);
  }
};

const createAndSaveChart = (
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
  outputPath: string,
) => {
  const chart = createChart(data, dimensions, style);
  const out = createWriteStream(outputPath);
  const stream = chart.createPNGStream();
  stream.pipe(out);
  return new Promise((resolve, reject) => {
    out.on("finish", resolve);
    out.on("error", reject);
  });
};

export { createChartBuffer, saveBufferToPng };
