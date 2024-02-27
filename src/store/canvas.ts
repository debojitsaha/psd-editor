import { exportedProps, maxUndoRedoSteps, originalHeight, originalWidth } from "@/config/app";
import { defaultFont } from "@/config/fonts";
import { brandLogoKey, mainTextKey, subTextKey } from "@/constants/keys";
import { addFontFace } from "@/functions/fonts";
import { objectID } from "@/functions/nanoid";
import { createFactory, toFixed } from "@/functions/utils";
import { CanvasMouseEvent, CanvasState, Clipboard, SceneObject, Selected } from "@/interface/canvas";
import { FontFaceResponse } from "@/interface/fonts";
import { Template } from "@/interface/template";
import { Optional } from "@/interface/utils";
import { useToast } from "@chakra-ui/react";
import { fabric as fabricJS } from "fabric";
import { makeAutoObservable } from "mobx";
import { createContext, useCallback, useContext, useEffect } from "react";

type DimensionKeys = "height" | "width";
type Dimensions = { height?: number; width?: number };
type Background = { type: "color" | "image"; source: string };

export class Canvas {
  instance: Optional<fabricJS.Canvas>;

  objects: SceneObject[];

  template: Optional<Template>;
  selected: Optional<Selected>;
  clipboard: Optional<Clipboard>;

  width: number;
  height: number;
  background: Optional<Background>;

  actionsEnabled: boolean;

  private undoStack: CanvasState[];
  private redoStack: CanvasState[];

  get dimensions() {
    return { height: this.height, width: this.width };
  }

  get canUndo() {
    return this.actionsEnabled && this.undoStack.length > 1;
  }

  get canRedo() {
    return this.actionsEnabled && this.redoStack.length > 0;
  }

  constructor() {
    makeAutoObservable(this);

    this.width = 0;
    this.height = 0;

    this.objects = [];
    this.undoStack = [];
    this.redoStack = [];

    this.actionsEnabled = true;
  }

  private onUpdateObjects() {
    if (!this.instance) return;
    const objects = this.instance.getObjects();
    console.log(objects);
    this.objects = objects
      .map((object) => object.toObject(exportedProps))
      .map((object, index) => ({ name: object.name, type: object.type, index }));
    this.selected = this.instance.getActiveObject()?.toObject(exportedProps);
  }

  private onUpdateBackground(background: Background) {
    this.background = background;
  }

  private onUpdateDimensions() {
    if (!this.instance) return;

    this.width = this.instance.width!;
    this.height = this.instance.height!;
  }

  private onIntiliaseMetaProperties(object: fabricJS.Object) {
    const multiplier = this.instance?.getZoom() || 1;

    switch (object.name) {
      case mainTextKey:
      case subTextKey:
        const text = object as fabricJS.Textbox;
        return {
          max_width: toFixed(text.width ? text.width * multiplier : 0, 0),
          max_height: toFixed(text.height ? text.height * multiplier : 0, 0),
          max_number_words: text.text?.split(" ").length || 20,
          max_number_characters: text.text?.length || 60,
          wrap_length: text.textLines.length ? Math.max(...text.textLines.map((line) => line.length)) : 15,
        };
      case brandLogoKey:
        const image = object as fabricJS.Image;
        return {
          max_width: toFixed(image.getScaledWidth() ? image.getScaledWidth() * multiplier : 0, 0),
          max_height: toFixed(image.getScaledHeight() ? image.getScaledHeight() * multiplier : 0, 0),
        };
      default:
        return {};
    }
  }

  onChangeBackground(template: Pick<Template, "background" | "source">) {
    if (!this.instance) return;

    switch (template.background) {
      case "color":
        this.instance.setBackgroundColor(template.source, this.instance.renderAll.bind(this.instance));
        break;
      case "image":
        this.instance.setBackgroundImage(template.source, this.instance.renderAll.bind(this.instance));
        break;
    }

    this.onUpdateBackground({ type: template.background, source: template.source });
  }

  onChangeDimensions({ width, height }: Dimensions) {
    if (!this.instance) return;

    if (width) this.instance.setWidth(+width).renderAll();
    if (height) this.instance.setHeight(+height).renderAll();

    this.onUpdateDimensions();
  }

  onInitialize(canvas: fabricJS.Canvas) {
    this.instance = canvas;
    this.height = canvas.height!;
    this.width = canvas.width!;
  }

