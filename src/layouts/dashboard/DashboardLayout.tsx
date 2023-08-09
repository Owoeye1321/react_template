import React from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
// @mui
import { styled } from "@mui/material/styles";
//
import Snackbar from "@mui/material/Snackbar";
import Header from "./header";
import Nav from "./nav";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100vh",
});

const Main = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

type DashboardProps = {
  children: React.ReactNode; // 👈️ type children
};

// ----------------------------------------------------------------------

export default function DashboardLayout(props: DashboardProps) {
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("Alert");
  const [type, setType] = useState<AlertColor>("success");
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const handleClose = () => {
    setAlertOpen(false);
    setAlertMessage("");
  };

  const notify = async (type: AlertColor, message: string) => {
    await setAlertMessage(message);
    await setType(type);
    await setAlertOpen(true);
  };
  return (
    <StyledRoot>
      <Header onOpenNav={() => setOpen(true)} />

      <Nav openNav={open} onCloseNav={() => setOpen(false)} />

      <Main>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alertOpen}
          onClose={handleClose}
          message="I love snacks"
          key={"top" + "center"}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
            {alertMessage}!
          </Alert>
        </Snackbar>
        <Outlet context={[notify]} />
      </Main>
    </StyledRoot>
  );
}
