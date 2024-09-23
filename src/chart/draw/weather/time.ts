import type { CanvasRenderingContext2D } from "canvas";
import { formatDateLegend } from "@/utils";
import type { Dimensions, Styles, YrTSData } from "@/chart/data";
import { getXScale } from "./getScales";

export const drawTimeTicks = (
  context: CanvasRenderingContext2D,
  data: YrTSData[],
  dimensions: Dimensions,
  style: Styles,
) => {
  const xScale = getXScale(data, dimensions);
  const xTicks = xScale.ticks(5);

  context.beginPath();
  context.strokeStyle = style.tickColor;
  context.lineWidth = style.tickWidth;
  context.font = style.tickLabelFont;
  context.fillStyle = style.tickLabelColor;
  context.textAlign = "center";
  context.textBaseline = "top";

  const longTickTimes = [0, 6, 12, 18];

  xTicks.forEach((tick) => {
    const hr = tick.getHours();
    if (longTickTimes.includes(hr)) {
      drawLongTick(tick, dimensions, style);
      return;
    }
    // drawNormalTick(tick, dimensions, style);
  });

  function drawNormalTick(tick: Date, dimensions: Dimensions, style: Styles) {
    const { weatherHeight, bottom } = dimensions;
    const height = weatherHeight;
    const { tickLength } = style;

    const x = xScale(tick);

    context.moveTo(x, height - bottom);
    context.lineTo(x, height - bottom + tickLength);
    context.stroke();
    context.fillText(
      formatDateLegend(tick),
      x,
      height - bottom + tickLength + 2,
    );
  }

  function drawLongTick(tick: Date, dimensions: Dimensions, style: Styles) {
    const { weatherHeight, bottom, top } = dimensions;
    const height = weatherHeight;
    const { tickLength } = style;

    const x = xScale(tick);

    context.moveTo(x, top - bottom);
    context.lineTo(x, height - bottom + tickLength);
    context.stroke();
    // context.fillText(
    // 	formatDateLegend(tick),
    // 	x,
    // 	height - bottom + tickLength + 2
    // );
  }
};
