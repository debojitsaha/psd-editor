import { PropertyInputProps } from "@/interface/utils";
import {
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text,
} from "@chakra-ui/react";
import { observer } from "mobx-react-lite";

function PropertyInput({ label, value, onChange, ...props }: PropertyInputProps) {
  return (
    <InputGroup size="xs">
      <InputLeftElement pointerEvents="none">
        <Text fontWeight={500} color="gray.400">
          {label}
        </Text>
      </InputLeftElement>
      <NumberInput value={value} onChange={onChange} {...props}>
        <NumberInputField pl={label ? 6 : 2} />
        <NumberInputStepper>
          <NumberIncrementStepper color="gray.400" fontSize={8} />
          <NumberDecrementStepper color="gray.400" fontSize={8} />
        </NumberInputStepper>
      </NumberInput>
    </InputGroup>
  );
}

export default observer(PropertyInput);
