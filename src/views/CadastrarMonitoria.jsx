import { Box, Button, Field, Flex, Heading, HStack, Stack, Textarea } from "@chakra-ui/react";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import { validationSchemaCadastroMonitoria } from "../validations/validationSchemaCadastroMonitoria";
import { useForm } from "react-hook-form";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { useRef, useState } from "react";
import MeField from "../components/MeField";
import MeFileUpload from "../components/MeFileUpload";
import { store } from "../stores";
import Helpers from "../Helpers";
import { MeAvisoContaNaoVerificada } from "../components/MeAvisoContaNaoVerificada";

const CadastrarMonitoria = () => {
  const resolver = useYupValidationResolver(validationSchemaCadastroMonitoria);
  const { handleSubmit, register, formState: { errors, isValid }, reset, resetField } = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const credenciado = store.getState().auth.user?.statusMonitor === "APROVADO";
  const fileInputRef = useRef(null);

  const resetArquivos = () => {
    if (fileInputRef.current) {
      fileInputRef.current.querySelector("ul").innerHTML = "";
    }
  };

  const sendData = async (data) => {
    if (!isValid) {
      return;
    }

    const apiService = new ApiService();

    const payload = {
      ...data,
      data: Helpers.DateHelper.format(data.data),
    };

    setLoading(true);
    const response = await apiService.cadastrarMonitoria(payload);
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: "Desculpe, ocorreu um erro ao cadastrar a monitoria",
      });
      return;
    }

    toaster.create({
      type: "success",
      description: "Monitoria cadastrada com sucesso.",
    });

    reset();
    resetField("arquivos");
    resetArquivos();
  };

  return (
    <>
      {
        credenciado ? (
          <Stack gap={10} w="100%" maxW="764px" m="auto">
            <Heading size="xl" as="h1">Cadastrar Monitoria</Heading>
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
                <Field.Root invalid={errors.linkReuniao?.message}>
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
                <MeFileUpload ref={fileInputRef} register={register("arquivos")} maxFiles={5} label="Anexar Arquivos" customError={errors.arquivos?.message} />
              </Stack>
              <Flex justifyContent="right" mt={12}>
                <Button type="submit" colorPalette="blue" loading={loading}>Cadastrar</Button>
              </Flex>
            </form>
          </Stack>

        ) : (
          <MeAvisoContaNaoVerificada />
        )
      }
    </>
  );
};

export default CadastrarMonitoria;