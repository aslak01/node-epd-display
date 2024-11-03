import type { CanvasRenderingContext2D } from "skia-canvas";
import { formatDateLegend } from "@/utils";
import type { YrTSData } from "@/chart/data";
import type { Dimensions, Styles } from "@/chart/draw/visual-settings";
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
      drawLongTick(tick);
      return;
    }
    drawNormalTick(tick);
  });

  function drawNormalTick(tick: Date) {
    const x = xScale(tick);
    context.moveTo(x, dimensions.height - dimensions.bottom);
    context.lineTo(x, dimensions.height - dimensions.bottom + style.tickLength);
    context.stroke();
    context.fillText(
      formatDateLegend(tick),
      x,
      dimensions.height - dimensions.bottom + style.tickLength + 2,
    );
  }

  function drawLongTick(tick: Date) {
    const x = xScale(tick);
    context.moveTo(x, dimensions.top - dimensions.bottom);
    context.lineTo(x, dimensions.height - dimensions.bottom + style.tickLength);
    context.stroke();
    context.fillText(
      formatDateLegend(tick),
      x,
      dimensions.height - dimensions.bottom + style.tickLength + 2,
    );
  }
};

// const drawAxes = (context: CanvasRenderingContext2D, dimensions: Dimensions, style: Styles) => {
//   context.beginPath();
//   context.moveTo(dimensions.left, dimensions.top);
//   context.lineTo(dimensions.left, dimensions.height - dimensions.bottom);
//   context.lineTo(dimensions.width - dimensions.right, dimensions.height - dimensions.bottom);
//   context.lineWidth = style.axisWidth;
//   context.strokeStyle = style.axisColor;
//   context.stroke();
// };
//
// const addLabels = (context: CanvasRenderingContext2D, dimensions: Dimensions, style: Styles) => {
//   context.font = style.labelFont;
//   context.fillStyle = style.labelColor;
//   context.fillText('Date', dimensions.width / 2, dimensions.height - 5);
//   context.save();
//   context.translate(15, dimensions.height / 2);
//   context.rotate(-Math.PI / 2);
//   context.fillText('Value', 0, 0);
//   context.restore();
// };
