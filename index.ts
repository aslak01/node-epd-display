import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { html } from "hono/html";
import { HTTPException } from "hono/http-exception";

import { drawChart } from "./src/chart/index.ts";
import { dimensions } from "./src/chart/draw/visual-settings.ts";
import { shouldMock } from "./src/utils/mock.ts";
import { epd } from "./src/epd_wrapper.ts";
import {
  createEpdBuffer,
  createEpdTestBuffer,
} from "./src/chart/draw/index.ts";
import { Canvas } from "@napi-rs/canvas";

void yargs(hideBin(process.argv))
  .command(
    "preview",
    "Previews on a web server",
    (yargs) => {
      return yargs.option("rotate", {
        type: "boolean",
        default: false,
        description: "Rotate the output 180 degrees",
      });
    },
    async (argv) => await preview(argv.rotate),
  )
  .command(
    "display",
    "Displays the rendering on the pi",
    (yargs) => {
      return yargs.option("rotate", {
        type: "boolean",
        default: false,
        description: "Rotate the output 180 degrees",
      });
    },
    async (argv) => await display(argv.rotate),
  )
  .command(
    "display_test",
    "Displays a test rendering on the pi",
    (yargs) => {
      return yargs.option("rotate", {
        type: "boolean",
        default: false,
        description: "Rotate the output 180 degrees",
      });
    },
    async (argv) => await display_test(argv.rotate),
  )
  .command("clear", "Clears the screen", async () => clear())
  .parse();

async function preview(rotate = false) {
  const port = 4333;
  const app = new Hono();
  app.get("/", (ctx) => {
    const mocking = ctx.req.query("mock");
    const rotateParam = rotate ? "&rotate=true" : "";
    const src = mocking ? `/chart?mock=true${rotateParam}` : `/chart?${rotateParam.slice(1)}`;

    return ctx.html(html`
      <!doctype html>
      <html>
        <head>
          <style>
            :root {
              color-scheme: light dark;
            }
            body {
              color: light-dark(#333b3c, #efefec);
              background-color: light-dark(#efedea, #232323);
              display: flex;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          <img src="${src}" />
        </body>
      </html>
    `);
  });

  app.get("/chart", async (ctx) => {
    let chart: Canvas | null = null;
    try {
      const mock = await shouldMock(!!ctx.req.query("mock"));
      const shouldRotate = !!ctx.req.query("rotate") || rotate;
      chart = await drawChart(mock, shouldRotate);
      // eslint-disable-next-line no-unused-vars
    } catch (_err) {
      throw new HTTPException(500, { message: "Could not produce chart" });
    }
    if (!chart) {
      throw new HTTPException(500, { message: "Could not produce chart" });
    }
    return new Response(chart.toBuffer("image/png"), {
      status: 200,
      headers: new Headers({
        "Content-Type": "image/png",
        "Content-Disposition": 'inline; filename="chart.png"',
      }),
    });
  });
  console.log(`Server listening at http://localhost:${port}`);
  serve({
    fetch: app.fetch,
    port,
  });
}

async function display(rotate = false) {
  if (!(await epd.isAvailable())) {
    console.log("EPD driver not available.");
    return;
  }
  const mock = await shouldMock();
  const chart = await drawChart(mock, rotate);
  const epdBuf = createEpdBuffer(chart, dimensions, rotate);

  console.log("EPD Buffer size:", epdBuf.length);
  console.log("First 10 bytes of EPD Buffer:", epdBuf.slice(0, 10));

  await epd.init();
  await epd.init4Gray();
  await epd.display4Gray(epdBuf);
  await epd.sleep();
}

async function display_test(rotate = false) {
  if (!(await epd.isAvailable())) {
    console.log("EPD driver not available.");
    return;
  }
  const epdBuf = createEpdTestBuffer(dimensions, rotate);

  console.log("EPD Buffer size:", epdBuf.length);
  console.log("First 10 bytes of EPD Buffer:", epdBuf.slice(0, 10));
  console.log("Last 10 bytes of EPD Buffer:", epdBuf.slice(-10));

  await epd.init();
  await epd.init4Gray();
  await epd.display4Gray(epdBuf);
  await epd.sleep();
}

async function clear() {
  await epd.init();
  await epd.clear4Gray();
  await epd.sleep();
}
