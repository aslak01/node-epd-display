import { type CanvasRenderingContext2D, loadImage } from "canvas";
import type { Dimensions } from "@/chart/data";
import type { ParsedDeparture } from "@/chart/data/transit";

export async function drawTransitInfo(
  ctx: CanvasRenderingContext2D,
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
) {
  const { width, height } = dimensions;

  const ownHeight = height * 0.2;

  ctx.fillStyle = "black";
  ctx.fillRect(0, height - ownHeight, width, ownHeight);

  const trainI = await loadImage(import.meta.dirname + "/train.png");
  const busI = await loadImage(import.meta.dirname + "/bus.png");

  const infoHeight = ownHeight * 0.8;
  const infoY = height - ownHeight + (ownHeight - infoHeight) / 2;
  const iconSize = 30;
  const padding = 8;
  const verticalPadding = padding * 2.3;

  let x = padding;
  for (const item of transitData) {
    const icon = item.type === "train" ? trainI : busI;
    ctx.drawImage(icon, x, infoY + padding - 5, iconSize, iconSize);

    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = "white";

    x += iconSize + padding / 2;

    const departureText = `${item.departureMinutes}`;
    const departureWidth = ctx.measureText(departureText).width;
    ctx.fillText(departureText, x, infoY + verticalPadding);

    x += departureWidth + padding / 2;
    if (item.delayMinutes) {
      const delayText = `(+${item.delayMinutes})`;
      const delayWidth = ctx.measureText(delayText).width;
      ctx.fillText(delayText, x, infoY + verticalPadding);
      x += delayWidth;
    }

    x += padding;
  }
}
