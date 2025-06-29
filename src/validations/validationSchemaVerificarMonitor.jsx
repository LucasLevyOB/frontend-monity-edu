import * as yup from "yup";

export const validationSchemaVerificarMonitor = yup.object({
  instituicaoEnsino: yup.string().required("Campo Obrigatório"),
  curso: yup.string().required("Campo Obrigatório"),
  periodoAtual: yup.string().required("Campo Obrigatório"),
  emailInstitucional: yup.string().email("Campo deve ser um email válido").required("Campo Obrigatório"),
});
