import * as Yup from "yup";

export const validationSchemaLogin = Yup.object().shape({
  email: Yup.string().email("Campo deve ser um email válido").required("Campo Obrigatório"),
  senha: Yup.string().required("Campo Obrigatório"),
});
