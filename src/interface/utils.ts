import { Canvas } from "@/store/canvas";
import { ObjectType } from "./canvas";
import { NumberInputProps } from "@chakra-ui/react";

export type Optional<T> = T | undefined;

export interface ListItemProps {
  name: string;
  canvas: Canvas;
  type: ObjectType;
}

export interface PropertyInputProps extends NumberInputProps {
  label?: string;
}
