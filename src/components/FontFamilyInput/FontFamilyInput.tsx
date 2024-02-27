import { fonts } from "@/config/fonts";
import { Select } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

function FontFamilyInput({ value, onChange }: { value?: string; onChange?: (font: string) => void }) {
  return (
    <Select
      size="xs"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      maxHeight={60}
      overflowY={"auto"}
      iconColor="gray.400"
    >
      {fonts.map((font) => (
        <option key={font} value={font}>
          {font}
        </option>
      ))}
    </Select>
  );
}

export default observer(FontFamilyInput);
