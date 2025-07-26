import { useState } from "react";
import { Button, Flex, Heading, Stack, Text, Box, Image, Toast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import MeField from "../components/MeField";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import { validationSchemaCadastro } from "../validations/validationSchemaCadastro";
import ApiService from "../services/ApiService";
import { Toaster, toaster } from "../components/ui/toaster";
import { useNavigate } from "react-router-dom";
import Logo from '../assets/logo.png';

const Cadastro = () => {
  const resolver = useYupValidationResolver(validationSchemaCadastro);
  const { handleSubmit, register, formState: { errors }, watch } = useForm({
    resolver, defaultValues: {
      tipoUsuario: "aluno"
    }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const sendData = async (data) => {
    const apiService = new ApiService();

    setLoading(true);
    const response = await apiService.cadastro(data, data.tipoUsuario === "monitor" ? "/monitores/cadastro" : "/alunos/cadastro");
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao realizar o cadastro. Tente novamente.",
      });
      return;
    }

    toaster.create({
      type: "success",
      title: data.tipoUsuario === "monitor" ? "Monitor cadastrado com sucesso!" : "Cadastro realizado com sucesso!",
      description: data.tipoUsuario === "monitor" ? "Seu cadastro foi realizado, realize a aprovação" : "Agora você pode acessar a área do aluno.",
    });
    navigate("/login");
  };

  return <Flex height="100vh" backgroundColor="blue" p={4} alignItems={"center"} justifyContent="center">
    <Flex
      direction="column"
      gap={6}
      w="100%"
      maxW="1200px"
      p={12}
      bg="white"
      borderRadius="16px"
      boxShadow="xl"
      alignItems={"center"}
    >
      <Stack textAlign="center" gap={4}>
        <Flex justify="center">
          <Image src={Logo} alt="MonityEdu" h="80px" w="auto" />
        </Flex>
        <Text fontSize="md" color="gray.700">Bem-vindo à MonityEdu</Text>
      </Stack>

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

            {watch('tipoUsuario') === "aluno" && (
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

            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.700">Tipo de usuário</Text>
              <select
                {...register("tipoUsuario")}
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
                <option value="aluno">Aluno</option>
                <option value="monitor">Monitor</option>
              </select>
              {errors.tipoUsuario && (
                <Text color="red.500" fontSize="sm" mt={1}>
                  {errors.tipoUsuario.message}
                </Text>
              )}
            </Box>
          </Stack>

          <Button
            type="submit"
            colorPalette="blue"
            loading={loading}
            w="100%"
            mt={6}
          >
            Cadastrar
          </Button>
        </form>
      </Stack>
    </Flex>
  </Flex>;
};

export default Cadastro;