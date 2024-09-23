import type { Dimensions, YrTSData, DataPoint } from "@/chart/data";
import { isTruthy } from "@/utils";
import * as d3 from "d3";

export function getXScale(data: YrTSData[], dimensions: Dimensions) {
  const { left, width, right } = dimensions;
  const extent = d3.extent(data, (d) => d.date).filter(isTruthy);
  return d3
    .scaleTime()
    .domain(extent)
    .range([left, width - right]);
}

export function getYScale(
  data: DataPoint[],
  dimensions: Dimensions,
  domainPadding: { min: number; max: number } = { min: 1, max: 1 },
) {
  const { weatherHeight, top, bottom } = dimensions;
  const height = weatherHeight;

  const max = d3.max(data, (d) => d.value) || 0;
  const min = d3.min(data, (d) => d.value) || 0;

  return d3
    .scaleLinear()
    .domain([min - domainPadding.min, max + domainPadding.max])
    .nice()
    .range([height - bottom, top]);
}
