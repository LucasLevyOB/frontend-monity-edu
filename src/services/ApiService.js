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
}