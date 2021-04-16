import React, {
  ReactElement,
  SyntheticEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/alert";
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";

import { Card } from "components/Card";
import { Container } from "components/Container";
import { kyInstance } from "utils/networking";
import useStore from "state/user";
import { LoginResponse } from "models/LoginResponse";
import { useRouter } from "next/router";

interface Props {}

function Login({}: Props): ReactElement {
  const [error, setError] = useState<Error>();
  const { replace } = useRouter();
  const sessionId = useStore((s) => s.sessionId);

  useEffect(() => {
    if (sessionId) {
      replace("/");
    }
  }, [sessionId]);

  const onSubmit = useCallback(async (e: SyntheticEvent) => {
    e.preventDefault();
    const fd = new FormData(e.target as HTMLFormElement);
    const body = new URLSearchParams();
    body.append("username", fd.get("username")?.toString() || "");
    body.append("password", fd.get("password")?.toString() || "");

    try {
      const res = await kyInstance
        .post("login-logout/login", {
          body,
        })
        .json<LoginResponse>();
      if (!!res) {
        useStore.getState().setSessionId(res.authSessionId || "");
      }
      setError(undefined);
    } catch (e) {
      setError(e);
    }
  }, []);

  return (
    <Container height="100vh" justifyContent="center" alignItems="center">
      <Card>
        <Stack as="form" spacing="2" onSubmit={onSubmit}>
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>{error.message}</AlertTitle>
            </Alert>
          )}
          <FormControl id="username">
            <FormLabel>Prihlasovaci jmeno</FormLabel>
            <Input type="username" colorScheme="orange" name="username" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Heslo</FormLabel>
            <Input type="password" colorScheme="orange" name="password" />
          </FormControl>
          <Button type="submit" colorScheme="orange" marginTop="2">
            Prihlasit
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}

export default Login;
