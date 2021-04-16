import { Button, ButtonProps } from "@chakra-ui/button";
import { AddIcon } from "@chakra-ui/icons";
import React, { ReactElement } from "react";

export interface CTAProps extends ButtonProps {}

function CTA({ ...props }: CTAProps): ReactElement {
  return (
    <Button
      borderRadius="full"
      size="lg"
      colorScheme="green"
      position="fixed"
      bottom="2rem"
      right="2rem"
      width={["4rem", "4rem"]}
      height={["4rem", "4rem"]}
      _hover={{ shadow: "xl" }}
      {...props}
    >
      <AddIcon />
    </Button>
  );
}

export default CTA;
