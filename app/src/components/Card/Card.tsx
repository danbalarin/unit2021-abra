import { useColorMode } from "@chakra-ui/color-mode";
import { Box } from "@chakra-ui/layout";
import React, { ReactElement } from "react";

export interface CardProps {
  children: React.ReactElement;
}

function Card({ children }: CardProps): ReactElement {
  const { colorMode } = useColorMode();
  const borderColor = { dark: "orange.500", light: "orange.700" };
  return (
    <Box
      borderRadius="md"
      shadow="md"
      paddingX="8"
      paddingY="6"
      border="4px solid"
      borderColor={borderColor[colorMode]}
      // bg={bgColor[colorMode]}
      // color={color[colorMode]}
    >
      {children}
    </Box>
  );
}

export default Card;
