import { Optional } from "@/interface/utils";
import { Canvas } from "./canvas";
import { Template } from "@/interface/template";
import { Status } from "@/interface/app";
import { makeAutoObservable } from "mobx";
import { createContext, useContext } from "react";

export class TemplateStore {
  canvas: Canvas;

  active: Optional<Template>;
  status: Status;

  get isLoading() {
    return this.status === "pending";
  }

  constructor(canvas: Canvas) {
    makeAutoObservable(this);
    this.canvas = canvas;
    this.status = "uninitialized";
  }

  onInitializeCanvas(canvas: Canvas) {
    this.canvas = canvas;
  }

  *onInitializeTemplate(template: Template) {
    this.status = "pending";
    yield this.canvas.onLoadFromTemplate(template);
    this.active = template;
    this.status = "success";
  }
}

export const TemplateContext = createContext<TemplateStore | undefined>(undefined);
export const TemplateProvider = TemplateContext.Provider;

export function useTemplate() {
  const context = useContext(TemplateContext);

  if (!context) {
    throw new Error("Wrap your component with a TemplateProvider");
  }

  return context;
}
