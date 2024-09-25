#! /usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { drawChart } from "@/chart";
import { dimensions } from "@/chart/data";
import { convertImageForEPD } from "@/buffer/epd_buffer";
import { display_buffer_on_epd } from "@/c/epd_3in7";
import { shouldMock } from "@/utils/mock";

yargs(hideBin(process.argv))
  .command("preview", "Previews on a web server", async () => await preview())
  .command(
    "display",
    "Displays the rendering on the pi",
    async () => await display(),
  )
  .parse();

async function preview() {
  const server = Bun.serve({
    port: 4333,
    async fetch(req) {
      const mock = await shouldMock(req);
      const chart = await drawChart(mock);
      return new Response(chart, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="chart.png"',
        },
        status: 200,
      });
    },
  });

  process.on("SIGINT", () => {
    console.log("Ctrl-C was pressed");
    process.exit();
  });
  console.log(`Preview running on ${server.url}`);
}

async function display() {
  const { width, height } = dimensions;
  const chart = await drawChart();
  const epdBuffer = convertImageForEPD(chart, width, height);
  display_buffer_on_epd(epdBuffer);
}
