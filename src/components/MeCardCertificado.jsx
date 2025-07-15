import { Button, Card, HStack, Text } from "@chakra-ui/react";
import { Tag } from "./ui/tag";
import Helpers from "../Helpers";
import ApiService from "../services/ApiService";
import { useState } from "react";
import { toaster } from "./ui/toaster";

const MeCard = ({ certificado, ...restProps }) => {
  const [loading, setLoading] = useState(false);

  const baixarCertificado = async () => {
    const api = new ApiService();

    setLoading(true);
    const response = await api.baixarCertificado(certificado.id);
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ?? "Desculpe, ocorreu um erro ao baixar o certificado.",
      });
      return;
    }

    toaster.create({
      type: "success",
      description: "Arquivo encontrado, em instantes o download deve começar.",
    });

    Helpers.FileHelper.downloadByUrl(response.data);
  };

  return (
    <Card.Root {...restProps} minW="340px" minH="324px">
      <Card.Header>
        <Card.Title mt="2" textStyle="md" textAlign="center">{certificado.monitoria.titulo}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Description lineClamp="4" textAlign="justify" mb={2}>
          Certificado gerado para a monitoria de {certificado.monitoria.titulo}.
        </Card.Description>
        <HStack mt={6}>
          <Text fontSize="xs" color="GrayText" mr="auto">Gerado em {Helpers.DateHelper.format(certificado.data, "DD/MM/YYYY")}</Text>
        </HStack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button colorPalette="blue" loading={loading} onClick={baixarCertificado}>Baixar Certificado</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default MeCard;