import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import DashboardMonitor from "./views/DashboardMonitor";
import CadastrarMonitoria from "./views/CadastrarMonitoria";
import Certificados from "./views/Certificados";
import DefaultLayout from "./layouts/DefaultLayout";
import VerificarMonitor from "./views/VerificarMonitor";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<DefaultLayout />}>
      <Route path="monitor">
        <Route index element={<DashboardMonitor />} />
        <Route path='/monitor/cadastrar-monitoria' element={<CadastrarMonitoria />} />
        <Route path='/monitor/certificados' element={<Certificados />} />
        <Route path='/monitor/verificar-monitor' element={<VerificarMonitor />} />
      </Route>
      {/* <Route path="aluno">
        <Route index element={<DashboardAluno />} />
        <Route path='/monitor/monitorias-ofertadas' element={<MonitoriasOfertadas />} />
      </Route> */}
    </Route>
  )
);

export default router;