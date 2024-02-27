import { ObjectType } from "@/interface/canvas";
import { Template, TemplateState } from "@/interface/template";
import { Layer, Psd, RGBA, readPsd } from "ag-psd";
import _ from "lodash";
import { objectID } from "./nanoid";
import { convertRGBAToHex } from "./colors";
import { defaultFont, defaultFontSize } from "@/config/fonts";
import { nanoid } from "nanoid";

export async function parsePSDFromFile(file: File) {
  const buffer = await file.arrayBuffer();
  const psd = readPsd(buffer);
  return psd;
}

export async function fetchPSDLayers(psd: Psd) {
  const parsePSDLayers = (layers: Layer[]): Layer | Layer[] => {
    return _.flattenDeep(
      layers.map((layer) => {
        if (layer.children && layer.children.length > 0) {
          return parsePSDLayers(layer.children);
        }
        return layer;
      })
    );
  };
  return _.flattenDeep([parsePSDLayers(psd.children || [])]);
}

export async function convertPSDTOTemplate(psd: Psd): Promise<Template> {
  const id = nanoid();
  const layers = await fetchPSDLayers(psd);
  const state: TemplateState[] = await convertTemplateToState(layers);
  return { id, key: id, background: "color", source: "#000000", height: psd.height, width: psd.width, state };
}

export async function convertTemplateToState(layers: Layer[]) {
  const state: TemplateState[] = [];

  for (const layer of layers) {
    const type: ObjectType = layer.text ? "textbox" : "image";
    const name = layer.name ? layer.name : objectID(type);
    const blob = layer.canvas ? await convertCanvasToBlob(layer.canvas) : null;
    const file = blob ? new File([blob], name, { type: blob.type }) : null;

    let value = "";
    if (type === "image") {
      if (file) {
        value = URL.createObjectURL(file);
      }
    } else {
      if (layer.text) {
        value = layer.text.text.replace(/\x03/g, " ");
      }
    }

    const color = (layer.text?.style?.fillColor ?? { a: 1, r: 0, g: 0, b: 0 }) as RGBA;
    const hex = convertRGBAToHex(color);

    const width = Math.ceil((layer.right || 0) - (layer.left || 0));
    const height = Math.ceil((layer.bottom || 0) - (layer.top || 0));

    const fontSize = Math.ceil(layer.text?.style?.fontSize || defaultFontSize);
    const fontFamily = layer.text?.style?.font?.name?.replace(/-/g, " ") || defaultFont;

    const details = {
      top: layer.top,
      left: layer.left,
      opacity: layer.opacity,
      fill: type === "textbox" ? hex : undefined,
      width: type === "textbox" ? width + 12 : width,
      height: type !== "textbox" ? height : undefined,
      fontSize: type === "textbox" ? fontSize : undefined,
      fontFamily: type === "textbox" ? fontFamily || defaultFont : undefined,
    };

    const newDetails = _(details).omitBy(_.isUndefined).value();
    const data = { type, name, value, details: newDetails };

    state.push(data);
  }
  return state;
}

export async function convertCanvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(null);
      resolve(blob);
    });
  });
}
