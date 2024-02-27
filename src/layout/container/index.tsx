import { Box, Button, CircularProgress, HStack, chakra } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { FrameIcon, ImageIcon, TypeIcon } from "lucide-react";
import background from "@/assets/transparent-background.avif";

export const Layout = chakra(Box, {
  baseStyle: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "100vh",
  },
});

export const MainWrapperContainer = styled(Box)`
  flex: 1;
  display: flex;
  overflow: auto;
  flex-direction: row;
`;

export const MainContainer = chakra(Box, {
  baseStyle: {
    p: 5,
    maxHeight: "calc(100vh - 60px)", // 60px is the height of the header
    flex: 1,
    overflow: "auto",
    display: "grid",
    placeItems: "center",
    backgroundColor: "#e2e8f0",
  },
});

export const CanvasContainer = chakra(Box, {
  baseStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    transformOrigin: "0 0",
  },
});

export const Loader = chakra(({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <Box display="grid" placeItems="center" zIndex={100} inset="0" position="fixed" backgroundColor="gray.200">
      <CircularProgress isIndeterminate color="black" />
    </Box>
  );
});

export const HeadBar = chakra(Box, {
  baseStyle: {
    px: 4,
    py: 1,
    height: "60px",
    backgroundColor: "#ffffff",
    borderBottom: "1.5px solid #e2e8f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export const HeaderLogo = chakra("img", {
  baseStyle: {
    height: 12,
    width: 12,
  },
});

export const Drawer = chakra("aside", {
  baseStyle: {
    display: "flex",
    flexShrink: 0,
    flexDirection: "column",
    backgroundColor: "white",
    borderRight: "1.5px solid #e2e8f0",
    width: 320,
    overflow: "auto",
  },
});

export const ActionButton = chakra(Button, {
  baseStyle: {
    display: "flex",
    flexDirection: "column",
    py: 1.5,
    height: "auto",
    fontWeight: 400,
  },
});

export const Item = chakra(HStack, {
  baseStyle: {
    pl: 2,
    pr: 1,
    py: 1,

    cursor: "pointer",
    borderRadius: "md",
    alignItems: "center",

    _hover: {
      backgroundColor: "gray.200",
    },
  },
});

export const inputIcons = {
  textbox: TypeIcon,
  image: ImageIcon,
  frame: FrameIcon,
};

export const TransparentBackground = chakra(Box, {
  baseStyle: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    mt: 4,
    px: 4,
    py: 2,
    width: "full",
    background: `url(${background})`,
  },
});
