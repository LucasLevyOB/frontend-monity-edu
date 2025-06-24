import * as Yup from "yup";

export const validationSchemaCadastro = Yup.object().shape({

  nome: Yup.string()
    .required("Nome é obrigatório")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  
  email: Yup.string()
    .required("Email é obrigatório")
    .email("Email deve ter um formato válido")
    .max(100, "Email deve ter no máximo 100 caracteres"),
  
  senha: Yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres"),
  
  confirmaSenha: Yup.string()
    .required("Senha é obrigatória")
    .oneOf([Yup.ref('senha'), null], "As senhas devem ser iguais")
    .min(6, "Senha deve ter pelo menos 6 caracteres")
    .max(50, "Senha deve ter no máximo 50 caracteres"),

  serieEscolar: Yup.string()
    .when('tipoUsuario', {
      is: "aluno",
      then: (schema) => schema.required('Série escolar é obrigatória'),
      otherwise: (schema) => schema.notRequired()
    })
});