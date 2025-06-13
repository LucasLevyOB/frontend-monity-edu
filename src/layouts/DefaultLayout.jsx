import { Box } from "@chakra-ui/react"
import NavBar from "../components/NavBar"
import { Outlet } from "react-router-dom"

const DefaultLayout = () => {
  return (
    <>
      <NavBar />
      <Box p={12}>
        <Outlet />
      </Box>
    </>
  )
}

export default DefaultLayout