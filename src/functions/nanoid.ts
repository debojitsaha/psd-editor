import { customAlphabet } from "nanoid";

const nanoidObject = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 3);

type Prefix = "text" | "image" | "rect" | "frame" | (string & {});

export const objectID = (prefix: Prefix) => prefix + "_" + nanoidObject();
