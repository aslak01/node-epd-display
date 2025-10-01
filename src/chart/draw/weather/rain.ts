// TODO: find out why the library doesn't implement this
import { type SKRSContext2D as CanvasRenderingContext2D } from "@napi-rs/canvas";
import type { YrTSData } from "../../data/index.ts";
import type { Dimensions, Styles } from "../visual-settings.ts";
import { RAIN_CONSTANTS } from "../visual-settings.ts";
import * as d3 from "d3";
import { getXScale } from "./getScales.ts";

export function drawRain(
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
) {
  addBarsToChart(context, data, dimensions, style);
}

const drawBars = (
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  xScale: d3.ScaleTime<number, number>,
  dimensions: Dimensions,
  style: Styles,
) => {
  const { left, right, bottom, width, weatherHeight } = dimensions;
  const height = weatherHeight;

  const barWidth =
    style.barWidth || Math.max(1, (width - left - right) / data.length - 1);

  data
    .filter((d) => (d.rainMax || 0) > 0)
    .forEach((d) => {
      const x = xScale(d.date);
      const xpos = x - barWidth / 2;

      const confirmedRain = Math.min(d.rain || 0, RAIN_CONSTANTS.maxRainValue);
      const maxRain = Math.min(d.rainMax || 0, RAIN_CONSTANTS.maxRainValue);
      const boxHeight = (height - bottom) / RAIN_CONSTANTS.maxRainValue;

      // Draw confirmed rain (solid boxes)
      context.fillStyle = style.barColor;
      for (let i = 0; i < Math.floor(confirmedRain); i++) {
        const boxY = height - bottom - (i + 1) * boxHeight;
        context.fillRect(xpos, boxY, barWidth, boxHeight - RAIN_CONSTANTS.boxGap);
      }

      // Draw fractional confirmed rain
      const confirmedFractionalPart = confirmedRain - Math.floor(confirmedRain);
      if (confirmedFractionalPart > 0) {
        const boxY =
          height - bottom - (Math.floor(confirmedRain) + 1) * boxHeight;
        const fractionalHeight = confirmedFractionalPart * boxHeight;
        context.fillRect(
          xpos,
          boxY + boxHeight - fractionalHeight,
          barWidth,
          fractionalHeight - RAIN_CONSTANTS.boxGap,
        );
      }

      // Draw potential rain (diagonal lines) from confirmed to max
      if (maxRain > 0 && maxRain > confirmedRain) {
        context.strokeStyle = style.barColor;
        context.lineWidth = RAIN_CONSTANTS.strokeWidth;

        const potentialStart = confirmedRain;
        const potentialEnd = maxRain;

        for (
          let i = Math.floor(potentialStart);
          i < Math.floor(potentialEnd);
          i++
        ) {
          const boxY = height - bottom - (i + 1) * boxHeight;
          drawDiagonalLines(context, xpos, boxY, barWidth, boxHeight - RAIN_CONSTANTS.boxGap);
        }

        // Handle fractional potential rain at the top
        const potentialFractionalPart = potentialEnd - Math.floor(potentialEnd);
        if (potentialFractionalPart > 0) {
          const boxY =
            height - bottom - (Math.floor(potentialEnd) + 1) * boxHeight;
          const fractionalHeight = potentialFractionalPart * boxHeight;
          drawDiagonalLines(
            context,
            xpos,
            boxY + boxHeight - fractionalHeight,
            barWidth,
            fractionalHeight - RAIN_CONSTANTS.boxGap,
          );
        }
      }
    });
};

const drawDiagonalLines = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
) => {
  if (height <= 0) return;

  // Save current state and set clipping path
  context.save();
  context.beginPath();
  context.rect(x, y, width, height);
  context.clip();

  context.beginPath();
  // Start from negative position to ensure left edge is properly filled
  for (let i = -height; i < width + height; i += RAIN_CONSTANTS.diagonalLineSpacing) {
    context.moveTo(x + i, y + height);
    context.lineTo(x + i + height, y);
  }
  context.stroke();

  // Restore clipping state
  context.restore();
};

const addBarsToChart = (
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
) => {
  if (data.some((d) => (d.rainMax || 0) > 0)) {
    const xScale = getXScale(data, dimensions);
    drawBars(context, data, xScale, dimensions, style);
  }
};

export { addBarsToChart };
