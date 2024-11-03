import { type CanvasRenderingContext2D } from "skia-canvas";
import type { YrTSData, DataPoint } from "@/chart/data";
import type { Dimensions, Styles } from "@/chart/draw/visual-settings";
import * as d3 from "d3";
import { getXScale, getYScale } from "./getScales";

export function drawRain(
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
) {
  const rain = data.map((d) => ({ ...d, value: d.rain }));
  addBarsToChart(context, rain, dimensions, style);
}

const drawBars = (
  context: CanvasRenderingContext2D,
  data: DataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  dimensions: Dimensions,
  style: Styles,
) => {
  const { left, right, bottom, width, weatherHeight } = dimensions;
  const height = weatherHeight;

  const barWidth =
    style.barWidth || Math.max(1, (width - left - right) / data.length - 1);

  context.fillStyle = style.barColor;

  data
    .filter((d) => d.value > 0)
    .forEach((d) => {
      const x = xScale(d.date);
      const y = yScale(d.value);
      context.fillRect(x - barWidth / 2, y, barWidth, height - bottom - y);
    });
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
  data: DataPoint[],
  dimensions: Dimensions,
  style: Styles,
) => {
  if (data.some((d) => d.value > 0)) {
    const xScale = getXScale(data, dimensions);
    const yScale = getYScale(data, dimensions, { min: 0, max: 0 });

    drawBars(context, data, xScale, yScale, dimensions, style);
    drawAxisTicks(context, yScale, dimensions, style);
  }
};

export { addBarsToChart };
