import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import { Box, Heading } from "@chakra-ui/layout";
import { DarkModeSwitch } from "components/DarkModeSwitch";
import { useRouter } from "next/router";
import React, { ReactElement, useCallback } from "react";

import useGeneralStore from "state/general";
import useUserStore from "state/user";

export interface AppbarProps {}

function Appbar({}: AppbarProps): ReactElement {
  const sessionId = useUserStore((s) => s.sessionId);
  const heading = useGeneralStore((s) => s.heading);
  const { colorMode } = useColorMode();
  const { push } = useRouter();

  const onLogin = useCallback(() => {
    push("/login");
  }, []);

  const onLogout = useCallback(() => {
    useUserStore.getState().logout();
  }, []);

  return (
    <Box
      width="100%"
      padding="2"
      backgroundColor="blue.500"
      color={colorMode === "dark" ? "blue.100" : "blue.900"}
      display="flex"
      flexDirection="row"
      justifyContent="space-between"
    >
      <DarkModeSwitch />
      <Heading size="md" paddingY="1">
        {heading}
      </Heading>
      <Button
        size="sm"
        width="70px"
        variant="solid"
        colorScheme="green"
        onClick={sessionId ? onLogout : onLogin}
      >
        {sessionId ? "Log out" : "Log in"}
      </Button>
    </Box>
  );
}

export default Appbar;
