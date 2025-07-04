import { useNavigate } from "react-router-dom";
import { store } from "../stores";
import { useDispatch } from "react-redux";

const useNavbarUserOptions = () => {
  const navigate = useNavigate();
  const aprovado = store.getState().auth.user?.status === "APROVADO";
  const dispatch = useDispatch();

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
    ...baseOptions,
  ];

  const alunoOptions = [
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