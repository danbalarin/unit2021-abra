import React, { ReactElement } from "react";
import { Container } from "components/Container";

export interface LoadingProps {}

function Loading({}: LoadingProps): ReactElement {
  return <Container>Loading</Container>;
}

export default Loading;
