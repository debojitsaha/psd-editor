import { Box, Button, ButtonGroup, HStack, Icon, StackDivider, Text } from "@chakra-ui/react";
import { ActionButton, HeadBar, HeaderLogo } from "../container";
import zocketLogo from "@/assets/zocket.png";
import { TypeIcon, ImageIcon, CombineIcon, TrashIcon, UndoIcon, RedoIcon } from "lucide-react";
import { BringToFrontIcon, SendToBackIcon } from "@/components/Icons";

export default function Header() {
  return (
    <HeadBar>
      <Box width={130}>
        <HeaderLogo src={zocketLogo} alt="logo" />
      </Box>
      <HStack spacing="2.5" divider={<StackDivider borderColor="gray.200" />}>
        <ButtonGroup spacing="0.5">
          <ActionButton variant="ghost">
            <Icon as={TypeIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Text
            </Text>
          </ActionButton>
          <ActionButton variant="ghost">
            <Icon as={ImageIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Image
            </Text>
          </ActionButton>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <ActionButton variant="ghost">
            <Icon as={CombineIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Combine
            </Text>
          </ActionButton>
          <ActionButton variant="ghost">
            <Icon as={SendToBackIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Back
            </Text>
          </ActionButton>
          <ActionButton variant="ghost">
            <Icon as={BringToFrontIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Front
            </Text>
          </ActionButton>
          <ActionButton variant="ghost">
            <Icon as={TrashIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Delete
            </Text>
          </ActionButton>
        </ButtonGroup>
        <ButtonGroup spacing="0.5">
          <ActionButton variant="ghost">
            <Icon as={UndoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Undo
            </Text>
          </ActionButton>
          <ActionButton variant="ghost">
            <Icon as={RedoIcon} fontSize={20} />
            <Text fontSize="xs" mt="2">
              Redo
            </Text>
          </ActionButton>
        </ButtonGroup>
      </HStack>
      <HStack pl="3" pr="2">
        <Text fontSize="lg" fontWeight={600}>
          PSD Editor
        </Text>
      </HStack>
    </HeadBar>
  );
}
