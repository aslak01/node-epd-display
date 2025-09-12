let epdDriver: typeof import("./napi/driver.ts") | null = null;
let isInitialized = false;

async function initializeDriver() {
  if (isInitialized) return;
  
  try {
    if (process.platform === "linux" && process.arch === "arm64") {
      epdDriver = await import("./napi/driver.ts");
    }
    // eslint-disable-next-line no-unused-vars
  } catch (_error) {
    console.warn("EPD driver not available. Running in preview mode.");
  }
  
  isInitialized = true;
}

export const epd = {
  async isAvailable(): Promise<boolean> {
    await initializeDriver();
    return epdDriver?.isAvailable() ?? false;
  },

  async init(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping init");
      return;
    }
    console.log("initialising epd");
    epdDriver.init();
  },

  async init4Gray(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping init4Gray");
      return;
    }
    console.log("initialising 4gray mode");
    epdDriver.init4Gray();
  },

  async clear4Gray(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping clear4Gray");
      return;
    }
    console.log("clearing 4gray mode");
    epdDriver.clear4Gray();
  },

  async display4Gray(buffer: Uint8Array): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping display4Gray");
      return;
    }
    console.log("displaying buffer on epd");
    epdDriver.display4Gray(buffer);
  },

  async sleep(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping sleep");
      return;
    }
    console.log("putting display to sleep");
    epdDriver.sleep();
  },
};
