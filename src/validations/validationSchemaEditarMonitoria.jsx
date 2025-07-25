import * as Yup from "yup";

export const validationSchemaEditarMonitoria = Yup.object().shape({

  titulo: Yup.string().required("Título é obrigatório"),

  data: Yup.date()
    .typeError("Data deve ser uma data válida"),

  horarioInicio: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora de início deve estar no formato HH:mm")
    .test("is-valid-time", "Hora de início deve ser uma hora válida", (value) => {
      if (!value) return false;
      const [hours, minutes] = value.split(":").map(Number);
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    }),

  horarioFim: Yup.string()
    .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Hora de fim deve estar no formato HH:mm")
    .test("is-valid-time", "Hora de fim deve ser uma hora válida", (value) => {
      if (!value) return false;
      const [hours, minutes] = value.split(":").map(Number);
      return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
    })
    .test("is-after-start", "Hora de fim deve ser posterior à hora de início", function (fim) {
      const inicio = this.parent.inicio;
      if (!inicio || !fim) return true;
      const inicioDate = new Date(`1970-01-01T${inicio}:00`);
      const fimDate = new Date(`1970-01-01T${fim}:00`);
      return fimDate > inicioDate;
    }),

  linkReuniao: Yup.string()
    .url("Link deve ser uma URL válida")
    .max(200, "Link deve ter no máximo 200 caracteres"),

  materia: Yup.string()
    .max(100, "Matéria deve ter no máximo 100 caracteres"),

  topico: Yup.string()
    .max(100, "Tópico deve ter no máximo 100 caracteres"),

  descricao: Yup.string()
    .max(1000, "Descrição deve ter no máximo 1000 caracteres"),

  arquivos: Yup
    .mixed()
    .test("fileSize", "Tamanho de arquivo não suportado.", (value) => {
      if (value && value?.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].size > 5242880) {
            return false;
          }
        }
      }
      return true;
    })
    .test("fileType", "Formato de arquivo não suportado.", (value) => {
      if (value && value.length > 0) {
        for (let i = 0; i < value.length; i++) {
          if (value[i].type != "application/pdf") {
            return false;
          }
        }
      }
      return true;
    }
    ),
});