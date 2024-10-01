import { cc, ptr } from "bun:ffi";

import devSource from "./epd_3in7_includes.c" with { type: "file" };

const {
  symbols: {
    EPD_3IN7_4Gray_Display,
    EPD_3IN7_4Gray_Init,
    EPD_3IN7_4Gray_Clear,
    EPD_3IN7_Sleep,
    DEV_Module_Init,
    DEV_Module_Exit,
  },
} = cc({
  source: devSource,
  library: [],
  symbols: {
    EPD_3IN7_4Gray_Display: {
      returns: "void",
      args: ["cstring"],
    },
    EPD_3IN7_4Gray_Init: {
      returns: "void",
      args: [],
    },
    EPD_3IN7_4Gray_Clear: {
      returns: "void",
      args: [],
    },
    EPD_3IN7_Sleep: {
      returns: "void",
      args: [],
    },
    DEV_Module_Exit: {
      returns: "void",
      args: [],
    },
    DEV_Module_Init: {
      returns: "void",
      args: [],
    },
  },
});

export function display_buffer_on_epd(buffer: Uint8Array) {
  init_epd();
  clear_epd();
  display_4gray(buffer);
  sleep_epd();
}
export function clear_epd() {
  try {
    EPD_3IN7_4Gray_Clear();
  } catch (err) {
    throw new Error(`Clearing EPD failed ${JSON.stringify(err)}`);
  }
}
export function init_epd() {
  try {
    EPD_3IN7_4Gray_Init();
  } catch (err) {
    throw new Error(`Initialising EPD failed ${JSON.stringify(err)}`);
  }
}
export function display_4gray(buffer: Uint8Array) {
  try {
    EPD_3IN7_4Gray_Display(buffer);
  } catch (err) {
    throw new Error(`Displaying buffer on EPD failed ${JSON.stringify(err)}`);
  }
}
export function sleep_epd() {
  try {
    EPD_3IN7_Sleep();
  } catch (err) {
    throw new Error(`Putting EPD to sleep failed ${JSON.stringify(err)}`);
  }
}

export {
  EPD_3IN7_4Gray_Display,
  EPD_3IN7_4Gray_Init,
  EPD_3IN7_4Gray_Clear,
  EPD_3IN7_Sleep,
  DEV_Module_Init,
  DEV_Module_Exit,
};
