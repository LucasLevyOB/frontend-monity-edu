import { Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";

const DefaultLayout = () => {
  return (
    <>
      <NavBar />
      <Box p={12}>
        <Outlet />
      </Box>
      <Toaster />
    </>
  );
};

export default DefaultLayout;