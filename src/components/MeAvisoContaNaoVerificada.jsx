import { Alert } from "@chakra-ui/react";

export const MeAvisoContaNaoVerificada = (props) => {
  return (
    <Alert.Root status="warning" w="auto" {...props}>
      <Alert.Indicator />
      <Alert.Content>
        <Alert.Title>Conta não verificada</Alert.Title>
        <Alert.Description>
          Por favor, verifique sua conta para poder cadastrar monitorias.
        </Alert.Description>
      </Alert.Content>
    </Alert.Root>
  );
};
