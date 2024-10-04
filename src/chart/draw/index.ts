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

  const rotatedCanvas = createCanvas(height, width);
  const rotatedContext = rotatedCanvas.getContext("2d");

  // Rotate 90 degrees clockwise
  rotatedContext.translate(height, 0);
  rotatedContext.rotate(Math.PI / 2);
  rotatedContext.drawImage(chart, 0, 0);

  const rotatedImageData = rotatedContext.getImageData(0, 0, height, width);
  const rgbaData = rotatedImageData.data;

  // Convert RGBA to 4-bit grayscale
  const epdBuffer = new Uint8Array(Math.ceil((height * width) / 2));
  let bufferIndex = 0;

  for (let y = 0; y < width; y++) {
    for (let x = 0; x < height; x++) {
      const i = (y * height + x) * 4; // RGBA data index
      const gray = Math.round(
        0.299 * rgbaData[i] + 0.587 * rgbaData[i + 1] + 0.114 * rgbaData[i + 2],
      );
      const pixel = Math.floor(gray / 16); // Convert to 4-bit (0-15)

      if (x % 2 === 0) {
        epdBuffer[bufferIndex] = pixel << 4;
      } else {
        epdBuffer[bufferIndex] |= pixel;
        bufferIndex++;
      }
    }

    // Ensure we move to the next byte at the end of each row if height is odd
    if (height % 2 !== 0) {
      bufferIndex++;
    }
  }

  return epdBuffer;
}
