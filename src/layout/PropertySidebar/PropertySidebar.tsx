import { useCanvas } from "@/store/canvas";
import { ImagePropertySidebar } from "./components/ImagePropertySidebar";
import { Drawer } from "../container";
import { observer } from "mobx-react-lite";
import { CanvasPropertySidebar } from "./components/CanvasPropertySidebar";
import { useMemo } from "react";
import { ObjectType } from "@/interface/canvas";
import { TextPropertySidebar } from "./components/TextPropertySidebar";

const mapSidebar = {
    none: CanvasPropertySidebar,
    textbox: TextPropertySidebar,
    image: ImagePropertySidebar,
  };

function PropertySidebar() {
  const [canvas] = useCanvas();

  const selected= useMemo(() => {
    return (canvas.selected?.type || "none") as ObjectType;
  },[canvas.selected])

  const Sidebar = mapSidebar[selected] || mapSidebar.none;

  if (!canvas.instance) return <Drawer />;

  return <Sidebar canvas={canvas} />;
}

export default observer(PropertySidebar);
