import { loadImage } from "@napi-rs/canvas";
import type { CanvasRenderingContext2D } from "skia-canvas";
import {
	type Colors,
	type Dimensions,
	type Styles,
	COLORS,
} from "../visual-settings.ts";
import type { ParsedDeparture } from "../../data/transit/index.ts";
import path from "node:path";

export async function drawTransitInfo(
	ctx: CanvasRenderingContext2D,
	transitData: ParsedDeparture[],
	dimensions: Dimensions,
) {
	const { height, transitHeight } = dimensions;

	const trainWhite = await loadImage(
		path.join(import.meta.dirname, "/train-white.png"),
	);
	const trainBlack = await loadImage(
		path.join(import.meta.dirname, "/train-black.png"),
	);
	const busWhite = await loadImage(
		path.join(import.meta.dirname, "/bus-white.png"),
	);
	const busBlack = await loadImage(
		path.join(import.meta.dirname, "/bus-black.png"),
	);

	const ownHeight = transitHeight;
	const infoY = height - ownHeight;
	const iconSize = 50;
	const padding = 10;
	const verticalPadding = padding * 2.3;
	const cornerRadius = 15; // Radius for rounded corners

	let x = padding;

	ctx.font = "bold 40px Inter";

	for (const item of transitData) {
		const delay = item.delayMinutes || 0;

		const colorScheme = getColorScheme(delay);

		const delayText = delay > 5 ? `(+${item.delayMinutes})` : "";
		const departureText = `${item.departureMinutes} ${delayText}`;
		const departureWidth = ctx.measureText(departureText).width;

		// Calculate background rectangle dimensions
		const rectWidth = iconSize + padding / 2 + departureWidth + padding;
		const rectHeight = iconSize + padding * 2;

		ctx.beginPath();
		ctx.roundRect(x - padding / 2, infoY, rectWidth, rectHeight, cornerRadius);
		ctx.fillStyle = colorScheme.background;
		ctx.fill();

		// Select and draw appropriate icon
		const icon =
			item.type === "train"
				? colorScheme.icon === "white"
					? trainWhite
					: trainBlack
				: colorScheme.icon === "white"
					? busWhite
					: busBlack;
		ctx.drawImage(icon, x, infoY + padding - 5, iconSize, iconSize);

		ctx.fillStyle = colorScheme.text;
		ctx.textAlign = "left";
		x += iconSize + padding / 2;
		ctx.fillText(departureText, x, infoY + verticalPadding * 1.3);

		x += departureWidth + padding * 1.5;
	}
}

function classifyDelay(delay: number) {
	if (!delay || delay === 0) return 0;
	if (delay > 0 && delay < 5) return 1;
	if (delay > 5 && delay < 10) return 2;
	if (delay > 10) return 3;
	return 0;
}

type ColorScheme = {
	background:
		| Colors["white"]
		| Colors["lgrey"]
		| Colors["dgrey"]
		| Colors["black"];
	text: Colors["white"] | Colors["lgrey"] | Colors["dgrey"] | Colors["black"];
	icon: "white" | "black";
};

function getColorScheme(delay: number): ColorScheme {
	const category = classifyDelay(delay);
	switch (category) {
		case 0:
			return { background: COLORS.white, text: COLORS.black, icon: "black" };
		case 1:
			return { background: COLORS.lgrey, text: COLORS.black, icon: "black" };
		case 2:
			return { background: COLORS.dgrey, text: COLORS.white, icon: "white" };
		case 3:
			return { background: COLORS.black, text: COLORS.white, icon: "white" };
		default:
			return { background: COLORS.white, text: COLORS.black, icon: "black" };
	}
}
