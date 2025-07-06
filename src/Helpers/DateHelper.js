import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

class DateHelper {
    /**
     * Retorna se a primeira data é posterior à segunda.
     * @param {string|Date} date1
     * @param {string|Date} date2
     * @returns {number}
     */
    isAfter(date1, date2) {
        const d1 = dayjs(date1);
        const d2 = dayjs(date2);

        return d1.isAfter(d2);
    }

    formatDate(date, format = "YYYY-MM-DD") {
        return dayjs(date).format(format);
    }
}

export default new DateHelper();
/**
 * @typedef {import('dayjs').Dayjs} Dayjs
 */
/**
 * @typedef {Object} DateHelper
 * @property {function(string|Date, string|Date): boolean} isAfter - Verifica se a primeira data é posterior à segunda.
 */
