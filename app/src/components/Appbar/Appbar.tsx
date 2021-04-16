import { Button } from "@chakra-ui/button";
import { useColorMode } from "@chakra-ui/color-mode";
import Icon from "@chakra-ui/icon";
import { Box, Heading } from "@chakra-ui/layout";
import { DarkModeSwitch } from "components/DarkModeSwitch";
import Logout from "components/Icons/Logout";
import Person from "components/Icons/Person";
import { useRouter } from "next/router";
import React, { ReactElement, useCallback } from "react";

import useGeneralStore from "state/general";
import useUserStore from "state/user";

export interface AppbarProps {}

function Appbar({}: AppbarProps): ReactElement {
  const isLogged = useUserStore((s) => s.isLogged);
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
        variant="solid"
        colorScheme="green"
        onClick={isLogged ? onLogout : onLogin}
      >
        {isLogged ? (
          <Icon fill={colorMode === "dark" ? "black" : "white"} as={Logout} />
        ) : (
          <Icon fill={colorMode === "dark" ? "black" : "white"} as={Person} />
        )}
      </Button>
    </Box>
  );
}

export default Appbar;
