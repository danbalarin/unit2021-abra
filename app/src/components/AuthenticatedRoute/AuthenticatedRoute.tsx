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
  const isLogged = useUserStore(useCallback((store) => store.isLogged, []));
  const router = useRouter();
  if (typeof document === "undefined") {
    return <Loading />;
  }

  if (isLogged) {
    return Children;
  }
  router.push("/login");
  return <></>;
}

export default AuthenticatedRoute;
