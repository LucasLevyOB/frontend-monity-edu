import { useNavigate } from "react-router-dom";
import { store } from "../stores";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { toaster } from "../components/ui/toaster";
import ApiService from "../services/ApiService";
import { confirm } from "../services/confirmService";

const useNavbarUserOptions = () => {
  const navigate = useNavigate();
  const aprovado = store.getState().auth.user?.statusMonitor === "APROVADO";
  const dispatch = useDispatch();
  const [deleteAlunoLoading, setDeleteAlunoLoading] = useState(false);
  const [deleteMonitorLoading, setDeleteMonitorLoading] = useState(false);
  const id = store.getState().auth.user?.id;

  const deleteAluno = async () => {
    const result = await confirm({
      title: "Deseja continuar?",
      message: "Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      confirmText: "Sim, continuar",
      cancelText: "Cancelar"
    });

    if (!result) {
      return;
    }

    const apiService = new ApiService();

    setDeleteAlunoLoading(true);
    const response = await apiService.deletarAluno(id);
    setDeleteAlunoLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao excluir sua conta. Tente novamente.",
      });
      return;
    }

    toaster.create({
      type: "success",
      title: "Conta excluída com sucesso!",
    });
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const deleteMonitor = async () => {
    const result = await confirm({
      title: "Deseja continuar?",
      message: "Você tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.",
      confirmText: "Sim, continuar",
      cancelText: "Cancelar"
    });

    if (!result) {
      return;
    }

    const apiService = new ApiService();

    setDeleteMonitorLoading(true);
    const response = await apiService.deletarMonitor(id);
    setDeleteMonitorLoading(false);

    if (!response.success) {
      toaster.create({
        type: "error",
        description: response.message ? response.message : "Desculpe, ocorreu um erro ao excluir sua conta. Tente novamente.",
      });
      return;
    }

    toaster.create({
      type: "success",
      title: "Conta excluída com sucesso!",
    });
    dispatch({ type: "LOGOUT" });
    navigate("/login");
  };

  const baseOptions = [
    {
      action: () => {
        dispatch({ type: "LOGOUT" });
        navigate("/login");
      },
      text: 'Sair'
    },
  ];

  const monitorOptions = [
    ...(
      !aprovado ?
        [
          {
            action: () => {
              navigate("/monitor/verificar-monitor");
            },
            text: 'Verificar Conta'
          },
        ] :
        []
    ),
    {
      action: () => {
        navigate(`/monitor/editar/${id}`);
      },
      text: 'Editar Conta',
    },
    {
      action: async () => {
        await deleteMonitor();
      },
      text: 'Deletar Conta',
      loading: deleteMonitorLoading,
    },
    ...baseOptions,
  ];

  const alunoOptions = [
    {
      action: () => {
        navigate(`/aluno/editar/${id}`);
      },
      text: 'Editar Conta',
    },
    {
      action: async () => {
        await deleteAluno();
      },
      text: 'Deletar Conta',
      loading: deleteAlunoLoading,
    },
    ...baseOptions
  ];


  /**
   * 
   * @param {"monitor" | "aluno"} userType 
   * @returns 
   */
  const getUserOptions = (userType) => {
    if (userType === "MONITOR") {
      return monitorOptions;
    }

    if (userType === "ALUNO") {
      return alunoOptions;
    }

    return [];
  };

  return {
    getUserOptions
  };
};

export default useNavbarUserOptions;