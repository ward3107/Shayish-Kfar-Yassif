export const clampVase = (value: number) => Math.max(0, Math.min(100, value));

/** Match the cover-cropped photo's shelf; keep the whole object away from the copy. */
export function vaseLayout(width: number, height: number, copyLeft = width) {
  const mobile = width <= 750;
  const sourceWidth = mobile ? 941 : 1672;
  const sourceHeight = mobile ? 1672 : 941;
  const scale = Math.max(width / sourceWidth, height / sourceHeight);
  const imageTop = height - sourceHeight * scale;
  const rightEdge = mobile ? width : Math.min(width * .66, copyLeft - 24);
  const objectWidth = Math.min((mobile ? 660 : 700) * scale, width * (mobile ? .72 : .43), rightEdge * .8);
  const objectHeight = objectWidth * 1099 / 1431;
  const minX = Math.max(12, width * .015);
  const maxX = Math.max(minX, rightEdge - objectWidth - minX);
  return {
    width: objectWidth,
    height: objectHeight,
    bottom: imageTop + (mobile ? 1481 : 841) * scale,
    minX,
    maxX,
    reflectionHeight: (mobile ? 1525 - 1481 : 877 - 841) * scale,
  };
}
