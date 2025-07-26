const monitorLinks = [
  {
    to: '/monitor',
    text: 'Home'
  },
  {
    to: '/monitor/cadastrar-monitoria',
    text: 'Cadastrar Monitoria'
  },
  {
    to: '/monitor/certificados',
    text: 'Certificados'
  }
];

const alunoLinks = [
  {
    to: '/aluno',
    text: 'Home'
  },
  {
    to: '/aluno/monitorias',
    text: 'Monitorias'
  },
];

/**
 * 
 * @param {boolean} isMonitor 
 * @returns 
 */
const getNavbarLinks = (type) => {
  if (type === "MONITOR") {
    return monitorLinks;
  }

  return alunoLinks;
};

export default getNavbarLinks;