import type { SKRSContext2D as CanvasRenderingContext2D } from "@napi-rs/canvas";
// import { formatDateLegend } from "../../../utils/index.ts";
import type { YrTSData } from "../../data/index.ts";
import type { Dimensions, Styles } from "../visual-settings.ts";
import { getXScale } from "./getScales.ts";

export const drawTimeTicks = (
	ctx: CanvasRenderingContext2D,
	data: YrTSData[],
	dimensions: Dimensions,
	style: Styles,
) => {
	const xScale = getXScale(data, dimensions);
	const xTicks = xScale.ticks(5);

	ctx.beginPath();
	ctx.strokeStyle = style.tickColor;
	ctx.lineWidth = style.tickWidth;
	ctx.font = style.tickLabelFont;
	ctx.fillStyle = style.tickLabelColor;
	ctx.textAlign = "center";
	ctx.textBaseline = "top";

	const longTickTimes = [0, 6, 12, 18];

	xTicks.forEach((tick) => {
		const hr = tick.getHours();
		if (longTickTimes.includes(hr)) {
			drawLongTick(tick, dimensions, style);
			return;
		}
		// drawNormalTick(tick, dimensions, style);
	});

	// function drawNormalTick(tick: Date, dimensions: Dimensions, style: Styles) {
	// 	const { weatherHeight, bottom } = dimensions;
	// 	const height = weatherHeight;
	// 	const { tickLength } = style;
	//
	// 	const x = xScale(tick);
	//
	// 	ctx.moveTo(x, height - bottom);
	// 	ctx.lineTo(x, height - bottom + tickLength);
	// 	ctx.stroke();
	// 	ctx.fillText(formatDateLegend(tick), x, height - bottom + tickLength + 2);
	// }

	function drawLongTick(tick: Date, dimensions: Dimensions, style: Styles) {
		const { weatherHeight, bottom, top } = dimensions;
		const height = weatherHeight;
		const { tickLength } = style;

		const x = xScale(tick);

		ctx.moveTo(x, top - bottom);
		ctx.lineTo(x, height - bottom + tickLength);
		ctx.stroke();
		// ctx.fillText(
		// 	formatDateLegend(tick),
		// 	x,
		// 	height - bottom + tickLength + 2
		// );
	}
};