  *onLoadFromTemplate(template: Template) {
    if (!this.instance) return;

    this.instance.clear();

    this.objects = [];
    this.redoStack = [];
    this.undoStack = [];
    this.template = template;

    this.selected = null;

    const factorY = originalHeight / this.height;
    const factorX = originalWidth / this.width;

    this.onChangeBackground(template);
    this.onChangeDimensions({ height: template.height * factorY, width: template.width * factorX });
    // const toast = useToast();

    for (const element of template.state) {
      const isDuplicate = this.instance
        .getObjects()
        .some((object) => object.name?.toLowerCase() === element.name?.toLowerCase());

      const name = isDuplicate ? objectID(element.name.toLowerCase()) : element.name.toLowerCase();

      switch (element.type) {
        case "textbox":
          const res: FontFaceResponse = yield addFontFace(element.details.fontFamily || defaultFont);
          if (res.error) {
            // toast({
            //   id: "font-face-error",
            //   title: "Warning",
            //   description: res.error,
            //   status: "error",
            //   duration: 5000,
            //   isClosable: true,
            //   variant: "left-accent",
            // });
            console.log("Error", res.error);
          }

          const textbox = new fabricJS.Textbox(element.value, {
            ...element.details,
            name,
            fontFamily: res.name,
          });

          textbox.set("meta", this.onIntiliaseMetaProperties(textbox));
          this.instance.add(textbox);
          break;

        case "image":
          const image: fabricJS.Image = yield new Promise((resolve) => {
            fabricJS.Image.fromURL(element.value, (img) => resolve(img), {
              ...element.details,
              name,
              objectCaching: true,
              crossOrigin: "anonymous",
            });
          });
          image.set("meta", this.onIntiliaseMetaProperties(image));
          this.instance.add(image);
          break;
      }

      this.onUpdateObjects();
      this.instance.fire("object:modified", { target: null });
      this.instance.renderAll();
    }
  }

  onSelect(_: CanvasMouseEvent) {
    if (!this.instance) return;

    const element = this.instance.getActiveObject();
    this.selected = element?.toObject(exportedProps);
  }

  onDeselect() {
    this.selected = null;
  }

  onSave(_: CanvasMouseEvent) {
    if (!this.instance) return;

    const state = this.instance.toObject(exportedProps);
    const element = this.instance.getActiveObject();

    if (element) {
      this.selected = element.toObject(exportedProps);
    }

    if (this.undoStack.length < maxUndoRedoSteps) {
      this.undoStack.push(state);
    } else {
      this.undoStack.splice(0, 1).push(state);
    }
  }

  onScale(event: CanvasMouseEvent) {
    if (!this.instance) return;

    const element = event.target!;

    if (element.type) {
      const text = element as fabricJS.Textbox;
      text.set({
        fontSize: Math.round(text.fontSize! * element.scaleY!),
        width: element.width! * element.scaleX!,
        scaleX: 1,
        scaleY: 1,
      });
    }

    this.instance.renderAll();
  }
}

export const CanvasContext = createContext<Canvas | undefined>(undefined);

export const CanvasProvider = CanvasContext.Provider;

export function useCanvas(props?: { onInitialize?: (canvas: Canvas) => void }) {
  const canvas = useContext(CanvasContext);

  if (!canvas) throw new Error("Wrap your component with CanvasProvider");

  const ref = useCallback((element: HTMLCanvasElement) => {
    if (!element) {
      canvas.instance?.dispose();
    } else {
      const options = {
        width: originalWidth,
        height: originalHeight,
        preserveObjectStacking: true,
        backgroundColor: "white",
        selection: true,
        centredRotation: true,
      };

      const fabric = new fabricJS.Canvas(element, options);
      canvas.onInitialize?.(fabric);
      props?.onInitialize?.(canvas);
    }
  }, []);

  const clickAwayListener = useCallback(
    (event: MouseEvent) => {
      if (!canvas.instance) return;

      const target = event.target as HTMLElement;
      if (target.id !== "canvas-container") return;

      canvas.onDeselect();
      canvas.instance.discardActiveObject().renderAll();
    },
    [canvas]
  );

  useEffect(() => {
    if (!canvas.instance) return;

    canvas.instance.on("object:modified", canvas.onSave.bind(canvas));
    canvas.instance.on("object:scaling", canvas.onScale.bind(canvas));
    canvas.instance.on("selection:created", canvas.onSelect.bind(canvas));
    canvas.instance.on("selection:updated", canvas.onSelect.bind(canvas));
    canvas.instance.on("selection:cleared", canvas.onDeselect.bind(canvas));

    window.addEventListener("mousedown", clickAwayListener);

    return () => {
      window.removeEventListener("mousedown", clickAwayListener);
    };
  }, [canvas.instance, clickAwayListener]);

  return [canvas, ref] as const;
}
