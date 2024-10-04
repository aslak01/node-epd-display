let epdDriver: typeof import("@/napi/driver") | null = null;

try {
  // Only import the EPD driver if we're on a Raspberry Pi
  if (process.platform === "linux" && process.arch === "arm") {
    epdDriver = await import("@/napi/driver");
  }
} catch (error) {
  console.warn("EPD driver not available. Running in preview mode.");
}

export function isAvailable() {
  return epdDriver !== null;
}
export function init() {
  epdDriver?.init();
}
export function init4Gray() {
  epdDriver?.init4Gray();
}
export function clear4Gray() {
  epdDriver?.clear4Gray();
}
export function display4Gray(data: Uint8Array) {
  epdDriver?.display4Gray(data);
}
export function sleep() {
  epdDriver?.sleep();
}
