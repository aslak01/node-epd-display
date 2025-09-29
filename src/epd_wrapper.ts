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
    try {
      console.log("initialising epd");
      epdDriver.init();
    } catch (error) {
      console.error("Failed to initialize EPD:", error);
      throw error;
    }
  },

  async init4Gray(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping init4Gray");
      return;
    }
    try {
      console.log("initialising 4gray mode");
      epdDriver.init4Gray();
    } catch (error) {
      console.error("Failed to initialize 4Gray mode:", error);
      throw error;
    }
  },

  async clear4Gray(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping clear4Gray");
      return;
    }
    try {
      console.log("clearing 4gray mode");
      epdDriver.clear4Gray();
    } catch (error) {
      console.error("Failed to clear 4Gray mode:", error);
      throw error;
    }
  },

  async display4Gray(buffer: Uint8Array): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping display4Gray");
      return;
    }
    try {
      console.log("displaying buffer on epd");
      epdDriver.display4Gray(buffer);
    } catch (error) {
      console.error("Failed to display on EPD:", error);
      throw error;
    }
  },

  async sleep(): Promise<void> {
    await initializeDriver();
    if (!epdDriver) {
      console.log("EPD not available - skipping sleep");
      return;
    }
    try {
      console.log("putting display to sleep");
      epdDriver.sleep();
    } catch (error) {
      console.error("Failed to put EPD to sleep:", error);
      throw error;
    }
  },
};
