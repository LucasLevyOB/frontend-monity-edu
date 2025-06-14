import * as yup from "yup";

export const validationSchemaVerificarMonitor = yup.object({
  instituicaoEnsino: yup.string().required("Campo Obrigatório"),
  curso: yup.string().required("Campo Obrigatório"),
  periodoAtual: yup.string().required("Campo Obrigatório"),
  emailInstitucional: yup.string().email("Campo deve ser um email válido").required("Campo Obrigatório"),
  comprovante: yup.mixed().required("Campo Obrigatório").test("fileType", "O arquivo deve ser um PDF", (value) => {
    if (!value || !value[0]) return false;
    const file = value[0];
    return file.type === "application/pdf";
  }
  ),
});
