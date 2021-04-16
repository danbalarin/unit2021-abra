import React, { ReactElement } from "react";
import { Container } from "components/Container";
import { CircularProgress } from "@chakra-ui/progress";

export interface LoadingProps {}

function Loading({}: LoadingProps): ReactElement {
  return (
    <Container>
      <CircularProgress isIndeterminate />
    </Container>
  );
}

export default Loading;
