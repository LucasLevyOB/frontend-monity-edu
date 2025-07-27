import { Button, Card, HStack, Text } from "@chakra-ui/react";
import { Tag } from "./ui/tag";
import Helpers from "../Helpers";
import useMonitoria from "../hooks/useMonitoria";
import MeDropdownButton from "./MeDropdownButton";
import AvaliacaoModal from "./RatingComponent";
import { useState } from "react";
import { store } from "../stores";

const MeCard = ({ monitoria, visualizarMonitoria, refreshData, ...restProps }) => {
  const tipoUsuario = store.getState().auth.user?.userType || "ALUNO";
  const { items } = useMonitoria({ monitoria, onCancelar: refreshData, onRealizada: refreshData });
  const [open, setOpen] = useState(false);

  const handleJoinMeet = () => {
    window.open(monitoria.linkReuniao, "_blank");
  };

  const handleAvaliar = () => {
    setOpen(prev => !prev);
  };

  const handleVisualizarMonitoria = () => {
    visualizarMonitoria(monitoria.id);
  };

  return (
    <>
      <AvaliacaoModal isOpen={open} onClose={() => setOpen(false)} monitoriaId={monitoria.id} />
      <Card.Root {...restProps} minW="340px" minH="324px">
        <Card.Header>
          <HStack alignItems="center" justifyContent="space-between">
            <Card.Title mt="2" textStyle="md" textAlign="center">{monitoria.titulo}</Card.Title>
            {tipoUsuario === "MONITOR" && (<MeDropdownButton items={items} button={{ variant: "ghost" }} />)}
          </HStack>
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
          {
            monitoria.isAlunoInscrito && (
              monitoria.status === 'PENDENTE' ? <Button variant="outline" mr={6} onClick={handleJoinMeet}>Entrar no Meet</Button> : <Button variant="outline" mr={6} onClick={handleAvaliar}>Avaliar</Button>
            )
          }
          <Button colorPalette="blue" onClick={handleVisualizarMonitoria}>Visualizar</Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
};

export default MeCard;