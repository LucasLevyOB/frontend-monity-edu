import * as yup from "yup";

export const validationSchemaLogin = yup.object({
  email: yup.string().email("Campo deve ser um email válido").required("Campo Obrigatório"),
  senha: yup.string().required("Campo Obrigatório"),
});
