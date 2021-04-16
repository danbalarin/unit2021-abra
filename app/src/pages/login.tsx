import React, {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/color-mode";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { useRouter } from "next/router";

import { Container } from "components/Container";
import useUserStore from "state/user";
import { kyInstance } from "utils/networking";
import { LoginResponse } from "models/LoginResponse";

interface Props {}

function Login({}: Props): ReactElement {
  const [error, setError] = useState<Error>();
  const { replace } = useRouter();
  const isLogged = useUserStore((s) => s.isLogged);
  const { colorMode } = useColorMode();

  useEffect(() => {
    if (isLogged) {
      replace("/");
    }
  }, [isLogged]);

  const onSubmit = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const body = new URLSearchParams();
    body.append("username", fd.get("username")?.toString() || "");
    body.append("password", fd.get("password")?.toString() || "");

    // FIXME:JSON login
    try {
      const res = await kyInstance
        .post("login-logout/login", {
          body,
        })
        .json<LoginResponse>();
      if (!!res) {
        useUserStore.getState().setSessionId(res.authSessionId || "");
      }
      setError(undefined);
    } catch (e) {
      setError(e);
    }
  }, []);

  return (
    <Container height="100vh" justifyContent="center" alignItems="center">
      <Stack
        as="form"
        spacing="2"
        onSubmit={onSubmit}
        borderRadius="lg"
        border="1px solid"
        borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        paddingX="6"
        paddingY="8"
      >
        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>{error.message}</AlertTitle>
          </Alert>
        )}
        <FormControl id="username">
          <FormLabel>Prihlasovaci jmeno</FormLabel>
          <Input type="username" name="username" />
        </FormControl>
        <FormControl id="password">
          <FormLabel>Heslo</FormLabel>
          <Input type="password" name="password" />
        </FormControl>
        <span />
        <Button type="submit" colorScheme="blue" marginTop="2">
          Prihlasit
        </Button>
      </Stack>
    </Container>
  );
}

export default Login;
