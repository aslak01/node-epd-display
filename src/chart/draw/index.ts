import type { SKRSContext2D as CanvasRenderingContext2D } from "@napi-rs/canvas";
import { createCanvas, type Canvas } from "@napi-rs/canvas";

import type { YrTSData, YrDailyData } from "../data/index.ts";
import type { Dimensions, Styles } from "./visual-settings.ts";

import {
	drawDayIcons,
	drawRain,
	drawTemps,
	drawTimeTicks,
} from "./weather/index.ts";
import { drawTransitInfo } from "./transit/index.ts";

import type { ParsedDeparture } from "../data/transit/index.ts";

const dev = process.env.NODE_ENV === "development";

export async function createChart(
	todayWeatherData: YrTSData[],
	nextDaysWeatherData: YrDailyData[],
	transitData: ParsedDeparture[],
	dimensions: Dimensions,
	style: Styles,
	rotate180 = false,
): Promise<Canvas> {
	const dims = dimensions;
	const styles = style;

	const canvas = createCanvas(dims.width, dims.height);

	// overwriting native canvas types
	const ctx = canvas.getContext("2d") as unknown as CanvasRenderingContext2D;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

	dev && drawTimeTicks(ctx, todayWeatherData, dims, styles);
	drawRain(ctx, todayWeatherData, dims, styles);
	drawTemps(ctx, todayWeatherData, dims, styles);
	await drawDayIcons(ctx, nextDaysWeatherData, dims);

	await drawTransitInfo(ctx, transitData, dims);

	if (rotate180) {
		const rotatedCanvas = createCanvas(dims.width, dims.height);
		const rotatedCtx = rotatedCanvas.getContext("2d");
		
		rotatedCtx.translate(dims.width, dims.height);
		rotatedCtx.rotate(Math.PI);
		rotatedCtx.drawImage(canvas, 0, 0);
		
		return rotatedCanvas;
	}

	return canvas;
}

export function createEpdBuffer(
	chart: Canvas,
	dimensions: Dimensions,
	rotate180 = false,
): Uint8Array {
	const { width, height } = dimensions;

	const rotatedCanvas = createCanvas(height, width);
	const rotatedContext = rotatedCanvas.getContext("2d");

	if (rotate180) {
		rotatedContext.translate(height, 0);
		rotatedContext.rotate(Math.PI / 2);
	} else {
		rotatedContext.translate(0, width);
		rotatedContext.rotate(-Math.PI / 2);
	}
	rotatedContext.drawImage(chart, 0, 0);

	const imageData = rotatedContext.getImageData(0, 0, height, width);
	const rgbaData = imageData.data;

	const bufferSize = Math.floor((width * height) / 4);
	const epdBuffer = new Uint8Array(bufferSize);

	for (let y = 0; y < width; y++) {
		for (let x = 0; x < height; x += 4) {
			const bufferIndex = Math.floor((y * height + x) / 4);
			let value = 0;

			for (let i = 0; i < 4; i++) {
				const pixelIndex = (y * height + x + i) * 4;
				const r = rgbaData[pixelIndex];
				const g = rgbaData[pixelIndex + 1];
				const b = rgbaData[pixelIndex + 2];

				// Convert RGB to grayscale
				const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);

				// Map grayscale to 2 bits
				let pixelValue;
				if (gray >= 192)
					pixelValue = 3; // White
				else if (gray >= 128)
					pixelValue = 2; // Light gray
				else if (gray >= 64)
					pixelValue = 1; // Dark gray
				else pixelValue = 0; // Black

				value |= pixelValue << (6 - i * 2);
			}

			epdBuffer[bufferIndex] = value;
		}
	}

	return epdBuffer;
}

export function createEpdTestBuffer(dimensions: Dimensions, rotate180 = false): Uint8Array {
	const { width, height } = dimensions;
	const bufferSize = Math.floor((width * height) / 4);
	const epdBuffer = new Uint8Array(bufferSize);

	for (let y = 0; y < height; y++) {
		for (let x = 0; x < width; x += 4) {
			const bufferIndex = Math.floor((y * width + x) / 4);
			let value = 0;

			// Apply rotation to coordinates for pattern generation
			let patternX = x;
			let patternY = y;
			if (rotate180) {
				patternX = width - x - 4;
				patternY = height - y - 1;
			}

			// Create a more distinctive pattern:
			// - Top-left quarter: vertical stripes
			// - Top-right quarter: horizontal stripes
			// - Bottom-left quarter: diagonal stripes
			// - Bottom-right quarter: checkerboard

			if (patternY < height / 2) {
				if (patternX < width / 2) {
					// Vertical stripes
					value = patternX % 8 < 4 ? 0xff : 0x00;
				} else {
					// Horizontal stripes
					value = patternY % 8 < 4 ? 0xff : 0x00;
				}
			} else {
				if (patternX < width / 2) {
					// Diagonal stripes
					value = (patternX + patternY) % 8 < 4 ? 0xff : 0x00;
				} else {
					// Checkerboard
					value = (patternX / 4 + patternY) % 2 === 0 ? 0xff : 0x00;
				}
			}

			epdBuffer[bufferIndex] = value;
		}
	}

	return epdBuffer;
}
