import { originalHeight, originalWidth } from "@/config/app";
import { Header } from "@/layout/Header";
import { LayerSidebar } from "@/layout/LayerSidebar";
import PropertySidebar from "@/layout/PropertySidebar/PropertySidebar";
import { CanvasContainer, Layout, Loader, MainContainer, MainWrapperContainer } from "@/layout/container";
import { useCanvas } from "@/store/canvas";
import { useTemplate } from "@/store/template";
import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

function _CreateTemplate() {
  const template = useTemplate();
  const [canvas, ref] = useCanvas();

  const dimensions = useMemo(() => {
    return {
      width: canvas.dimensions.width,
      height: canvas.dimensions.height,
      scaledWidth: (canvas.dimensions.width || originalWidth) * 0.5,
      scaledHeight: (canvas.dimensions.height || originalHeight) * 0.5,
    };
  }, [canvas.dimensions]);

  const propertyKey = canvas.selected?.name ?? template.active?.key;

  return (
    <Box display={"flex"}>
      <Layout>
        <Header />
        <MainWrapperContainer>
          <LayerSidebar />
          <MainContainer id="canvas-container">
            <Box height={dimensions.scaledHeight} width={dimensions.scaledWidth} position="relative">
              <CanvasContainer height={dimensions.height} width={dimensions.width} transform={"scale(0.5)"}>
                <canvas id="canvas" ref={ref} />
              </CanvasContainer>
            </Box>
          </MainContainer>
          <PropertySidebar key={propertyKey} />
        </MainWrapperContainer>
      </Layout>
      <Loader isLoading={template.isLoading} />
    </Box>
  );
}

export const Home = observer(_CreateTemplate);
