import yargs from "yargs";
import http from "node:http";
import { hideBin } from "yargs/helpers";
import { serve } from "@hono/node-server";
import { Hono } from "hono";

import { displayChart, drawChart } from "@/chart";
import { dimensions } from "@/chart/data";
// import { convertImageForEPD } from "@/buffer/epd_buffer";
import { shouldMock } from "@/utils/mock";
import * as epd from "@/napi/driver";

yargs(hideBin(process.argv))
  .command("preview", "Previews on a web server", async () => await preview())
  .command(
    "display",
    "Displays the rendering on the pi",
    async () => await display(),
  )
  .command("clear", "Clears the screen", async () => await clear())
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
    }
    if (!chart) {
      ctx.env.outgoing.writeHead(500);
    }
    ctx.env.outgoing.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Disposition": 'inline; filename="chart.png"',
    });
    ctx.env.outgoing.end(chart);
  });
  serve(app);
  console.log(`Server listening at http://localhost:${port}`);
}
async function display() {
  const mock = await shouldMock();
  const chart = await drawChart(mock);
  console.log(chart);
  console.log(typeof chart);
  epd.init();
  epd.init4Gray();
  epd.clear4Gray();
  epd.display4Gray(chart);
  epd.sleep();
}

function clear() {
  epd.init();
  epd.clear4Gray();
  epd.sleep();
}
