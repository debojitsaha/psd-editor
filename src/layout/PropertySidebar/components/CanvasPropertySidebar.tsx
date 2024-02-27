import PropertyInput from "@/components/Input/PropertyInput";
import { Drawer } from "@/layout/container";
import { Canvas } from "@/store/canvas";
import { Box, Grid, HStack, StackDivider, Text, VStack } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const CanvasProperty = ({ canvas }: { canvas: Canvas }) => {
  const [width, setWidth] = useState(canvas.instance!.width);
  const [height, setHeight] = useState(canvas.instance!.height);

  const onChangeWidth = (value: string) => {
    setWidth(+value);
    canvas.onChangeDimensions({ width: +value });
  };

  const onChangeHeight = (value: string) => {
    setHeight(+value);
    canvas.onChangeDimensions({ height: +value });
  };

  return (
    <Drawer>
      <VStack alignItems="stretch" spacing="5" py="5" divider={<StackDivider borderColor="gray.200" />}>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Canvas
          </Text>
          <Grid templateColumns="100px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Size
            </Text>
            <HStack spacing="3">
              <PropertyInput label="H" isDisabled value={height} onChange={onChangeHeight} />
              <PropertyInput label="W" isDisabled value={width} onChange={onChangeWidth} />
            </HStack>
          </Grid>
        </Box>
        <Box />
      </VStack>
    </Drawer>
  );
};

export const CanvasPropertySidebar = observer(CanvasProperty);
