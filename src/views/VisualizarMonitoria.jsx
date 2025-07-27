import { useEffect, useState } from "react";
import { Button, Flex, Heading, Stack, Text, Box, HStack, VStack, Badge, Spinner, Alert } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { store } from "../stores";
import StarRating from "../components/StarComponent";
import useMonitoria from "../hooks/useMonitoria";
import MeDropdownButton from "../components/MeDropdownButton";
import { confirm } from "../services/confirmService";

const VisualizarMonitoria = () => {
  const userType = store.getState().auth.user?.userType;
  const { id } = useParams();
  const navigate = useNavigate();
  const [monitoria, setMonitoria] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const backToScreen = () => {
    navigate(-1);
  };

  const apiService = new ApiService();

  const fetchMonitoria = async () => {
    try {
      setLoading(true);
      const response = await apiService.obterMonitoria(id);

      if (response.success) {
        setMonitoria(response.data);
      } else {
        setError("Erro ao carregar monitoria");
        toaster.create({
          type: "error",
          description: "Não foi possível carregar os dados da monitoria",
        });
      }
    } catch (err) {
      setError("Erro ao carregar monitoria");
      toaster.create({
        type: "error",
        description: "Ocorreu um erro inesperado",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchMonitoria();
    }
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const cancelarInscricao = async () => {
    const result = await confirm({
      title: "Deseja cancelar a inscrição?",
      message: "Você tem certeza que deseja cancelar sua inscrição nesta monitoria? Esta ação não pode ser desfeita.",
      confirmText: "Sim, cancelar",
      cancelText: "Cancelar"
    });

    if (!result) return;

    const apiService = new ApiService();

    setLoading(true);
    const response = await apiService.cancelarInscricaoMonitoria(id);
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao cancelar a inscrição.",
      });
      return;
    }

    toaster.create({
      type: "success",
      title: "Inscrição cancelada com sucesso!",
    });

    navigate("/aluno");
  };

  const handleClick = async () => {
    if (monitoria.isAlunoInscrito) {
      cancelarInscricao();
      return;
    }
    if (userType === 'ALUNO') {

      const data = await apiService.inscreverAluno(id);

      toaster.create({
        type: data.success ? "success" : "error",
        description: data.success ? "Inscrição realizada com sucesso!" : "Erro ao se inscrever em monitoria"
      });
      return navigate('/aluno');
    }
    navigate(`/monitor/editar-monitoria/${id}`);
  };

  const { items } = useMonitoria({ monitoria, onCancelar: backToScreen, onRealizada: fetchMonitoria });

  if (loading) {
    return (
      <Stack gap={10} w="100%" maxW="764px" m="auto" align="center" justify="center" minH="50vh">
        <Spinner size="lg" />
        <Text>Carregando monitoria...</Text>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack gap={10} w="100%" maxW="764px" m="auto">
        <Alert.Root status="error">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Erro</Alert.Title>
            <Alert.Description>
              {error}
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Stack>
    );
  }

  if (!monitoria) {
    return (
      <Stack gap={10} w="100%" maxW="764px" m="auto">
        <Alert.Root status="warning">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Monitoria não encontrada</Alert.Title>
            <Alert.Description>
              A monitoria solicitada não foi encontrada.
            </Alert.Description>
          </Alert.Content>
        </Alert.Root>
      </Stack>
    );
  }

  return (
    <Stack gap={10} w="100%" maxW="764px" m="auto">
      <VStack align="start" gap={6}>
        <Heading size="xl" as="h1">{monitoria.titulo}</Heading>

        <HStack>
          <Badge colorPalette={monitoria.status === 'ATIVA' ? 'green' : 'gray'}>
            {monitoria.status || 'ATIVA'}
          </Badge>
        </HStack>

        <Box w="100%">
          <VStack align="start" gap={4}>
            <Box>
              <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
                Data
              </Text>
              <Text fontSize="md">
                {formatDate(monitoria.data)}
              </Text>
            </Box>

            <HStack gap={8} w="100%">
              <Box flex={1}>
                <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
                  Início
                </Text>
                <Text fontSize="md">
                  {formatTime(monitoria.horarioInicio)}
                </Text>
              </Box>

              <Box flex={1}>
                <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
                  Fim
                </Text>
                <Text fontSize="md">
                  {formatTime(monitoria.horarioFim)}
                </Text>
              </Box>
            </HStack>
          </VStack>
        </Box>

        <Box w="100%">
          <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
            Monitor
          </Text>
          <Text fontSize="md">
            {monitoria.nomeMonitor}
          </Text>
        </Box>

        {userType === 'ALUNO' && (<>
          <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
            Avaliação do monitor
          </Text>
          <StarRating
            maxStars={5}
            initialRating={monitoria.avaliacaoMediaMonitor}
            size={24}
            readonly={true}
          />
        </>)}

        <Box w="100%">
          <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
            Matéria
          </Text>
          <Text fontSize="md">
            {monitoria.materia}
          </Text>
        </Box>

        <Box w="100%">
          <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
            Tópico
          </Text>
          <Text fontSize="md">
            {monitoria.topico}
          </Text>
        </Box>

        <Box w="100%">
          <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
            Descrição
          </Text>
          <Text fontSize="md" lineHeight="1.6">
            {monitoria.descricao}
          </Text>
        </Box>

        {monitoria.linkReuniao && (
          <Box w="100%">
            <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={1}>
              Link da Reunião
            </Text>
            <Text
              fontSize="md"
              color="blue.500"
              textDecoration="underline"
              cursor="pointer"
              onClick={() => window.open(monitoria.linkReuniao, '_blank')}
            >
              {monitoria.linkReuniao}
            </Text>
          </Box>
        )}

        {monitoria.anexos && monitoria.anexos.length > 0 && (
          <Box w="100%">
            <Text fontWeight="semibold" color="fg.muted" fontSize="sm" mb={2}>
              Anexos
            </Text>
            <VStack align="start" gap={2}>
              {monitoria.anexos.map((anexo, index) => (
                <Text
                  key={index}
                  fontSize="md"
                  color="blue.500"
                  textDecoration="underline"
                  cursor="pointer"
                  onClick={() => window.open(anexo.url, '_blank')}
                >
                  {anexo.nome || `Anexo ${index + 1}`}
                </Text>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>

      <Flex justifyContent="flex-end" mt={12} gap={8}>
        <Button colorPalette="gray" variant="outline" mr="auto" onClick={backToScreen}>Voltar</Button>
        {userType === 'MONITOR' && <MeDropdownButton items={items} button={{ text: "Ações" }} />}

        <Button
          colorPalette={monitoria.isAlunoInscrito ? "red" : "blue"}
          disabled={!monitoria.status || monitoria.status === 'REALIZADA'}
          onClick={handleClick}
        >
          {monitoria.isAlunoInscrito ? 'Cancelar Inscrição' : userType === 'MONITOR' ? 'Editar Monitoria' : 'Inscrever-se'}
        </Button>
      </Flex>
    </Stack>
  );
};

export default VisualizarMonitoria;