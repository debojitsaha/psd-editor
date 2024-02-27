import { Box, HStack, List, StackDivider, Text, VStack } from "@chakra-ui/react";
import { Drawer } from "../container";
import { useCanvas } from "@/store/canvas";
import ListItem from "./components/ListItem";
import { observer } from "mobx-react-lite";

function LayerSidebar() {
  const [canvas] = useCanvas();

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
          <List mt="4" mb="2" px="2" spacing="2">
            {canvas.objects.map((object) => (
              <ListItem key={object.name} canvas={canvas} {...object} />
            ))}
          </List>
        </Box>
      </VStack>
    </Drawer>
  );
}

export default observer(LayerSidebar);
