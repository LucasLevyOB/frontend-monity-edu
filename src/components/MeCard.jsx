import { Button, Card, HStack, Text } from "@chakra-ui/react";
import { Tag } from "./ui/tag";
import Helpers from "../Helpers";

const MeCard = ({ monitoria, visualizarMonitoria, ...restProps }) => {
  const handleJoinMeet = () => {
    window.open(monitoria.linkReuniao, "_blank");
  };

  const handleVisualizarMonitoria = () => {
    visualizarMonitoria(monitoria.id);
  };

  return (
    <Card.Root {...restProps} minW="340px" minH="324px">
      <Card.Header>
        <Card.Title mt="2" textStyle="md" textAlign="center">{monitoria.titulo}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Description lineClamp="4" textAlign="justify" mb={2}>
          {monitoria.descricao}
        </Card.Description>
        <HStack mt="auto" gap={2}>
          <Tag>{monitoria.materia}</Tag>
          <Tag variant="text">{monitoria.topico}</Tag>
        </HStack>
        <HStack mt={6}>
          <Text fontSize="xs" color="GrayText" mr="auto">{Helpers.DateHelper.format(monitoria.data, "DD/MM/YYYY")} | {monitoria.horarioInicio} - {monitoria.horarioFim}</Text>
        </HStack>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button variant="outline" mr={6} onClick={handleJoinMeet}>Entrar no Meet</Button>
        <Button colorPalette="blue" onClick={handleVisualizarMonitoria}>Visualizar</Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default MeCard;