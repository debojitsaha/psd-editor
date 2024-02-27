import "@/config/fabric";
import { ChakraProvider } from "@chakra-ui/react";
import { Home } from "@/pages/Home";
import { Canvas, CanvasProvider } from "./store/canvas";
import { TemplateProvider, TemplateStore } from "./store/template";

const canvas = new Canvas();
const template = new TemplateStore(canvas);

function App() {
  return (
    <ChakraProvider>
      <CanvasProvider value={canvas}>
        <TemplateProvider value={template}>
          <Home />
        </TemplateProvider>
      </CanvasProvider>
    </ChakraProvider>
  );
}

export default App;
