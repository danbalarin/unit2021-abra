import { Heading, Stack, StackProps } from "@chakra-ui/layout";
import React, { ReactElement } from "react";

export interface SectionProps extends StackProps {
  title: string;
  children: React.ReactElement | React.ReactElement[];
}

function Section({ title, children, ...rest }: SectionProps): ReactElement {
  return (
    <Stack {...rest}>
      <Heading
        size="lg"
        borderBottom="2px solid"
        borderColor="gray.100"
        paddingX="1"
      >
        {title}
      </Heading>
      {children}
    </Stack>
  );
}

export default Section;
