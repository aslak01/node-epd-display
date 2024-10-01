import addon from "./build/Release/epd3in7.node";

// Helper function to check if the input is a Uint8Array
const validateImageBuffer = (imageBuffer: Uint8Array) => {
  if (!(imageBuffer instanceof Uint8Array)) {
    throw new TypeError("Image must be a Uint8Array");
  }
};

// Exposed functions
const init = () => {
  const result = addon.init();
  if (result !== 0) {
    throw new Error(`Failed to initialize the module. Error code: ${result}`);
  }
};

const exit = () => addon.exit();

const init4Gray = () => addon.init4Gray();

const init1Gray = () => addon.init1Gray();

const clear4Gray = () => addon.clear4Gray();

const clear1Gray = () => addon.clear1Gray();

const display4Gray = (imageBuffer: Uint8Array) => {
  validateImageBuffer(imageBuffer);
  addon.display4Gray(imageBuffer);
};

const display1Gray = (imageBuffer: Uint8Array) => {
  validateImageBuffer(imageBuffer);
  addon.display1Gray(imageBuffer);
};

const sleep = () => addon.sleep();

module.exports = {
  init,
  exit,
  init4Gray,
  init1Gray,
  clear4Gray,
  clear1Gray,
  display4Gray,
  display1Gray,
  sleep,
};
