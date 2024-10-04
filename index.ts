import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { drawChart } from "@/chart";
import { dimensions } from "@/chart/data";
import { shouldMock } from "@/utils/mock";
import * as epd from "@/epd_wrapper";
import { convertImageForEPD } from "@/buffer/epd_buffer";
import { createEpdBuffer } from "@/chart/draw";

yargs(hideBin(process.argv))
  .command("preview", "Previews on a web server", async () => await preview())
  .command(
    "display",
    "Displays the rendering on the pi",
    async () => await display(),
  )
  .command("clear", "Clears the screen", async () => clear())
  .parse();

async function preview() {
  const port = 4333;
  const app = new Hono();
  app.get("/", async (ctx) => {
    let chart;
    try {
      const mock = await shouldMock(!!ctx.req.query("mock"));
      chart = await drawChart(mock);
    } catch (err) {
      console.error(JSON.stringify(err));
      return ctx.text("Error producing chart", 500);
    }
    if (!chart) {
      console.error("No chart");
      return ctx.text("No chart", 500);
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

async function display() {
  if (!epd.isAvailable()) {
    console.log("EPD driver not available.");
    return;
  }
  const mock = await shouldMock();
  const chart = await drawChart(mock);
  const epdBuf = createEpdBuffer(chart, dimensions);

  console.log("EPD Buffer size:", epdBuf.length);
  console.log("First 10 bytes of EPD Buffer:", epdBuf.slice(0, 10));

  console.log("initialising epd");
  epd.init();
  epd.init4Gray();
  epd.clear4Gray();
  epd.display4Gray(epdBuf);
  epd.sleep();
}

function clear() {
  epd.init();
  epd.clear4Gray();
  epd.sleep();
}
