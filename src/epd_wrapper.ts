let epdDriver: typeof import("./napi/driver.ts") | null = null;

try {
  if (process.platform === "linux" && process.arch === "arm64") {
    epdDriver = await import("./napi/driver.ts");
  }
} catch (error) {
  console.warn("EPD driver not available. Running in preview mode.");
}

export function isAvailable() {
  return epdDriver !== null;
}
export function init() {
  console.log("initialising epd");
  epdDriver?.init();
}
export function init4Gray() {
  console.log("initialising 4gray mode");
  epdDriver?.init4Gray();
}
export function clear4Gray() {
  console.log("clearing 4gray mode");
  epdDriver?.clear4Gray();
}
export function display4Gray(data: Uint8Array) {
  console.log("displaying buffer on epd");
  epdDriver?.display4Gray(data);
}
export function sleep() {
  console.log("putting display to sleep");
  epdDriver?.sleep();
}
