import { cc, ptr } from "bun:ffi";

const {
  symbols: { DEV_Module_Exit },
} = cc({
  source: "./DEV_Config.c",
  library: [],
  symbols: {
    DEV_Module_Exit: {
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
  source: "./EPD_3in7.c",
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

export {
  EPD_3IN7_4Gray_Display,
  EPD_3IN7_4Gray_Init,
  EPD_3IN7_4Gray_Clear,
  EPD_3IN7_Sleep,
  DEV_Module_Exit,
};
