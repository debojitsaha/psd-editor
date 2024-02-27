import { createFactory } from "@/functions/utils";
import { ListItemProps } from "@/interface/utils";
import { Item, inputIcons } from "@/layout/container";
import { Icon, Input } from "@chakra-ui/react";
import { fabric as fabricJS } from "fabric";
import { observer } from "mobx-react-lite";
import { useState, useMemo } from "react";


const ListItem = observer(({ name, type, canvas }: ListItemProps) => {
    const [value, setValue] = useState(name);
    const [isReadOnly, setReadOnly] = useState(true);
  
    const isSelected = useMemo(() => {
      if (!canvas.selected) return false;
      if (canvas.selected.type === "activeSelection") {
        const selected = canvas.selected as Required<fabricJS.ActiveSelection>;
        return selected.objects.find((object) => object.name === name);
      } else {
        return canvas.selected.name === name;
      }
    }, [canvas.selected]);
  
    const onClick: React.MouseEventHandler<HTMLInputElement> = (event) => {
      if (!canvas.instance) return;
      const target = canvas.instance.getObjects().find((object) => object.name === name);
      if (!target) return;
      const active = canvas.instance.getActiveObject();
      if (!active || active.name === target.name || !event.shiftKey)
        return canvas.instance.setActiveObject(target).renderAll();
      if (active.type === "activeSelection") {
        const selection = active as Required<fabricJS.ActiveSelection>;
        selection.addWithUpdate(target);
        canvas.instance.setActiveObject(selection);
        canvas.instance.fire("selection:updated", { target: selection }).requestRenderAll();
      }else {
        const selection = createFactory(fabricJS.ActiveSelection, [active, target], { canvas: canvas.instance });
        canvas.instance.setActiveObject(selection).requestRenderAll();
      } 
    };
  
    const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
      setValue(event.target.value);
    };
  
    const onMouseDown: React.MouseEventHandler<HTMLInputElement> = (event) => {
      if (event.detail > 1) event.preventDefault();
    };
  
    const onDoubleClick = () => {
      setReadOnly(false);
    };
  
    const onBlur = () => {
      if (isReadOnly) return;
      setReadOnly(true);
    };
  
    const itemColor = isSelected ? "gray.200" : "white";
    const inputColor = isReadOnly ? "transparent" : "white";
  
    return (
      <Item role="button" tabIndex={0} backgroundColor={itemColor} onClick={onClick}>
        <Icon as={inputIcons[type]} fontSize="sm" />
        <Input
          size="xs"
          fontWeight={500}
          border="none"
          tabIndex={-1}
          backgroundColor={inputColor}
          {...{ value, onChange, onBlur, isReadOnly, onDoubleClick, onMouseDown }}
        />
      </Item>
    );
  });

  export default ListItem;