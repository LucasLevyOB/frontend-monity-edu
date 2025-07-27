import { HStack, Stack, VStack, Text, Box, Alert } from "@chakra-ui/react";
import MeField from "../components/MeField";
import { Tag } from "../components/ui/tag";
import { MdSearch } from "react-icons/md";
import { useEffect, useState } from "react";
import MeCard from "../components/MeCard";
import Helpers from "../Helpers";
import MeSkeletonCard from "../components/MeSkeletonCard";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { debounce } from "lodash";
import MeProgressCircle from "../components/MeProgressCircle";
import { useNavigate } from "react-router-dom";
import { store } from "../stores";
import { MeAvisoContaNaoVerificada } from "../components/MeAvisoContaNaoVerificada";
import { EmptyState } from "../components/ui/empty-state";
import EmptyImage from "../assets/empty.png";

const ExibirMonitorias = ({ monitorias, fetching, ...restProps }) => {
  const navigate = useNavigate();

  const visualizarMonitoria = (id) => {
    navigate(`/aluno/visualizar-monitoria/${id}`);
  };

  return (
    <HStack gap={4} width="100%" display="flex" flexWrap="wrap" position="relative" {...restProps}>
      {
        monitorias.length ? (
          monitorias.map(monitoria => (
            <MeCard monitoria={monitoria} key={monitoria.id} visualizarMonitoria={visualizarMonitoria} maxW="340px" flexShrink={0} />
          ))
        ) : (
          <EmptyState title="Não há monitorias" image={EmptyImage} />
        )
      }
      {
        (fetching.fetching && fetching.type === "scroll") && (
          <MeProgressCircle />
        )
      }
      {
        (fetching.fetching && fetching.type === "filter") && (
          <Box width="100%" height="100%" position="absolute" display="flex" alignItems="center" justifyContent="center" top={0} left={0} zIndex={1} backgroundColor="blackAlpha.50">
            <VStack>
              <MeProgressCircle />
              <Text color="gray" mt={1}>Buscando...</Text>
            </VStack>
          </Box>
        )
      }
    </HStack>
  );
};

const SkeletonMonitorias = () => {
  return (
    <HStack gap={4} width="100%" flexWrap="wrap">
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
    </HStack>
  );
};

const BuscarMonitorias = () => {
  const [monitorias, setMonitorias] = useState({
    data: [],
    page: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [fechingMonitorias, setFetchingMonitorias] = useState({
    fetching: true,
    /**
     * @type {"filter" | "scroll"}
     */
    type: "filter",
    firstTime: true,
  });
  const [searcText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [monitoriasError, setMonitoriasError] = useState("");

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleFilterDateChange = (event) => {
    const value = event.target.value;
    if (!value) {
      setFilterDate("");
    } else {
      setFilterDate(Helpers.DateHelper.format(value, "YYYY-MM-DD"));
    }
  };

  const fetchMonitorias = async (filter, type, page = monitorias.page + 1) => {
    if (monitoriasError) {
      setMonitoriasError("");
    }

    const api = new ApiService();

    setFetchingMonitorias({
      fetching: true,
      type,
      firstTime: fechingMonitorias.firstTime,
    });
    const response = await api.buscarMonitorias(filter);
    setFetchingMonitorias({
      fetching: false,
      type,
      firstTime: false,
    });

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao buascar as próximas monitorias.",
      });
      setMonitoriasError(response.message ? response.message : "Desculpe, ocorreu um erro ao buascar as próximas monitorias.");

      return;
    }

    setMonitorias(prev => ({
      data: page === 1 ? response.data.data : [...prev.data, ...response.data.data],
      page: response.data.page,
      totalPages: response.data.totalPages,
      totalItems: response.data.totalItems,
    }));
  };

  const prepareFetchMonitorias = () => {
    const filter = {
      ...(searcText.trim() && { topico: searcText.trim() }),
      ...(filterDate && { data: filterDate }),
    };

    fetchMonitorias(filter, "filter", 1);
  };

  const debouncedFetch = debounce(() => prepareFetchMonitorias(), 500);

  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [searcText]);

  useEffect(() => {
    if (!didMount) {
      setDidMount(true);
      return;
    }

    fetchMonitorias();
  }, [filterDate]);

  const onScrollNextMonitorias = (event) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (isAtEnd && !fechingMonitorias && monitorias.page < monitorias.totalPages) {
      fetchMonitorias(searcText, "scroll");
    }
  };

  return (
    <Stack gap={10} w="100%" maxW="1400px" m="auto">
      <HStack>
        <MeField value={searcText} placeholder="Buscar por Tópico" startElement={<MdSearch />} w="100%" maxW="278px" mr={4} clear={() => setSearchText("")} onChange={handleSearchTextChange} />
        <MeField value={filterDate} placeholder="Filtrar Data" type="date" mr={12} w="100%" maxW="156px" clear={() => setFilterDate("")} onChange={handleFilterDateChange} />
      </HStack>
      <VStack alignItems="flex-start">
        <Text textStyle="xl" mb={8}>Monitorias Disponíveis</Text>
        {
          monitoriasError ? (
            <Alert.Root status="error" w="auto" m="auto">
              <Alert.Indicator />
              <Alert.Title>{monitoriasError}</Alert.Title>
            </Alert.Root>
          ) : (
            fechingMonitorias.fetching && fechingMonitorias.firstTime ? (<SkeletonMonitorias />) : <ExibirMonitorias monitorias={monitorias.data} fetching={fechingMonitorias} onScroll={onScrollNextMonitorias} />
          )
        }
      </VStack>
    </Stack>
  );
};

export default BuscarMonitorias;