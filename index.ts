#! /usr/bin/env bun

import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command("preview", "Previews on a web server", () => preview())
  .command("display", "Displays the rendering on the pi", () => display())
  .parse();

function preview() {
  console.log("This will preview the chart ");
}

function display() {
  console.log("This will pass the chart output to the pi display ");
}
