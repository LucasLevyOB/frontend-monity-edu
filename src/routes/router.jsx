import { createBrowserRouter, createRoutesFromElements, Route, Router, Routes } from "react-router-dom";
import DashboardMonitor from "../views/DashboardMonitor";
import CadastrarMonitoria from "../views/CadastrarMonitoria";
import Certificados from "../views/Certificados";
import DefaultLayout from "../layouts/DefaultLayout";
import VerificarMonitor from "../views/VerificarMonitor";
import Login from "../views/Login";
import DashboardAluno from "../views/DashboardAluno";
import PrivateRoutes from "./PrivateRoutes";
import Cadastro from "../views/Cadastro";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PrivateRoutes />}>
        <Route path="/monitor" element={<DefaultLayout />}>
          <Route index element={<DashboardMonitor />} />
          <Route path='/monitor/cadastrar-monitoria' element={<CadastrarMonitoria />} />
          <Route path='/monitor/certificados' element={<Certificados />} />
          <Route path='/monitor/verificar-monitor' element={<VerificarMonitor />} />
        </Route>
        <Route path="/aluno" element={<DefaultLayout />}>
          <Route index element={<DashboardAluno />} />
          {/* <Route path='/monitor/monitorias-ofertadas' element={<MonitoriasOfertadas />} /> */}
        </Route>
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
    </>
  )
);

export default router;