import { useEffect, useState } from "react";
import { Button, Flex, Heading, Stack, Field, Combobox, useListCollection, Portal, HStack, Spinner, Span, Text } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import MeField from "../components/MeField";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import { validationSchemaVerificarMonitor } from "../validations/validationSchemaVerificarMonitor";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import ApiUniversities from "../services/ApiUniversities";
import { debounce } from "lodash";

const VerificarMonitor = () => {
  const resolver = useYupValidationResolver(validationSchemaVerificarMonitor);
  const { handleSubmit, register, formState: { errors, isValid }, watch, setValue } = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { collection, set } = useListCollection({
    initialItems: [],
    itemToString: (item) => item.name,
    itemToValue: (item) => item.name,
  });
  const instituicaoEnsinoValue = watch("instituicaoEnsino");
  const [loadingUniversities, setLoadingUniversities] = useState(false);
  const [errorUniversities, setErrorUniversities] = useState("");

  const sendData = async (data) => {
    if (!isValid) {
      return;
    }

    const apiService = new ApiService();

    setLoading(true);
    const response = await apiService.verificarMonitor(data);
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: "Desculpe, ocorreu um erro ao enviar os dados para a verificação de credêncimento",
      });
      return;
    }

    toaster.create({
      type: "success",
      title: "Sucesso ao fazer o credenciamento.",
      description: "Agora você pode criar monitorias.",
    });
    navigate("/monitor");
  };

  const fetchUniversities = async () => {
    const api = new ApiUniversities();
    setLoadingUniversities(true);
    const response = await api.search(instituicaoEnsinoValue);
    setLoadingUniversities(false);
    if (response.success) {
      set(response.data);
    } else {
      setErrorUniversities("Erro ao carregar");
    }
  };

  const debouncedFetch = debounce(fetchUniversities, 1000);

  useEffect(() => {
    if (!instituicaoEnsinoValue || instituicaoEnsinoValue.trim().length < 3) return;

    debouncedFetch();

    return () => debouncedFetch.cancel();
  }, [instituicaoEnsinoValue]);

  return (
    <Stack gap={10} w="100%" maxW="764px" m="auto">
      <Heading size="xl" as="h1">Verificação de credenciamento</Heading>
      <form onSubmit={handleSubmit(async (data) => await sendData(data))}>
        <Stack gap={8}>
          <Combobox.Root
            width="320px"
            collection={collection}
            placeholder="Example: C-3PO"
            onItemSelect={item => setValue("instituicaoEnsino", item.name, { shouldValidate: true })}
            onInputValueChange={e => setValue("instituicaoEnsino", e.inputValue, { shouldValidate: true })}
            positioning={{ sameWidth: false, placement: "bottom-start" }}
            invalid={errors.instituicaoEnsino?.message}
          >
            <Combobox.Label>Instituição de Ensino</Combobox.Label>

            <Combobox.Control>
              <Combobox.Input register={register("instituicaoEnsino")} placeholder="Digite para pesquisar..." />
              <Combobox.IndicatorGroup>
                <Combobox.ClearTrigger />
                <Combobox.Trigger />
              </Combobox.IndicatorGroup>
            </Combobox.Control>

            {errors.instituicaoEnsino?.message && <Text textStyle="xs" fontWeight="medium" color="var(--chakra-colors-fg-error)">{errors.instituicaoEnsino?.message}</Text>}

            <Portal>
              <Combobox.Positioner>
                <Combobox.Content minW="sm">
                  {loadingUniversities ? (
                    <HStack p="2">
                      <Spinner size="xs" borderWidth="1px" />
                      <Span>Carregando...</Span>
                    </HStack>
                  ) : errorUniversities ? (
                    <Span p="2" color="fg.error">
                      {{ errorUniversities }}
                    </Span>
                  ) : !collection.items || collection.items.length === 0 ? (
                    <Span p="2" color="fg.error">
                      Não há resultados
                    </Span>
                  ) : (
                    collection.items?.map((character) => (
                      <Combobox.Item key={character.name} item={character}>
                        <HStack justify="space-between" textStyle="sm">
                          <Span fontWeight="medium" truncate>
                            {character.name}
                          </Span>
                        </HStack>
                        <Combobox.ItemIndicator />
                      </Combobox.Item>
                    ))
                  )}
                </Combobox.Content>
              </Combobox.Positioner>
            </Portal>
          </Combobox.Root>
          <MeField register={register("curso")} label="Curso" customError={errors.curso?.message} />
          <MeField register={register("periodoAtual")} label="Período Atual" customError={errors.periodoAtual?.message} />
          <MeField register={register("emailInstitucional")} label="Email institucional" customError={errors.emailInstitucional?.message} />
        </Stack>
        <Flex justifyContent="right" mt={12}>
          <Button type="submit" colorPalette="blue" loading={loading}>Enviar Informações</Button>
        </Flex>
      </form>
    </Stack>
  );
};

export default VerificarMonitor;