import FontFamilyInput from "@/components/FontFamilyInput/FontFamilyInput";
import PropertyInput from "@/components/Input/PropertyInput";
import { textAlignments } from "@/constants/alignments";
import { mainTextKey } from "@/constants/keys";
import { toFixed } from "@/functions/utils";
import { Drawer } from "@/layout/container";
import { Canvas } from "@/store/canvas";
import {
  Box,
  ButtonGroup,
  Grid,
  HStack,
  Icon,
  IconButton,
  StackDivider,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import { fabric as fabricJS } from "fabric";
import { observer } from "mobx-react-lite";

const TextProperty = ({ canvas }: { canvas: Canvas }) => {
  const selected = canvas.selected! as Required<fabricJS.Textbox>;

  return (
    <Drawer>
      <VStack alignItems="stretch" spacing="5" py="5" divider={<StackDivider borderColor="gray.200" />}>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm" mb="1">
            Layout
          </Text>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Size
            </Text>
            <HStack spacing="3">
              <PropertyInput label="H" value={toFixed(selected.height, 0)} isReadOnly />
              <PropertyInput label="W" value={toFixed(selected.width, 0)} isReadOnly />
            </HStack>
          </Grid>
          <Grid templateColumns="80px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Position
            </Text>
            <HStack spacing="3">
              <PropertyInput
                label="X"
                value={toFixed(selected.left, 0)}
                onChange={(value) => canvas.onChangeTextProperty("left", +value)}
              />
              <PropertyInput
                label="Y"
                value={toFixed(selected.top, 0)}
                onChange={(value) => canvas.onChangeTextProperty("top", +value)}
              />
            </HStack>
          </Grid>
        </Box>
        <Box px="4">
          <Text fontWeight={700} fontSize="sm" mb="1">
            Text Properties
          </Text>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Family
            </Text>
            <FontFamilyInput value={selected.fontFamily} onChange={(value) => canvas.onChangeFontFamily(value)} />
          </Grid>
          <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
            <Text fontSize="xs" fontWeight={500}>
              Font Size
            </Text>
            <PropertyInput
              value={selected.fontSize}
              onChange={(value) => canvas.onChangeTextProperty("fontSize", +value)}
              width="full"
            />
          </Grid>
          {selected.name === mainTextKey && (
            <Grid templateColumns="100px 1fr" mt="3" alignItems="center">
              <Text fontSize="xs" fontWeight={500}>
                Text Align
              </Text>
              <ButtonGroup size="sm" isAttached>
                {textAlignments.map(({ icon, name, value }) => {
                  const variant = value === selected.textAlign ? "solid" : "outline";
                  const color = value === selected.textAlign ? "gray.300" : "transparent";
                  const onClick = () => canvas.onChangeTextProperty("textAlign", value);
                  return (
                    <Tooltip key={name} openDelay={500} hasArrow label={name} placement="bottom-end" fontSize="xs">
                      <IconButton
                        size="xs"
                        variant={variant}
                        onClick={onClick}
                        backgroundColor={color}
                        aria-label={name}
                        icon={<Icon as={icon} fontSize={16} />}
                        flex={1}
                      />
                    </Tooltip>
                  );
                })}
              </ButtonGroup>
            </Grid>
          )}
        </Box>
      </VStack>
    </Drawer>
  );
};

export const TextPropertySidebar = observer(TextProperty);
