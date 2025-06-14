import { useState } from "react";
import { Button, Flex, Heading, Stack } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import MeField from "../components/MeField";
import MeFileUpload from "../components/MeFileUpload";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import { validationSchemaVerificarMonitor } from "../validations/validationSchemaVerificarMonitor";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";

const VerificarMonitor = () => {
  const resolver = useYupValidationResolver(validationSchemaVerificarMonitor);
  const { handleSubmit, register, formState: { errors, isValid } } = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      title: "Sucesso ao enviar dados de credenciamento.",
      description: "Por favor aguarde o período de análise dos dados informados, retornaremos assim que possível.",
    });
    navigate("/monitor");
  };

  return (
    <Stack gap={10} w="100%" maxW="764px" m="auto">
      <Heading size="xl" as="h1">Verificação de credenciamento</Heading>
      <form onSubmit={handleSubmit(async (data) => await sendData(data))}>
        <Stack gap={8}>
          <MeField register={register("instituicaoEnsino")} label="Instituição de ensino" customError={errors.instituicaoEnsino?.message} />
          <MeField register={register("curso")} label="Curso" customError={errors.curso?.message} />
          <MeField register={register("periodoAtual")} label="Período Atual" customError={errors.periodoAtual?.message} />
          <MeField register={register("emailInstitucional")} label="Email institucional" customError={errors.emailInstitucional?.message} />
          <MeFileUpload register={register("comprovante")} label="Comprovante de vínculo acadêmico" customError={errors.comprovante?.message} />
        </Stack>
        <Flex justifyContent="right" mt={12}>
          <Button type="submit" colorPalette="blue" loading={loading}>Enviar Informações</Button>
        </Flex>
      </form>
    </Stack>
  );
};

export default VerificarMonitor;