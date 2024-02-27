import { ObjectType } from "./canvas";

export interface TemplateState {
  type: ObjectType;
  name: string;
  details: any;
  value: string;
}

export interface Template {
  id: string;
  key?: string;
  source: string;
  background: "image" | "color";
  height: number;
  width: number;
  state: Array<TemplateState>;
}
