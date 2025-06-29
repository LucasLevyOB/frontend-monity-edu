import { useNavigate } from "react-router-dom";

const useNavbarUserOptions = () => {
  const navigate = useNavigate();

  const baseOptions = [
    {
      action: () => console.log('sair'),
      text: 'Sair'
    },
  ];

  const monitorOptions = [
    {
      action: () => {
        navigate("/monitor/verificar-monitor");
      },
      text: 'Verificar Conta'
    },
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