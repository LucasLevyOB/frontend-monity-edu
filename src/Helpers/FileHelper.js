import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

class FileHelper {
    /**
     * Baixa um arquivo por url
     * @param {string} url
     * @param {string} id
     */
    downloadByUrl(url, id) {
        const linkUrl = window.URL.createObjectURL(new Blob([url]));
        const link = document.createElement("a");
        link.href = linkUrl;
        link.setAttribute("download", `certificado_${id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

export default new FileHelper();
