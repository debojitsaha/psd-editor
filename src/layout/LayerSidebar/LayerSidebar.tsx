import React, { useState } from "react";
import { fabric as fabricJS } from "fabric";
import { Box, Button, HStack, List, StackDivider, Text, VStack } from "@chakra-ui/react";
import { Drawer } from "../container";
import { useRef } from "react";
import { convertPSDTOTemplate, parsePSDFromFile } from "@/functions/psd";
import { flowResult } from "mobx";
import { useCanvas } from "@/store/canvas";
import { useTemplate } from "@/store/template";
import ListItem from "./components/ListItem";
import { observer } from "mobx-react-lite";

function LayerSidebar() {
  const [canvas] = useCanvas();
  const template = useTemplate();
  const explorer = useRef<HTMLInputElement>(null);

  const onOpenFileExplorer = () => {
    if (!explorer.current) return;
    explorer.current.click();
  };

  const onClickFileExplorer = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
    const element = event.target as HTMLInputElement;
    element.value = "";
  };

  const onChangeFileExplorer = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files?.[0];
    const psd = await parsePSDFromFile(file);
    const generatedLayers = await convertPSDTOTemplate(psd);
    await flowResult(template.onInitializeTemplate(generatedLayers));
  };

  if (!canvas.instance) return <Drawer />;

  return (
    <Drawer>
      <VStack alignItems="stretch" divider={<StackDivider />} spacing="5" py="5" overflow="visible">
        <Box>
          <HStack pl="3" pr="2">
            <Text fontSize="sm" fontWeight={600}>
              Layers
            </Text>
          </HStack>
          <List mt="4" mb="2" px="2" spacing="2" height={300} overflowY="scroll">
            {canvas.objects.map((object) => (
              <ListItem key={object.name} canvas={canvas} {...object} />
            ))}
          </List>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm">
            Actions
          </Text>
          <VStack mt="4">
            <Box width="full">
              <Button size="sm" fontSize="xs" width="full" onClick={onOpenFileExplorer}>
                Import Template - PSD
              </Button>
              <input
                ref={explorer}
                type="file"
                hidden
                accept=".psd"
                onClick={onClickFileExplorer}
                onChange={onChangeFileExplorer}
              />
            </Box>
            <Button size="sm" fontSize="xs" width="full">
              Export Template - JSON
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Drawer>
  );
}

export default observer(LayerSidebar);