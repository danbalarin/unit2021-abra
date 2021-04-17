import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { Button } from "@chakra-ui/button";
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Stack } from "@chakra-ui/layout";
import { useColorMode } from "@chakra-ui/color-mode";
import { Alert, AlertIcon, AlertDescription } from "@chakra-ui/alert";
import { useRouter } from "next/router";
import { useFormik } from "formik";

import { Container } from "components/Container";
import useUserStore from "state/user";
import { kyInstance, throwOnSoftError } from "utils/networking";
import { LoginResponse } from "models/LoginResponse";
import { userLoginValidationSchema } from "models/User";

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

  const onSubmit = useCallback(async (values) => {
    const body = new URLSearchParams();
    body.append("username", values.username);
    body.append("password", values.password);

    // FIXME:JSON login
    try {
      const res = await kyInstance
        .post("login-logout/login", {
          body,
        })
        .json<LoginResponse>()
        .then(throwOnSoftError);
      if (!!res) {
        useUserStore.getState().setSessionId(res.authSessionId || "");
      }
    } catch (e) {
      setError(e);
    }
  }, []);

  const { handleSubmit, values, touched, errors, handleChange } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: onSubmit,
    validationSchema: userLoginValidationSchema,
  });

  return (
    <Container height="100vh" justifyContent="center" alignItems="center">
      <form onSubmit={handleSubmit}>
        <Stack
          spacing="2"
          borderRadius="lg"
          border="1px solid"
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          paddingX="6"
          paddingY="8"
        >
          {error && (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription mr={2}>{error.message}</AlertDescription>
            </Alert>
          )}
          <FormControl
            id="username"
            isInvalid={touched.username && !!errors.username}
            isRequired
          >
            <FormLabel>Prihlasovaci jmeno</FormLabel>
            <Input
              type="text"
              name="username"
              onChange={handleChange}
              value={values.username}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <FormControl
            id="password"
            isInvalid={touched.password && !!errors.password}
            isRequired
          >
            <FormLabel>Heslo</FormLabel>
            <Input
              type="password"
              name="password"
              onChange={handleChange}
              value={values.password}
            />
            <FormErrorMessage>{errors.password}</FormErrorMessage>
          </FormControl>
          <span />
          <Button type="submit" colorScheme="blue" marginTop="2">
            Prihlasit
          </Button>
        </Stack>
      </form>
    </Container>
  );
}

export default Login;
