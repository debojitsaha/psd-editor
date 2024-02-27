export type ObjectType = "textbox" | "image" | "rect";

export type Clipboard = Required<fabric.Object> | null;

export type Selected = Required<fabric.Object> | Required<fabric.ActiveSelection> | null;

export type SceneObject = { name: string; type: ObjectType; index: number };

export type CanvasState = { version: string; objects: fabric.Object[]; background?: string };

export type CanvasMouseEvent = fabric.IEvent<MouseEvent>;

export type ImageKeys = keyof fabric.Image;

export type TextboxKeys = keyof fabric.Textbox;