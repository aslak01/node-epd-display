import type { SKRSContext2D as CanvasRenderingContext2D } from "@napi-rs/canvas";
import type { YrTSData, DataPoint } from "../../data/index.ts";
import type { Dimensions, Styles } from "../visual-settings.ts";
import { TEMP_CONSTANTS } from "../visual-settings.ts";
import * as d3 from "d3";
import { getXScale, getYScale } from "./getScales.ts";

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
  drawEndCircles(context, temps, xScale, yScale);
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
  lineGenerator.context(context as any)(data);
  context.lineWidth = style.lineWidth;
  context.strokeStyle = style.lineColor;
  context.stroke();
};

const drawEndCircles = (
  context: CanvasRenderingContext2D,
  data: DataPoint[],
  xScale: d3.ScaleTime<number, number>,
  yScale: d3.ScaleLinear<number, number>,
) => {
  const startPoint = data[0];
  const endPoint = data[data.length - 1];

  drawCircleWithText(
    context,
    xScale(startPoint.date),
    yScale(startPoint.value),
    TEMP_CONSTANTS.circleRadius,
    startPoint.value,
  );

  drawCircleWithText(
    context,
    xScale(endPoint.date) - TEMP_CONSTANTS.endPointOffset,
    yScale(endPoint.value),
    TEMP_CONSTANTS.circleRadius,
    endPoint.value,
  );
};

const drawCircleWithText = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  value: number,
) => {
  let text = Math.abs(value).toFixed(0);
  if (value < 1 && value > -1) {
    text = "0";
  }

  let bgCol = value > 0 ? "black" : "white";
  let textCol = value > 0 ? "white" : "black";

  context.font = `${TEMP_CONSTANTS.fontWeight} ${TEMP_CONSTANTS.fontSize}px Inter`;
  const metrics = context.measureText(text);
  const dynamicRadius = Math.max(radius, metrics.width / 2 + TEMP_CONSTANTS.radiusPadding);

  context.beginPath();
  context.arc(x, y, dynamicRadius, 0, 2 * Math.PI);
  context.fillStyle = bgCol;
  context.fill();
  context.strokeStyle = textCol;
  context.lineWidth = TEMP_CONSTANTS.strokeWidth;
  context.stroke();

  context.fillStyle = textCol;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(text, x, y);
};
