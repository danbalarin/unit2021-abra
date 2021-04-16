import { Loading } from "components/Loading";
import { useRouter } from "next/router";
import React, { ReactElement, useCallback } from "react";
import useUserStore from "state/user";

export interface AuthenticatedRouteProps {
  children: React.ReactElement;
}

function AuthenticatedRoute({
  children: Children,
}: AuthenticatedRouteProps): ReactElement {
  const sessionId = useUserStore(useCallback((store) => store.sessionId, []));
  const router = useRouter();
  if (typeof document === "undefined") {
    return <Loading />;
  }

  if (sessionId) {
    return Children;
  }
  router.push("/login");
  return <></>;
}

export default AuthenticatedRoute;
