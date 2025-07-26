import { useEffect, useState } from "react";
import { Button, Flex, Heading, Stack, Text, Box, Image, Toast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import MeField from "../components/MeField";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import { store } from "../stores";
import { validationSchemaEditarUsuario } from "../validations/validationSchemaEditarUsuario";

const EditarUsuario = () => {
  const resolver = useYupValidationResolver(validationSchemaEditarUsuario);
  const { handleSubmit, register, formState: { errors }, setValue } = useForm({ resolver });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const tipoUsuario = store.getState().auth.user?.userType || "ALUNO";
  const id = store.getState().auth.user?.id;

  const returnToHome = () => {
    navigate(`/`);
  };

  useEffect(() => {
    setValue("nome", store.getState().auth.user?.nome);
    setValue("email", store.getState().auth.user?.email);
    setValue("senha", "");
    setValue("confirmaSenha", "");
    if (tipoUsuario === "ALUNO") {
      setValue("serieEscolar", store.getState().auth.user?.serieEscolar || "");
    }

  }, []);

  const sendData = async (data) => {
    const apiService = new ApiService();


    Object.keys(data).forEach(key => {
      if (data[key] === "" || data[key] === null || data[key] === undefined || key === "email") {
        delete data[key];
      }
    });

    setLoading(true);
    const response = await apiService.editarUsuario(data, id, tipoUsuario === "MONITOR" ? "/monitores" : "/alunos");
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao atualizar o cadastro. Tente novamente.",
      });
      return;
    }

    toaster.create({
      type: "success",
      title: tipoUsuario === "MONITOR" ? "Monitor atualizado com sucesso!" : "Atualização realizada com sucesso!",
    });

    store.dispatch({
      type: "UPDATE_USER",
      payload: {
        user: {
          ...store.getState().auth.user,
          ...data
        }
      }
    });
  };

  return (

    <Stack w="100%" maxW="500px" mx="auto" mt={6} gap={6}>
      <form style={{ width: "100%" }} onSubmit={handleSubmit(async (data) => await sendData(data))}>
        <Stack gap={4}>
          <MeField
            register={register("nome")}
            label="Nome"
            type="name"
            placeholder="Digite seu nome"
            customError={errors.nome?.message}
          />
          <MeField
            register={register("email")}
            label="Email"
            type="email"
            placeholder="Digite seu email"
            customError={errors.email?.message}
            disabled={true}
          />
          <MeField
            register={register("senha")}
            label="Senha"
            type="password"
            placeholder="Digite sua senha"
            customError={errors.senha?.message}
          />
          <MeField
            register={register("confirmaSenha")}
            label="Confirme sua senha"
            type="password"
            placeholder="Confirme sua senha"
            customError={errors.confirmaSenha?.message}
          />

          {tipoUsuario === "ALUNO" && (
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Série Escolar</Text>
              <select
                {...register("serieEscolar")}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: `2px solid ${errors.tipoUsuario ? "#E53E3E" : "#E2E8F0"}`,
                  borderRadius: "8px",
                  fontSize: "16px",
                  backgroundColor: "white",
                  outline: "none"
                }}
              >
                <option value="">Selecione a série</option>
                <option value="PRIMEIRO_ANO_ENSINO_MEDIO">Primeiro ano do ensino médio</option>
                <option value="SEGUNDO_ANO_ENSINO_MEDIO">Segundo ano do ensino médio</option>
                <option value="TERCEIRO_ANO_ENSINO_MEDIO">Terceiro ano do ensino médio</option>
              </select>
              {errors.serieEscolar && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.serieEscolar.message}
                </Text>
              )}
            </Box>
          )}
        </Stack>

        <Flex justifyContent="right" mt={12}>
          <Button colorPalette="gray" variant="outline" mr={4} onClick={returnToHome}>Cancelar</Button>
          <Button type="submit" colorPalette="blue" loading={loading}>Atualizar</Button>
        </Flex>
      </form>
    </Stack>
  );
};

export default EditarUsuario;