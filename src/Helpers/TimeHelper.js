class TimeHelper {
  /**
   * 
   * @param {Number} time 
   */
  async delay(time) {
    await new Promise(resolve => setTimeout(resolve, time));
  }
}

export default new TimeHelper();

/**
 * @typedef {Object} TimeHelper
 * @property {function(Number): Promise<void>} dalay - Verifica se a primeira data é posterior à segunda.
 */