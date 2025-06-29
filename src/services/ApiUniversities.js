import axios from "axios";

/**
 * @template T
 * @typedef {Object} ApiResponse
 * @property {string | undefined} message
 * @property {boolean} success
 * @property {T | null | undefined} data
 */

export default class ApiUniversities {
  #baseURL;
  #request;

  constructor() {
    this.#baseURL = "http://universities.hipolabs.com";
    this.#request = axios.create({
      baseURL: this.#baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  /**
   * 
   * @param {*} name 
   * @returns {Promise<ApiResponse<undefined>>}
   */
  async search(value) {
    try {
      const response = await this.#request.get(`/search?name=${value}&limit=20`);

      return {
        success: response.status === 200,
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response ? error.response.data : "Desculpe, ocorreu um erro desconhico ao verificar o monitor.",
      };
    }
  }
}