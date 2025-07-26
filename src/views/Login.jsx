import { Button, Flex, Heading, Image, Stack, Text } from "@chakra-ui/react";
import Logo from '../assets/logo.png';
import Mascote from '../assets/mascotev.png';
import { validationSchemaLogin } from "../validations/validationSchemaLogin";
import { useYupValidationResolver } from "../hooks/useYupValidationResolver";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../services/ApiService";
import { toaster } from "../components/ui/toaster";
import MeField from "../components/MeField";
import { useDispatch } from "react-redux";


const Login = () => {
  const resolver = useYupValidationResolver(validationSchemaLogin);
  const { handleSubmit, register, formState: { errors } } = useForm({ resolver, mode: "onChange" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = async (data) => {
    const apiService = new ApiService();

    setLoading(true);
    const response = await apiService.login(data.email, data.senha);
    setLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao fazer o login",
      });
      return;
    }

    dispatch({ type: "LOGIN_SUCCESS", payload: response.data });

    if (response.data.userType === "ALUNO") {
      navigate("/aluno");
    } else {
      navigate("/monitor");
    }
  };

  return (
    <>
      <Flex height="100vh" backgroundColor="blue" p={4}>
        <Flex maxW="1154px" w="full" m="auto" backgroundColor="white" justifyContent={["center", "center", "center", "space-between"]} alignItems="center" py={14} px={24} borderRadius="2xl" boxShadow="2xl">
          <Image src={Mascote} w="362px" h="543px" hideBelow="lg" />
          <Stack w="100%" maxW="392px" alignItems="center">
            <Image src={Logo} height="81px" w="256px" mb={12} />
            <Heading size="md" mb={9}>Bem vindo a MonityEdu</Heading>
            <form onSubmit={handleSubmit(async (data) => await login(data))} style={{ width: "100%" }}>
              <Stack gap={6}>
                <MeField register={register("email")} label="Email" customError={errors.email?.message} w="full" />
                <MeField register={register("senha")} label="Senha" type="password" customError={errors.senha?.message} />
              </Stack>
              <Flex justifyContent="center" mt={8}>
                <Button type="submit" colorPalette="blue" loading={loading}>Entrar</Button>
              </Flex>
            </form>
            <Text mt={9}>
              Não tem uma conta?
              <Link to="/cadastro"> Criar nova conta</Link>
            </Text>
          </Stack>
        </Flex>
      </Flex>
    </>
  );
};

export default Login;