import { Alert, Button, Field, Flex, Heading, HStack, Stack, Textarea } from "@chakra-ui/react";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import { validationSchemaEditarMonitoria } from "../validations/validationSchemaEditarMonitoria";
import { useForm } from "react-hook-form";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { useState, useEffect } from "react";
import MeField from "../components/MeField";
import MeFileUpload from "../components/MeFileUpload";
import { store } from "../stores";
import Helpers from "../Helpers";
import { useParams, useNavigate } from "react-router-dom";

const EditarMonitoria = () => {
  const resolver = useYupValidationResolver(validationSchemaEditarMonitoria);
  const { handleSubmit, register, formState: { errors, isValid }, setValue } = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();
  const credenciado = store.getState().auth.user?.statusMonitor === "APROVADO";

  useEffect(() => {
    const carregarMonitoria = async () => {
      const apiService = new ApiService();
      const response = await apiService.obterMonitoria(id);

      if (!response.success) {
        toaster.create({
          type: "error",
          description: "Erro ao carregar dados da monitoria",
        });
        navigate(`/monitor`);
        return;
      }

      const monitoria = response.data;
      setValue("titulo", monitoria.titulo);
      setValue("data", monitoria.data);
      setValue("horarioInicio", monitoria.horarioInicio?.substring(0, 5));
      setValue("horarioFim", monitoria.horarioFim?.substring(0, 5));
      setValue("linkReuniao", monitoria.linkReuniao);
      setValue("materia", monitoria.materia);
      setValue("topico", monitoria.topico);
      setValue("descricao", monitoria.descricao);

      setLoadingData(false);
    };

    carregarMonitoria();
  }, [id, setValue, navigate]);

  const sendData = async (data) => {
    if (!isValid) {
      return;
    }

    const apiService = new ApiService();

    const payload = {
      ...data,
      data: Helpers.DateHelper.formatDate(data.data),
    };

    setLoading(true);
    const response = await apiService.atualizarMonitoria(id, payload);
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: "Desculpe, ocorreu um erro ao atualizar a monitoria",
      });
      return;
    }

    toaster.create({
      type: "success",
      description: "Monitoria atualizada com sucesso.",
    });

    navigate(`/monitor/editar-monitoria/${id}`);
  };

  if (loadingData) {
    return (
      <Stack gap={10} w="100%" maxW="764px" m="auto">
        <Heading size="xl" as="h1">Carregando...</Heading>
      </Stack>
    );
  }

  return (
    <>
      {
        credenciado ? (
          <Stack gap={10} w="100%" maxW="764px" m="auto">
            <Heading size="xl" as="h1">Editar Monitoria</Heading>
            <form onSubmit={handleSubmit(async (data) => await sendData(data))} encType="multipart/form-data">
              <Stack gap={8} height="calc(100vh - 88px - 96px - 30px - 40px - 40px - 48px)" overflow="auto">
                <MeField register={register("titulo")} label="Título" customError={errors.titulo?.message} />
                <HStack spaceX={8}>
                  <MeField register={register("data")} type="date" label="Data" customError={errors.data?.message} />
                  <MeField register={register("horarioInicio")} label="Início" type="time" customError={errors.horarioInicio?.message} />
                  <MeField register={register("horarioFim")} label="Fim" type="time" customError={errors.horarioFim?.message} />
                </HStack>
                <MeField register={register("linkReuniao")} label="Link da Reunião" customError={errors.linkReuniao?.message} />
                <MeField register={register("materia")} label="Materia" customError={errors.materia?.message} />
                <MeField register={register("topico")} label="Tópico" customError={errors.topico?.message} />
                <Field.Root required>
                  <Field.Label>
                    Descrição
                  </Field.Label>
                  <Textarea {...register("descricao")} label="" size="xl" />
                  {
                    errors.descricao?.message &&
                    <Field.ErrorText>
                      {errors.descricao?.message}
                    </Field.ErrorText>
                  }
                </Field.Root>
                <MeFileUpload register={register("arquivos")} maxFiles={5} label="Anexar Arquivos" customError={errors.arquivos?.message} />
              </Stack>
              <Flex justifyContent="right" mt={12}>
                <Button type="submit" colorPalette="blue" loading={loading}>Atualizar</Button>
              </Flex>
            </form>
          </Stack>

        ) : (
          <Alert.Root status="warning">
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>Conta não verificada</Alert.Title>
              <Alert.Description>
                Por favor, verifique sua conta para poder editar monitorias.
              </Alert.Description>
            </Alert.Content>
          </Alert.Root>
        )
      }
    </>
  );
};

export default EditarMonitoria;