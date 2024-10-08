export const dimensions = {
  width: 480,
  height: 280,
  top: 20,
  right: 25,
  bottom: 30,
  left: 40,
  weatherHeight: 280 * 0.8,
  transitHeight: 280 * 0.2,
};

export type Dimensions = typeof dimensions;

export const style = {
  lineColor: "#000",
  axisColor: "#000",
  labelColor: "#333",
  lineWidth: 4,
  axisWidth: 1,
  labelFont: "12px sans-serif",
  barColor: "#666",
  barWidth: 40,
  tickColor: "#000",
  tickWidth: 1,
  tickLength: 5,
  tickLabelFont: "16px sans-serif",
  tickLabelColor: "#000",
  strongLineColor: "#000",
  weakLineColor: "#777",
  strongLineWidth: 1,
  weakLineWidth: 0.5,
  circleColor: "black",
  textColor: "white",
};

export type Styles = typeof style;

export type DataPoint = { value: number } & YrTSData;

import { getWeather, type YrTSData } from "./weather";
export { getWeather, type YrTSData };
