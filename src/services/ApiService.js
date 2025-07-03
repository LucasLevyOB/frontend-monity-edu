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

  #monitoriasMock = [
    {
      id: "1adb",
      titulo: "Climas do Brasil",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-07-02",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "3adb",
      titulo: "Climas do Brasil 2",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-07-02",
      inicio: "20:30",
      fim: "21:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
  ];

  /**
   * 
   * @param {*} payload 
   * @returns {Promise<ApiResponse<undefined>>}
   */
  async nextMonitorias(payload, page = 1) {
    try {
      // const response = await this.#request.get(payload);

      // return {
      //   success: response.data.status === "success" && response.status === 200,
      //   // data: response.data.data
      //   data: this.#monitoriasMock,
      // };

      await Helpers.TimeHelper.delay(2000);

      const limit = 5; // Simulating a limit for pagination
      const startIndex = (page - 1) * limit;

      return {
        success: true,
        data: {
          data: this.#monitoriasMock.slice(startIndex, startIndex + limit),
          page: page,
          totalPages: 2,
          totalItems: this.#monitoriasMock.length
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao buscar as monitorias.",
      };
    }
  }

  #pastMonitoriasMock = [
    {
      id: "2adb1",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb2",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb3",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb4",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb5",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb6",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb7",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb8",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb9",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
    {
      id: "2adb10",
      titulo: "Climas Globais",
      descricao: "A maior parte do território brasileiro encontra-se nas áreas de baixas latitudes, entre o Equador e o Trópico de Capricórnio. Por essa razão, predominam os climas quentes e úmidos.",
      data: "2025-06-30",
      inicio: "19:30",
      fim: "20:30",
      materia: "Geografia",
      link: "https://meet.google.com/abc-abcd-abc",
    },
  ];

  /**
   * 
   * @param {*} payload 
   * @returns {Promise<ApiResponse<{data: Array, page: number, totalPages: number, totalItems: number}>>}
   */
  async pastMonitorias(searchText, page = 1) {
    try {
      // const response = await this.#request.get(payload);

      // return {
      //   success: response.data.status === "success" && response.status === 200,
      //   // data: response.data.data
      //   data: this.#monitoriasMock,
      // };

      await Helpers.TimeHelper.delay(2000);
      const limit = 5; // Simulating a limit for pagination
      const startIndex = (page - 1) * limit;

      return {
        success: true,
        data: {
          data: this.#pastMonitoriasMock.slice(startIndex, startIndex + limit),
          page: page,
          totalPages: 2,
          totalItems: this.#pastMonitoriasMock.length
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message ? error.response.data.message : "Desculpe, ocorreu um erro desconhecido ao buscar as monitorias.",
      };
    }
  }
}