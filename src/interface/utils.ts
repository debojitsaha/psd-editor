import { Canvas } from "@/store/canvas";
import { ObjectType } from "./canvas";

export type Optional<T> = T | undefined;

export interface ListItemProps {
    name: string;
    canvas: Canvas;
    type: ObjectType;
  }