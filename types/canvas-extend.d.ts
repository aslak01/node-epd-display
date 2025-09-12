// import "@napi-rs/canvas";

// declare module "@napi-rs/canvas" {
//   // Extend SKRSContext2D with all methods/properties of CanvasRenderingContext2D
//   interface SKRSContext2D extends CanvasRenderingContext2D {}
// }

import "@napi-rs/canvas";

declare module "@napi-rs/canvas" {
  interface Canvas {
    getContext(
      contextType: "2d",
      contextAttributes?: ContextAttributes,
    ): SKRSContext2D & CanvasRenderingContext2D;
  }
}
