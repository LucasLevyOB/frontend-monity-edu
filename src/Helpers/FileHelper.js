import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

class FileHelper {
    /**
     * Baixa um arquivo por url
     * @param {URL} url
     * @param {string} nome
     */
    downloadByUrl(url, nome) {
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", nome);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default new FileHelper();
