import { Box } from "@chakra-ui/react";
import NavBar from "../components/NavBar";
import { Outlet } from "react-router-dom";
import { Toaster } from "../components/ui/toaster";

const DefaultLayout = () => {
  return (
    <>
      <NavBar position="sticky" top={0} zIndex={1000} />
      <Box p={12}>
        <Outlet />
      </Box>
      <Toaster />
      <div id="confirm-root"></div>
    </>
  );
};

export default DefaultLayout;