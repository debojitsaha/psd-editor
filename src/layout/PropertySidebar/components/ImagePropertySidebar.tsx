import { Canvas } from "@/store/canvas";
import { observer } from "mobx-react-lite";
import { fabric as fabricJS } from "fabric";
import { useRef, useState } from "react";
import { flowResult } from "mobx";
import PropertyInput from "@/components/Input/PropertyInput";
import { VStack, StackDivider, HStack, ButtonGroup, Button, Input, Text, Box, Grid, Image } from "@chakra-ui/react";
import { Drawer, TransparentBackground } from "@/layout/container";

const ImageProperty = ({ canvas }: { canvas: Canvas }) => {
  const selected = canvas.selected as Required<fabricJS.Image> & { src: string };
  const scaled = {
    width: selected.width * selected.scaleX,
    height: selected.height * selected.scaleY,
  };

  const [width, setWidth] = useState(scaled.width);
  const [height, setHeight] = useState(scaled.height);
  const [shouldUpdate, setShouldUpdate] = useState(false);

  const explorer = useRef<HTMLInputElement | null>(null);

  if (scaled.width !== width && shouldUpdate) {
    setWidth(scaled.width);
  }
  if (scaled.height !== height && shouldUpdate) {
    setHeight(scaled.height);
  }

  const onShouldUpdate = () => {
    setShouldUpdate(true);
  };

  const onPreventUpdate = () => {
    setShouldUpdate(false);
  };

  const onChangeWidth = (value: string) => {
    setWidth(+value);
    canvas.onChangeObjectDimensions("width", +value);
  };

  const onChangeHeight = (value: string) => {
    setHeight(+value);
    canvas.onChangeObjectDimensions("height", +value);
  };

  const onOpenImageExplorer = () => {
    if (!explorer.current) return;
    explorer.current.click();
  };

  const onClickImageExplorer = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const onChangeImageExplorer = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files.item(0)!;
    const url = URL.createObjectURL(file);
    await flowResult(canvas.onChangeImageSource(url));
  };

  return (
    <Drawer>
      <VStack alignItems="stretch" spacing="5" py="5" divider={<StackDivider borderColor="gray.200" />}>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Layout
          </Text>
          <Grid templateColumns="80px 1fr" mt="4" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Size
            </Text>
            <HStack spacing="3">
              <PropertyInput
                label="H"
                value={height}
                onChange={onChangeHeight}
                onFocus={onPreventUpdate}
                onBlur={onShouldUpdate}
              />
              <PropertyInput
                label="W"
                value={width}
                onChange={onChangeWidth}
                onFocus={onPreventUpdate}
                onBlur={onShouldUpdate}
              />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput
                label="X"
                value={selected.left}
                onChange={(value) => canvas.onChangeImageProperty("left", +value)}
              />
              <PropertyInput
                label="Y"
                value={selected.top}
                onChange={(value) => canvas.onChangeImageProperty("top", +value)}
              />
            </HStack>
          </Grid>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Image
          </Text>
          <TransparentBackground minHeight="20">
            <Image src={selected.src} alt={selected.name} />
          </TransparentBackground>
          <ButtonGroup mt="4" isAttached variant="outline" size="sm" width="full">
            <Button fontSize="xs" flex={1} onClick={onOpenImageExplorer}>
              Change Image
            </Button>
          </ButtonGroup>
          <Input
            ref={explorer}
            accept="image/*"
            type="file"
            onChange={onChangeImageExplorer}
            onClick={onClickImageExplorer}
            hidden
          />
        </Box>
      </VStack>
    </Drawer>
  );
};

export const ImagePropertySidebar = observer(ImageProperty);
