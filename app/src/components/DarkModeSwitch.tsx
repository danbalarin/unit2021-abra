import { useColorMode, Switch } from "@chakra-ui/react";

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Switch
      width="70px"
      paddingY="1"
      colorScheme="yellow"
      isChecked={isDark}
      onChange={toggleColorMode}
    />
  );
};
