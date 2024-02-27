import { RGBA } from "ag-psd";

export function convertRGBAToHex({ r, g, b, a }: RGBA) {
  const hex =
    (r | (1 << 8)).toString(16).slice(1) + (g | (1 << 8)).toString(16).slice(1) + (b | (1 << 8)).toString(16).slice(1);
  const alpha = a === undefined || a === null ? 1 : a;
  const hexWithAlpha = hex + ((alpha * 255) | (1 << 8)).toString(16).slice(1);
  return "#" + hexWithAlpha;
}
