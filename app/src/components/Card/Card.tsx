import { DarkMode, LightMode, useColorMode } from "@chakra-ui/color-mode";
import { Box } from "@chakra-ui/layout";
import React, { ReactElement } from "react";

export interface CardProps {
  children: React.ReactElement;
}

function Card({ children }: CardProps): ReactElement {
  const { colorMode } = useColorMode();

  const InvertMode = colorMode === "dark" ? LightMode : DarkMode;

  return (
    <Box
      borderRadius="md"
      shadow="md"
      paddingX="8"
      paddingY="6"
      boxShadow="lg"
      backgroundColor="gray.100"
      // color={color[colorMode]}
    >
      <InvertMode>{children}</InvertMode>
    </Box>
  );
}

export default Card;
