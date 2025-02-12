export const dimensions = {
	width: 480,
	height: 280,
	top: 20,
	right: 25,
	bottom: 20,
	left: 40,
	weatherHeight: 280 * 0.85,
	transitHeight: 280 * 0.2,
	iconsHeight: 280 * 0.2,
};

export const COLORS = {
	white: "#ffffff",
	lgrey: "#a0a0a0",
	dgrey: "#4d4d4d",
	black: "#000000",
} as const;

export type Colors = typeof COLORS;

export type Dimensions = typeof dimensions;

export const style = {
	font: "InterDisplay-Bold.woff2",
	boldFont: "InterDisplay-Black.woff2",
	lineColor: "#000",
	axisColor: "#000",
	labelColor: "#333",
	lineWidth: 4,
	axisWidth: 1,
	labelFont: "15px Inter",
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
