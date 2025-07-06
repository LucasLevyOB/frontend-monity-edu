import { HStack, Stack, VStack, Text } from "@chakra-ui/react";
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

// const filterOptions = [
//   {
//     value: "todas",
//     label: "Todas",
//   },
//   {
//     value: "proximas",
//     label: "Próximas Monitorias",
//   },
//   {
//     value: "anteriores",
//     label: "Monitorias Anteriores",
//   }
// ];

const ExibirMonitorias = ({ monitorias, fetching, ...restProps }) => {
  return (
    <HStack gap={4} width="100%" overflowX="auto" display="flex" {...restProps}>
      {
        monitorias.map(monitoria => (
          <MeCard monitoria={monitoria} key={monitoria.id} maxW="340px" flexShrink={0} />
        ))
      }
      {
        fetching && (
          <MeProgressCircle />
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
  // const [filter, setFilter] = useState("todas");
  const [nextMonitorias, setNextMonitorias] = useState({
    data: [],
    page: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [fechingNextMonitorias, setFetchingNextMonitorias] = useState(true);
  const [pastMonitorias, setPastMonitorias] = useState({
    data: [],
    page: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [fechingPastMonitorias, setFetchingPastMonitorias] = useState(true);
  const [searcText, setSearchText] = useState("");

  // const getTagVariant = (value) => {
  //   return filter === value ? "subtle" : "outline";
  // };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const fetchNextMonitorias = async (filter, page = nextMonitorias.page + 1) => {
    const api = new ApiService();

    setFetchingNextMonitorias(true);
    const response = await api.monitoriasProximas(filter, page);
    setFetchingNextMonitorias(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ?? "Desculpe, ocorreu um erro ao buascar as próximas monitorias.",
      });
      return;
    }

    setNextMonitorias(prev => ({
      data: page === 1 ? response.data.data : [...prev.data, ...response.data.data],
      page: response.data.page,
      totalPages: response.data.totalPages,
      totalItems: response.data.totalItems,
    }));
  };

  const fetchPastMonitorias = async (filter, page = pastMonitorias.page + 1) => {
    const api = new ApiService();

    setFetchingPastMonitorias(true);
    const response = await api.monitoriasPassadas(filter, page);
    setFetchingPastMonitorias(false);
    console.log(response);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ?? "Desculpe, ocorreu um erro ao buascar as monitorias passadas.",
      });
      return;
    }

    setPastMonitorias(prev => ({
      data: page === 1 ? response.data.data : [...prev.data, ...response.data.data],
      page: response.data.page,
      totalPages: response.data.totalPages,
      totalItems: response.data.totalItems,
    }));
  };

  const debouncedFetch = debounce(() => {
    const filter = {
      ...(searcText.trim() && { topico: searcText })
    };

    setNextMonitorias({ data: [], page: 0, totalPages: 1, totalItems: 0 });
    fetchNextMonitorias(filter, 1);

    setNextMonitorias({ data: [], page: 0, totalPages: 1, totalItems: 0 });
    fetchPastMonitorias(filter, 1);
  }, 1000);

  useEffect(() => {
    if (searcText && searcText.trim().length < 3) return;

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [searcText]);

  const onScrollPastMonitorias = (event) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (isAtEnd && !fechingPastMonitorias && pastMonitorias.page < pastMonitorias.totalPages) {
      fetchPastMonitorias(searcText);
    }
  };

  return (
    <Stack gap={10} w="100%" maxW="1400px" m="auto">
      <HStack>
        <MeField value={searcText} placeholder="Buscar..." startElement={<MdSearch />} w="100%" maxW="278px" mr={12} onChange={handleSearchTextChange} />
        {/* {
          filterOptions.map((option) => (
            <Tag
              key={option.value}
              variant={getTagVariant(option.value)}
              size="lg"
              colorPalette="gray"
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </Tag>
          ))
        } */}
      </HStack>
      <VStack alignItems="flex-start">
        <Text textStyle="xl" mb={8}>Monitorias Inscritas</Text>
        {fechingNextMonitorias && !nextMonitorias.data.length ? (<SkeletonMonitorias />) : <ExibirMonitorias monitorias={nextMonitorias.data} fetching={fechingNextMonitorias} />}
      </VStack>
      <VStack alignItems="flex-start">
        <Text textStyle="xl" mb={8}>Monitorias Anteriores</Text>
        {fechingPastMonitorias && !nextMonitorias.data.length ? (<SkeletonMonitorias />) : <ExibirMonitorias monitorias={pastMonitorias.data} fetching={fechingPastMonitorias} onScroll={onScrollPastMonitorias} />}
      </VStack>
    </Stack>
  );
};

export default DashboardMonitor;