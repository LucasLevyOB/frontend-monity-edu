import { useState } from "react";
import { toaster } from "../components/ui/toaster";
import ApiService from "../services/ApiService";
import Helpers from "../Helpers";
import { MdCheck, MdDeleteOutline, MdFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const useMonitoria = ({ monitoria, onCancelar, onRealizada }) => {
  const [loadingCancelar, setLoadingCancelar] = useState(false);
  const [loadingRealizada, setLoadingRealizada] = useState(false);
  const navigate = useNavigate();

  const handleGerarCertificado = async () => {
    const apiService = new ApiService();

    toaster.create({
      type: "info",
      description: "Gerando certificado da monitoria.",
    });

    setLoadingCancelar(true);
    const response = await apiService.gerarCertificado(monitoria.id);
    setLoadingCancelar(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao gerar o certificado da monitoria",
      });
      return;
    }

    toaster.create({
      type: "success",
      description: "Certificado gerado com sucesso.",
    });
    navigate("/monitor/certificados");
  };

  const handleCancelar = async () => {
    const apiService = new ApiService();

    toaster.create({
      type: "info",
      description: "Iniciando cancelamento da monitoria.",
    });

    setLoadingCancelar(true);
    const response = await apiService.cancelarMonitoria(monitoria.id);
    setLoadingCancelar(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao cancelar a monitoria",
      });
      return;
    }

    toaster.create({
      type: "success",
      description: "Monitoria cancelada com sucesso.",
    });

    onCancelar();
  };

  const handleRealizada = async () => {
    const apiService = new ApiService();

    toaster.create({
      type: "info",
      description: "Iniciando marcar monitoria como realizada.",
    });

    setLoadingRealizada(true);
    const response = await apiService.marcarMonitoriaComoRealizada(monitoria.id);
    setLoadingRealizada(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao marcar monitoria como realizada",
      });
      return;
    }

    toaster.create({
      type: "success",
      description: "Sucesso ao marcar monitoria como realizada.",
    });

    onRealizada();
  };

  const checkIsAfter = () => {
    if (!monitoria) {
      return;
    }

    const now = new Date();

    return Helpers.DateHelper.isAfter(now, `${monitoria.data}T${monitoria.horarioFim}:00`);
  };

  const items = [
    {
      icon: MdCheck,
      label: "Marcar Como Realizada",
      conditional: monitoria?.status === 'PENDENTE' && checkIsAfter(),
      loading: loadingRealizada,
      onClick: handleRealizada,
    },
    {
      icon: MdDeleteOutline,
      label: "Cancelar Monitoria",
      conditional: monitoria?.status === 'PENDENTE',
      loading: loadingCancelar,
      onClick: handleCancelar,
    },
    {
      icon: MdFileDownload,
      conditional: monitoria?.status === 'REALIZADA',
      label: "Gerar Certificado",
      onClick: handleGerarCertificado,
    },
  ];

  return {
    items,
  };
};

export default useMonitoria;