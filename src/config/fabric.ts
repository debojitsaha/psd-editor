import { createFactory } from "@/functions/utils";
import { fabric as fabricJS } from "fabric";
import cursor from "@/assets/rotate-cursor.svg";

const mtr = fabricJS.Textbox.prototype.controls.mtr;

fabricJS.Textbox.prototype.setControlsVisibility({ mt: false, mb: false });
fabricJS.Textbox.prototype.controls.mtr = createFactory(fabricJS.Control, {
  x: 0,
  y: -0.5,
  offsetY: -40,
  actionHandler: mtr.actionHandler,
  cursorStyle: `url(${cursor}) 8 8, auto`,
  actionName: "rotate",
  withConnection: true,
});

fabricJS.Object.prototype.transparentCorners = false;
fabricJS.Object.prototype.cornerStyle = "circle";
fabricJS.Object.prototype.borderColor = "#BE94F5";
fabricJS.Object.prototype.cornerColor = "#BE94F5";
