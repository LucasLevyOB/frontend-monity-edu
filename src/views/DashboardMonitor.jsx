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
    navigate(`/monitor/visualizar-monitoria/${id}`);
  };

  return (
    <HStack gap={4} width="100%" overflowX="auto" display="flex" position="relative" {...restProps}>
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
    <HStack gap={4} width="100%" overflowX="auto">
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
    </HStack>
  );
};

const DashboardMonitor = () => {
  const [nextMonitorias, setNextMonitorias] = useState({
    data: [],
    page: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [fechingNextMonitorias, setFetchingNextMonitorias] = useState({
    fetching: true,
    /**
     * @type {"filter" | "scroll"}
     */
    type: "filter",
    firstTime: true,
  });
  const [pastMonitorias, setPastMonitorias] = useState({
    data: [],
    page: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [fechingPastMonitorias, setFetchingPastMonitorias] = useState({
    fetching: true,
    /**
     * @type {"filter" | "scroll"}
     */
    type: "filter",
    firstTime: true,
  });
  const [searcText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const credenciado = store.getState().auth.user?.statusMonitor === "APROVADO";
  const [nextMonitoriasError, setNextMonitoriasError] = useState("");
  const [pastMonitoriasError, setPastMonitoriasError] = useState("");

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

  const fetchNextMonitorias = async (filter, type, page = nextMonitorias.page + 1) => {
    if (nextMonitoriasError) {
      setNextMonitoriasError("");
    }

    const api = new ApiService();

    setFetchingNextMonitorias({
      fetching: true,
      type,
      firstTime: fechingNextMonitorias.firstTime,
    });
    const response = await api.monitoriasProximas(filter, page);
    setFetchingNextMonitorias({
      fetching: false,
      type,
      firstTime: false,
    });

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ?? "Desculpe, ocorreu um erro ao buascar as próximas monitorias.",
      });
      setNextMonitoriasError(response.message ?? "Desculpe, ocorreu um erro ao buascar as próximas monitorias.");

      return;
    }

    setNextMonitorias(prev => ({
      data: page === 1 ? response.data.data : [...prev.data, ...response.data.data],
      page: response.data.page,
      totalPages: response.data.totalPages,
      totalItems: response.data.totalItems,
    }));
  };

  const fetchPastMonitorias = async (filter, type, page = pastMonitorias.page + 1) => {
    if (pastMonitoriasError) {
      setPastMonitoriasError("");
    }

    const api = new ApiService();

    setFetchingPastMonitorias({
      fetching: true,
      type,
      firstTime: fechingPastMonitorias.firstTime,
    });
    const response = await api.monitoriasPassadas(filter, page);
    setFetchingPastMonitorias({
      fetching: false,
      type,
      firstTime: false,
    });

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ?? "Desculpe, ocorreu um erro ao buascar as monitorias passadas.",
      });
      setPastMonitoriasError(response.message ?? "Desculpe, ocorreu um erro ao buascar as monitorias passadas.");

      return;
    }

    setPastMonitorias(prev => ({
      data: page === 1 ? response.data.data : [...prev.data, ...response.data.data],
      page: response.data.page,
      totalPages: response.data.totalPages,
      totalItems: response.data.totalItems,
    }));
  };

  const fetchMonitorias = () => {
    const filter = {
      ...(searcText.trim() && { topico: searcText.trim() }),
      ...(filterDate && { data: filterDate }),
    };

    fetchNextMonitorias(filter, "filter", 1);
    fetchPastMonitorias(filter, "filter", 1);
  };

  const debouncedFetch = debounce(() => fetchMonitorias(), 500);

  const [didMount, setDidMount] = useState(false);

  useEffect(() => {
    if (!credenciado) {
      return;
    }

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [searcText, credenciado]);

  useEffect(() => {
    if (!didMount) {
      setDidMount(true);
      return;
    }

    if (!credenciado) {
      return;
    }

    fetchMonitorias();
  }, [filterDate, credenciado]);

  const onScrollPastMonitorias = (event) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (isAtEnd && !fechingPastMonitorias && pastMonitorias.page < pastMonitorias.totalPages) {
      fetchPastMonitorias(searcText, "scroll");
    }
  };

  const onScrollNextMonitorias = (event) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (isAtEnd && !fechingNextMonitorias && nextMonitorias.page < nextMonitorias.totalPages) {
      fetchNextMonitorias(searcText, "scroll");
    }
  };

  return (
    <Stack gap={10} w="100%" maxW="1400px" m="auto">
      <HStack>
        <MeField value={searcText} placeholder="Buscar por Tópico" startElement={<MdSearch />} w="100%" maxW="278px" mr={4} clear={() => setSearchText("")} onChange={handleSearchTextChange} />
        <MeField value={filterDate} placeholder="Filtrar Data" type="date" mr={12} w="100%" maxW="156px" clear={() => setFilterDate("")} onChange={handleFilterDateChange} />
      </HStack>
      <VStack alignItems="flex-start">
        <Text textStyle="xl" mb={8}>Monitorias Próximas</Text>
        {
          nextMonitoriasError ? (
            <Alert.Root status="error" w="auto" m="auto">
              <Alert.Indicator />
              <Alert.Title>{nextMonitoriasError}</Alert.Title>
            </Alert.Root>
          ) : credenciado ? (
            fechingNextMonitorias.fetching && fechingNextMonitorias.firstTime ? (<SkeletonMonitorias />) : <ExibirMonitorias monitorias={nextMonitorias.data} fetching={fechingNextMonitorias} onScroll={onScrollNextMonitorias} />
          ) : (
            <MeAvisoContaNaoVerificada m="auto" />
          )
        }
      </VStack>
      <VStack alignItems="flex-start">
        <Text textStyle="xl" mb={8}>Monitorias Realizadas</Text>
        {
          pastMonitoriasError ? (
            <Alert.Root status="error" w="auto" m="auto">
              <Alert.Indicator />
              <Alert.Title>{pastMonitoriasError}</Alert.Title>
            </Alert.Root>
          ) : credenciado ? (
            fechingPastMonitorias.fetching && fechingPastMonitorias.firstTime ? (<SkeletonMonitorias />) : <ExibirMonitorias monitorias={pastMonitorias.data} fetching={fechingPastMonitorias} onScroll={onScrollPastMonitorias} />
          ) : (
            <MeAvisoContaNaoVerificada m="auto" />
          )
        }
      </VStack>
    </Stack>
  );
};

export default DashboardMonitor;