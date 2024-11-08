import type { CanvasRenderingContext2D } from "skia-canvas";
import type { YrTSData, DataPoint } from "../../data/index.ts";
import type { Dimensions, Styles } from "../visual-settings.ts";
import * as d3 from "d3";
import { getXScale, getYScale } from "./getScales.ts";
import { GlobalFonts } from "@napi-rs/canvas";
import path from "path";

export function drawTemps(
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
) {
  const temps = data.map((d) => ({ ...d, value: d.temp }));

  const xScale = getXScale(temps, dimensions);
  const yScale = getYScale(temps, dimensions);

  const lineGenerator = createLineGenerator(xScale, yScale);

  drawLine(context, lineGenerator, temps, style);
  drawEndCircles(context, temps, xScale, yScale, style);
}

const createLineGenerator = (
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
) => {
  return d3
    .line<DataPoint>()
    .curve(d3.curveCardinal)
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.value));
};

const drawLine = (
  context: CanvasRenderingContext2D,
  lineGenerator: d3.Line<DataPoint>,
  data: DataPoint[],
  style: Styles,
) => {
  context.beginPath();
  // @ts-expect-error d3 doesn't expect context to be of node-canvas variant
  lineGenerator.context(context)(data);
  context.lineWidth = style.lineWidth;
  context.strokeStyle = style.lineColor;
  context.stroke();
};

const drawEndCircles = (
  context: CanvasRenderingContext2D,
  data: DataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
  style: Styles,
) => {
  const startPoint = data[0];
  const endPoint = data[data.length - 1];
  const circleRadius = 35;

  drawCircleWithText(
    context,
    xScale(startPoint.date),
    yScale(startPoint.value),
    circleRadius,
    startPoint.value,
    style,
  );

  drawCircleWithText(
    context,
    xScale(endPoint.date) - 10,
    yScale(endPoint.value),
    circleRadius,
    endPoint.value,
    style,
  );
};

const drawCircleWithText = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  value: number,
  style: Styles,
) => {
  let text = Math.abs(value).toFixed(0);
  if (value < 1 && value > -1) {
    text = "0";
  }

  let bgCol = value > 0 ? "black" : "white";
  let textCol = value > 0 ? "white" : "black";

  context.font = "bold 50px Inter";
  const metrics = context.measureText(text);
  const dynamicRadius = Math.max(radius, metrics.width / 2 + 10);

  context.beginPath();
  context.arc(x, y, dynamicRadius, 0, 2 * Math.PI);
  context.fillStyle = bgCol;
  context.fill();
  context.strokeStyle = textCol;
  context.lineWidth = 5;
  context.stroke();

  context.fillStyle = textCol;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, x, y);
};
