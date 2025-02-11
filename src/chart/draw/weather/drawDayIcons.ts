import { loadImage } from "@napi-rs/canvas";
import type { CanvasRenderingContext2D } from "skia-canvas";
import path from "node:path";
import type { Dimensions } from "../visual-settings.ts";
import type { YrDailyData } from "../../data/weather/index.ts";

export async function drawDayIcons(
	ctx: CanvasRenderingContext2D,
	weatherData: YrDailyData[],
	dimensions: Dimensions,
) {
	const { width } = dimensions;
	const iconSize = 40;
	const padding = 5;

	const infoY = 0;
	const itemWidth = width / 3;

	for (const [i, item] of weatherData.entries()) {
		const x = i * itemWidth;

		const icon = await loadImage(
			path.join(
				import.meta.dirname,
				`../../assets/grayscale/${item.iconCode}.png`,
			),
		);

		ctx.drawImage(
			icon,
			x + (itemWidth - iconSize) / 2,
			infoY + padding * 2,
			iconSize,
			iconSize,
		);
	}
}
