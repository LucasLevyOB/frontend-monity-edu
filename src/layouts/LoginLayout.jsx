import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";

const DefaultLayout = () => {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
};

export default DefaultLayout;