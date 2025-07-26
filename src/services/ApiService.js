import axios from "axios";
import { store } from "../stores";
import Helpers from "../Helpers";

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {string | undefined} message
 * @property {boolean} success
 * @property {T | null | undefined} data
 */

export default class ApiService {
  #baseURL;
  #request;

  constructor() {
    this.#baseURL = "http://localhost:8080";
    this.#request = axios.create({
      baseURL: this.#baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.#request.interceptors.request.use((config) => {
      const token = store.getState().auth?.user?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  /**
   * 
   * @param {*} payload 
   * @returns {Promise<ApiResponse<undefined>>}
   */
  async verificarMonitor(payload) {
    try {
      const id = store.getState().auth?.user?.id;
      const response = await this.#request.post("/credenciar/monitor", { ...payload, monitorId: id });

      return {
        success: response.status === 201 && response.data.status === "success",
      };
    } catch (error) {
      return {
        success: false,
        message: error.response ? error.response.data : "Desculpe, ocorreu um erro desconhico ao verificar o monitor.",
      };
    }
  }

  /**
   * 
   * @param {string} email
   * @param {string} senha 
   * @returns {Promise<ApiResponse<undefined>>}
   */
  async login(email, senha) {
    try {
      const response = await this.#request.post("/auth/login", {
        email,
        senha
      });

      console.log(response);

      return {
        success: response.data.status === "success" && response.status === 200,
        data: response.data.data
      };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao fazer login.",
      };
    }
  }

  async cadastro(data, path = "/alunos/cadastro") {
    try {
      const response = await this.#request.post(path, data);

      return {
        success: response.data.status === "success" && response.status === 201,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao fazer login.",
      };
    }
  }

  async cadastrarMonitoria(data) {
    try {
      const response = await this.#request.post("/monitorias", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: response.data.status === "success" && response.status === 201,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao cadastrar a monitoria.",
      };
    }
  }

  /**
   * 
   * @param {{ topico: string, data: string }} filter 
   * @returns 
   */
  #formatStrFilter(filter) {
    let strFilter = "";

    if (filter.titulo?.trim()) {
      strFilter += `&titulo=${filter.titulo}`;
    }

    if (filter.topico?.trim()) {
      strFilter += `&topico=${filter.topico}`;
    }

    if (filter.data?.trim()) {
      strFilter += `&data=${filter.data}`;
    }

    return strFilter;
  }

  async monitoriasProximas(filter, page) {
    try {
      const status = "PENDENTE";
      const response = await this.#request.get(`/monitorias?status=${status}${this.#formatStrFilter(filter)}`);

      return {
        success: response.data.status === "success" && response.status === 200,
        data: { data: response.data.data }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao buscar as monitoria próximas.",
      };
    }
  }

  async monitoriasPassadas(filter, page) {
    try {
      const status = "REALIZADA";
      const response = await this.#request.get(`/monitorias?status=${status}${this.#formatStrFilter(filter)}`);

      return {
        success: response.data.status === "success" && response.status === 200,
        data: { data: response.data.data }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao buscar as monitoria passadas.",
      };
    }
  }

  async obterMonitoria(id) {
    try {
      const response = await this.#request.get(`/monitorias/${id}`);

      return {
        success: response.data.status === "success" && response.status === 200,
        data: response.data.data,
        message: "Monitoria obtida com sucesso"
      };
    } catch (error) {
      console.error("Erro ao obter monitoria:", error);

      if (error.response) {
        return {
          success: false,
          data: null,
          message: error.response.data?.message || "Erro ao buscar monitoria",
          statusCode: error.response.status
        };
      } else if (error.request) {
        return {
          success: false,
          data: null,
          message: "Erro de conexão com o servidor"
        };
      } else {
        return {
          success: false,
          data: null,
          message: "Erro inesperado ao buscar monitoria"
        };
      }
    }
  }

  async atualizarMonitoria(id, data) {
    try {
      const response = await this.#request.patch(`/monitorias/${id}/editar`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: response.data.status === "success" && response.status === 200,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao atualizar a monitoria.",
      };
    }
  }

  async cancelarMonitoria(id) {
    try {
      const response = await this.#request.patch(`/monitorias/${id}/cancelar`, {});

      return {
        success: response.data.status === "success" && response.status === 200,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao cancelar a monitoria.",
      };
    }
  }

  async marcarMonitoriaComoRealizada(id) {
    try {
      const response = await this.#request.patch(`/monitorias/${id}/realizada`, {});

      return {
        success: response.data.status === "success" && response.status === 200,
        data: response.data.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao marcar a monitoria como realizada.",
      };
    }
  }

  async gerarCertificado(id) {
    try {
      const response = await this.#request.post(`/certificados`, { monitoriaId: id });

      return {
        success: response.data.status === "success" && response.status === 201,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao gerar o certificado.",
      };
    }
  }

  /**
   * 
   * @param {String} id 
   * @returns {Promise<ApiResponse<{nome: String, url: URL}>>}
   */
  async baixarCertificado(id) {
    try {
      const response = await this.#request.get(`/certificados/${id}/download`, {
        responseType: "blob",
      });

      if (response.status !== 200) {
        return {
          success: false,
          message: "Desculpe, ocorreu um erro ao baixar o certificado.",
        };
      }


      const url = window.URL.createObjectURL(new Blob([response.data]));
      const nome = response.headers["content-disposition"]?.split("filename=")[1]?.replace(/"/g, "") || "certificado.pdf";
      return {
        success: true,
        data: {
          url,
          nome
        }
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao baixar o certificado.",
      };
    }
  }

  /**
   * 
   * @param {*} filter 
   * @returns {Promise<ApiResponse<{id: String, nomeArquivo: String ,tituloMonitoria: String, dataCriacao: String}[]>>}
   */
  async certificados(filter) {
    try {
      const response = await this.#request.get(`/certificados?${this.#formatStrFilter(filter)}`);

      return {
        success: response.data.status === "success" && response.status === 200,
        data: response.data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao buscar os certificados.",
      };
    }
  }

  /**
   * 
   * @param {*} filter 
   * @returns {Promise<ApiResponse<{Object[]>>}
   */
  async minhasInscricoes(filter, status) {
    try {
      const response = await this.#request.get(`/alunos/minhas-inscricoes?status=${status}${this.#formatStrFilter(filter)}`);

      return {
        success: response.data.status === "success" && response.status === 200,
        data: { data: response.data.data },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao buscar as monitorias inscritas.",
      };
    }
  }
}