import { cc, ptr } from "bun:ffi";

import devSource from "./DEV_Config.c" with { type: "file" };
import epdSource from "./EPD_3in7.c" with { type: "file" };

const {
  symbols: { DEV_Module_Init, DEV_Module_Exit },
} = cc({
  source: devSource,
  library: [],
  symbols: {
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

const {
  symbols: {
    EPD_3IN7_4Gray_Display,
    EPD_3IN7_4Gray_Init,
    EPD_3IN7_4Gray_Clear,
    EPD_3IN7_Sleep,
  },
} = cc({
  source: epdSource,
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
  },
});

export function display_buffer_on_epd(buffer: Uint8Array) {
  EPD_3IN7_4Gray_Init();
  EPD_3IN7_4Gray_Clear();
  EPD_3IN7_4Gray_Display(buffer);
  EPD_3IN7_Sleep;
}

export {
  EPD_3IN7_4Gray_Display,
  EPD_3IN7_4Gray_Init,
  EPD_3IN7_4Gray_Clear,
  EPD_3IN7_Sleep,
  DEV_Module_Init,
  DEV_Module_Exit,
};
