import * as Yup from "yup";

export const validationSchemaEditarUsuario = Yup.object().shape({

  nome: Yup.string()
    .max(100, "Nome deve ter no máximo 100 caracteres"),

  email: Yup.string()
    .email("Email deve ter um formato válido")
    .max(100, "Email deve ter no máximo 100 caracteres"),

  senha: Yup.string()
    .notRequired()
    .test("senha-length", "Senha deve ter pelo menos 6 caracteres", value => {
      if (!value) return true;
      return value.length >= 6;
    })
    .max(50, "Senha deve ter no máximo 50 caracteres"),

  confirmaSenha: Yup.string()
    .oneOf([Yup.ref('senha'), null], "As senhas devem ser iguais"),

  // .min(6, "Senha deve ter pelo menos 6 caracteres")
  // .max(50, "Senha deve ter no máximo 50 caracteres"),

  serieEscolar: Yup.string()
});