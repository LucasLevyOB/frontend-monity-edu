import { Box, HStack, Stack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { store } from "../stores";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { debounce } from "lodash";
import { useNavigate } from "react-router-dom";
import EmptyImage from "../assets/empty.png";
import MeProgressCircle from "../components/MeProgressCircle";
import { EmptyState } from "../components/ui/empty-state";
import MeCardCertificado from "../components/MeCardCertificado";
import MeSkeletonCard from "../components/MeSkeletonCard";
import MeField from "../components/MeField";
import { MdSearch } from "react-icons/md";

const ExibirCertificados = ({ certificados, fetching, ...restProps }) => {
  const navigate = useNavigate();
  console.log(certificados);
  const visualizarMonitoria = (id) => {
    navigate(`/monitor/visualizar-monitoria/${id}`);
  };

  return (
    <HStack gap={4} width="100%" overflowX="auto" display="flex" position="relative" {...restProps}>
      {
        certificados.length ? (
          certificados.map(certificado => (
            <MeCardCertificado certificado={certificado} key={certificado.id} visualizarMonitoria={visualizarMonitoria} maxW="340px" flexShrink={0} />
          ))
        ) : (
          <EmptyState title="Não há certificados" image={EmptyImage} />
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

const SkeletonCertificados = () => {
  return (
    <HStack gap={4} width="100%" overflowX="auto">
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
      <MeSkeletonCard flexShrink={0} />
    </HStack>
  );
};

const Certificados = () => {
  const [searcText, setSearchText] = useState("");
  const credenciado = store.getState().auth.user?.statusMonitor === "APROVADO";
  const [certificados, setCertificados] = useState({
    data: [],
    page: 0,
    totalPages: 1,
    totalItems: 0,
  });
  const [fechingCertificados, setFetchingCertificados] = useState({
    fetching: true,
    /**
     * @type {"filter" | "scroll"}
     */
    type: "filter",
    firstTime: true,
  });
  const [messageError, setMessageError] = useState("");


  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const fetchCertificados = async (filter, type, page = certificados.page + 1) => {
    if (messageError) {
      setMessageError("");
    }

    const api = new ApiService();

    setFetchingCertificados({
      fetching: true,
      type,
      firstTime: fechingCertificados.firstTime,
    });
    const response = await api.certificados(filter, page);
    setFetchingCertificados({
      fetching: false,
      type,
      firstTime: false,
    });

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao buascar os certificados.",
      });
      setMessageError(response.message ? response.message : "Desculpe, ocorreu um erro ao buascar os certificados.");

      return;
    }

    setCertificados(prev => ({
      data: page === 1 ? response.data : [...prev.data, ...response.data.data],
      page: response.data.page,
      totalPages: response.data.totalPages,
      totalItems: response.data.totalItems,
    }));
  };

  const prepareFetchCertificados = () => {
    const filter = {
      ...(searcText.trim() && { titulo: searcText.trim() }),
    };

    fetchCertificados(filter, "filter", 1);
  };

  const debouncedFetch = debounce(() => prepareFetchCertificados(), 500);

  useEffect(() => {
    if (!credenciado) {
      return;
    }

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [searcText, credenciado]);

  const onScrollCertificados = (event) => {
    const { scrollLeft, scrollWidth, clientWidth } = event.target;
    const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (isAtEnd && !fechingCertificados && certificados.page < certificados.totalPages) {
      fechingCertificados(searcText, "scroll");
    }
  };

  return (
    <Stack gap={10} w="100%" maxW="1400px" m="auto">
      <HStack>
        <MeField value={searcText} placeholder="Buscar por Tópico" startElement={<MdSearch />} w="100%" maxW="278px" mr={4} clear={() => setSearchText("")} onChange={handleSearchTextChange} />
      </HStack>
      <VStack alignItems="flex-start">
        <Text textStyle="xl" mb={8}>Todos os Certificados</Text>
        {
          credenciado ? (
            fechingCertificados.fetching && fechingCertificados.firstTime ? (<SkeletonCertificados />) : <ExibirCertificados certificados={certificados.data} fetching={fechingCertificados} onScroll={onScrollCertificados} />
          ) : (
            <MeAvisoContaNaoVerificada m="auto" />
          )
        }
      </VStack>
    </Stack>
  );
};

export default Certificados;