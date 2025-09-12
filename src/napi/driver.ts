import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

let addon: any = null;

try {
  addon = require("../../build/Release/epd3in7.node");
  // eslint-disable-next-line no-unused-vars
} catch (_error) {
  // Expected on non-ARM64 Linux platforms
}

const validateImageBuffer = (imageBuffer: Uint8Array) => {
	if (!(imageBuffer instanceof Uint8Array)) {
		throw new TypeError("Image must be a Uint8Array");
	}
};

const init = () => {
	if (!addon) throw new Error("EPD addon not available");
	const result = addon.init();
	if (result !== 0) {
		throw new Error(`Failed to initialize the module. Error code: ${result}`);
	}
};

const exit = () => {
	if (!addon) throw new Error("EPD addon not available");
	return addon.exit();
};

const init4Gray = () => {
	if (!addon) throw new Error("EPD addon not available");
	return addon.init4Gray();
};

const init1Gray = () => {
	if (!addon) throw new Error("EPD addon not available");
	return addon.init1Gray();
};

const clear4Gray = () => {
	if (!addon) throw new Error("EPD addon not available");
	return addon.clear4Gray();
};

const clear1Gray = () => {
	if (!addon) throw new Error("EPD addon not available");
	return addon.clear1Gray();
};

const display4Gray = (imageBuffer: Uint8Array) => {
	if (!addon) throw new Error("EPD addon not available");
	validateImageBuffer(imageBuffer);
	return addon.display4Gray(imageBuffer);
};

const display1Gray = (imageBuffer: Uint8Array) => {
	if (!addon) throw new Error("EPD addon not available");
	validateImageBuffer(imageBuffer);
	return addon.display1Gray(imageBuffer);
};

const sleep = () => {
	if (!addon) throw new Error("EPD addon not available");
	return addon.sleep();
};

const isAvailable = () => addon !== null;

export {
	init,
	exit,
	init4Gray,
	init1Gray,
	clear4Gray,
	clear1Gray,
	display4Gray,
	display1Gray,
	sleep,
	isAvailable,
};
