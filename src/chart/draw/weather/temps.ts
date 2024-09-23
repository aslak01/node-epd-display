import type { CanvasRenderingContext2D } from "skia-canvas";
import type { Dimensions, Styles, YrTSData, DataPoint } from "@/chart/data";
import * as d3 from "d3";
import { getXScale, getYScale } from "./getScales";

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
  const circleRadius = 20;

  drawCircleWithText(
    context,
    xScale(startPoint.date),
    yScale(startPoint.value),
    circleRadius,
    startPoint.value.toFixed(0),
    style,
  );

  drawCircleWithText(
    context,
    xScale(endPoint.date),
    yScale(endPoint.value),
    circleRadius,
    endPoint.value.toFixed(0),
    style,
  );
};

const drawCircleWithText = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  text: string,
  style: Styles,
) => {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fillStyle = style.circleColor || "white";
  context.fill();
  context.strokeStyle = style.lineColor;
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = style.textColor || "black";
  context.font = "bold 20pt sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, x, y + 1);
};
