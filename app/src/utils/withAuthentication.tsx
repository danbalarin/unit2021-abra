import React from "react";
import Router from "next/router";

import useStore from "state/user";
import { Loading } from "components/Loading";

function withAuthentication(
  Component: React.ComponentType
): React.ComponentType {
  const sessionId = useStore.getState().sessionId;
  if (sessionId) {
    return Component;
  }
  if (typeof document === "undefined") {
    return Loading;
  }
  console.log(document);
  Router.push("/login");
  return React.Fragment;
}

export default withAuthentication;
