import { Box, Button, ButtonGroup, HStack, Icon, StackDivider, Text, VStack } from "@chakra-ui/react";
import { ActionButton, HeadBar, HeaderLogo } from "../container";
import zocketLogo from "@/assets/logo.jpeg";
import { TypeIcon, ImageIcon, TrashIcon, UndoIcon, RedoIcon } from "lucide-react";
import { BringToFrontIcon, SendToBackIcon } from "@/components/Icons";
import { useCanvas } from "@/store/canvas";
import { sampleImageURL } from "@/constants/ads";
import { useTemplate } from "@/store/template";
import { useRef } from "react";
import { convertPSDTOTemplate, parsePSDFromFile } from "@/functions/psd";
import { flowResult } from "mobx";

export default function Header() {
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

  return (
    <HeadBar>
      <HStack>
        <HeaderLogo borderRadius="full" src={zocketLogo} alt="logo" />
        <Text fontSize="lg" fontWeight={600} width={"full"}>
          PSD Editor
        </Text>
      </HStack>
      <HStack spacing="2.5" divider={<StackDivider borderColor="gray.200" />}>
        <ButtonGroup spacing="0.5">
          <ActionButton variant="ghost" onClick={() => canvas.onAddText("Sample Text", { fill: "#000000" })}>
            <Icon as={TypeIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Text
            </Text>
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => canvas.onAddImage(sampleImageURL, { height: 200, width: 200 })}>
            <Icon as={ImageIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Image
            </Text>
          </ActionButton>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <ActionButton variant="ghost" onClick={() => canvas.onChangeObjectLayer("backward")}>
            <Icon as={SendToBackIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Back
            </Text>
          </ActionButton>
          <ActionButton variant="ghost" onClick={() => canvas.onChangeObjectLayer("forward")}>
            <Icon as={BringToFrontIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Front
            </Text>
          </ActionButton>
          <ActionButton variant="ghost" isDisabled={!canvas.selected} onClick={() => canvas.onDeleteObject()}>
            <Icon as={TrashIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Delete
            </Text>
          </ActionButton>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <ActionButton variant="ghost" isDisabled={!canvas.canUndo} onClick={canvas.onUndo.bind(canvas)}>
            <Icon as={UndoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Undo
            </Text>
          </ActionButton>
          <ActionButton variant="ghost" isDisabled={!canvas.canRedo} onClick={canvas.onRedo.bind(canvas)}>
            <Icon as={RedoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Redo
            </Text>
          </ActionButton>
        </ButtonGroup>
      </HStack>
      <HStack>
        <VStack>
          <Box width="full">
            <Button size="sm" fontSize="xs" width="full" onClick={onOpenFileExplorer}>
              Import PSD Template
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
        </VStack>
      </HStack>
    </HeadBar>
  );
}
