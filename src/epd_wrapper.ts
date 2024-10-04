let epdDriver: typeof import("@/napi/driver") | null = null;

try {
  // Only import the EPD driver if we're on a Raspberry Pi
  if (process.platform === "linux" && process.arch === "arm") {
    epdDriver = await import("@/napi/driver");
  }
} catch (error) {
  console.warn("EPD driver not available. Running in preview mode.");
}

export const init = () => epdDriver?.init();
export const init4Gray = () => epdDriver?.init4Gray();
export const clear4Gray = () => epdDriver?.clear4Gray();
export const display4Gray = (data: Uint8Array) => epdDriver?.display4Gray(data);
export const sleep = () => epdDriver?.sleep();

export const isEpdAvailable = () => epdDriver !== null;
