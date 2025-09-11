import { type CanvasRenderingContext2D } from "skia-canvas";
import type { YrTSData } from "../../data/index.ts";
import type { Dimensions, Styles } from "../visual-settings.ts";
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
    .filter((d) => d.rainMax > 0)
    .forEach((d) => {
      const x = xScale(d.date);
      const xpos = x - barWidth / 2;

      const confirmedRain = Math.min(d.rain, 10);
      const maxRain = Math.min(d.rainMax, 10);
      const boxHeight = (height - bottom) / 10;

      // Draw confirmed rain (solid boxes)
      context.fillStyle = style.barColor;
      for (let i = 0; i < Math.floor(confirmedRain); i++) {
        const boxY = height - bottom - (i + 1) * boxHeight;
        context.fillRect(xpos, boxY, barWidth, boxHeight - 3);
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
          fractionalHeight - 3,
        );
      }

      // Draw potential rain (diagonal lines) from confirmed to max
      if (maxRain > confirmedRain) {
        context.strokeStyle = style.barColor;
        context.lineWidth = 2;

        const potentialStart = confirmedRain;
        const potentialEnd = maxRain;

        for (
          let i = Math.floor(potentialStart);
          i < Math.floor(potentialEnd);
          i++
        ) {
          const boxY = height - bottom - (i + 1) * boxHeight;
          drawDiagonalLines(context, xpos, boxY, barWidth, boxHeight - 3);
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
            fractionalHeight - 3,
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
  const spacing = 4;
  // Start from negative position to ensure left edge is properly filled
  for (let i = -height; i < width + height; i += spacing) {
    context.moveTo(x + i, y + height);
    context.lineTo(x + i + height, y);
  }
  context.stroke();

  // Restore clipping state
  context.restore();
};

const drawAxisTicks = (
  context: CanvasRenderingContext2D,
  yScale: d3.ScaleLinear<number, number>,
  dimensions: Dimensions,
  style: Styles,
) => {
  const yTicks = yScale.ticks(3);

  context.beginPath();
  context.strokeStyle = style.tickColor;
  context.lineWidth = style.tickWidth;
  context.font = style.tickLabelFont;
  context.fillStyle = style.tickLabelColor;

  context.textAlign = "right";
  context.textBaseline = "middle";
  yTicks.forEach((tick) => {
    if (tick === 0) return;
    const y = yScale(tick);
    context.moveTo(dimensions.left - style.tickLength - 23, y);
    context.lineTo(dimensions.left - 23, y);
    context.stroke();
    context.fillText(
      tick.toString(),
      dimensions.left - style.tickLength - 25,
      y,
    );
  });
};

const addBarsToChart = (
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
) => {
  if (data.some((d) => d.rainMax > 0)) {
    const xScale = getXScale(data, dimensions);
    const yScale = d3
      .scaleLinear()
      .domain([0, 10])
      .range([dimensions.weatherHeight - dimensions.bottom, 0]);

    drawBars(context, data, xScale, dimensions, style);
    drawAxisTicks(context, yScale, dimensions, style);
  }
};

export { addBarsToChart };
