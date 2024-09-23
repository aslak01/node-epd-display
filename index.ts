#! /usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

import { drawChart } from "@/chart";
import { convertImageForEPD } from "@/buffer/epd_buffer";
import { display_buffer_on_epd } from "@/c/epd_3in7";

yargs(hideBin(process.argv))
  .command("preview", "Previews on a web server", async () => await preview())
  .command(
    "display",
    "Displays the rendering on the pi",
    async () => await display(),
  )
  .parse();

async function preview() {
  const port = 4555;
  const chart = await drawChart();

  Bun.serve({
    port,
    fetch(req) {
      return new Response(chart, {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": 'inline; filename="chart.png"',
        },
        status: 200,
      });
    },
  });
  console.log(`Preview running on ${port}`);
}

async function display() {
  const chart = await drawChart();
  const width = 480;
  const height = 280;
  const epdBuffer = convertImageForEPD(chart, width, height);
  display_buffer_on_epd(epdBuffer);
}
