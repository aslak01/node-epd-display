import { loadImage, GlobalFonts } from "@napi-rs/canvas";
import type { CanvasRenderingContext2D } from "skia-canvas";
import type { Dimensions, Styles } from "@/chart/draw/visual-settings";
import type { ParsedDeparture } from "@/chart/data/transit";
import path from "node:path";

export async function drawTransitInfo(
  ctx: CanvasRenderingContext2D,
  transitData: ParsedDeparture[],
  dimensions: Dimensions,
  styles: Styles,
) {
  const { height, transitHeight } = dimensions;

  GlobalFonts.registerFromPath(
    path.join(import.meta.dirname, "..", "..", "fonts", styles.font),
    "Inter",
  );

  const trainWhite = await loadImage(
    path.join(import.meta.dirname, "/train-white.png"),
  );
  const trainBlack = await loadImage(
    path.join(import.meta.dirname, "/train-black.png"),
  );
  const busWhite = await loadImage(
    path.join(import.meta.dirname, "/bus-white.png"),
  );
  const busBlack = await loadImage(
    path.join(import.meta.dirname, "/bus-black.png"),
  );

  const ownHeight = transitHeight;
  const infoHeight = ownHeight;
  const infoY = height - ownHeight + (ownHeight - infoHeight) / 2;
  const iconSize = 50;
  const padding = 10;
  const verticalPadding = padding * 2.3;
  const cornerRadius = 15; // Radius for rounded corners

  let x = padding;

  for (const item of transitData) {
    const hasDelay = !!item.delayMinutes;

    // Calculate text dimensions
    ctx.font = "bold 35px Inter";
    const delayText = hasDelay ? ` (+${item.delayMinutes})` : "";
    const departureText = `${item.departureMinutes}${delayText}`;
    const departureWidth = ctx.measureText(departureText).width;

    // Calculate background rectangle dimensions
    const rectWidth = iconSize + padding / 2 + departureWidth + padding;
    const rectHeight = iconSize + padding * 2;

    // Draw background rectangle if delayed

    let icon = item.type === "train" ? trainBlack : busBlack;
    if (hasDelay) {
      icon = item.type === "train" ? trainWhite : busWhite;
      ctx.beginPath();
      ctx.roundRect(
        x - padding / 2,
        infoY,
        rectWidth,
        rectHeight,
        cornerRadius,
      );
      ctx.fillStyle = "black";
      ctx.fill();
    }
    ctx.drawImage(icon, x, infoY + padding - 5, iconSize, iconSize);

    // Draw icon

    // Draw text
    const textColor = hasDelay ? "white" : "black";
    ctx.fillStyle = textColor;
    ctx.textAlign = "left";
    x += iconSize + padding / 2;
    ctx.fillText(departureText, x, infoY + verticalPadding * 1.3);

    // Move x position for next item
    x += departureWidth + padding * 1.5;
  }
}
