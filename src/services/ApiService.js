import axios from "axios";

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
  }

  /**
   * 
   * @param {*} payload 
   * @returns {Promise<ApiResponse<undefined>>}
   */
  async verificarMonitor(payload) {
    try {
      const response = await this.#request.post("/verificar-monitor", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: response.status === 200,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response ? error.response.data : "Network Error",
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
}