import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import { Link, Container, Typography, Divider, Stack, Button, Card } from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Logo from "../components/logo";
import Iconify from "../components/iconify";
// sections
import { ForgotPasswordForm } from "../sections/auth/forgotPassword";

// ----------------------------------------------------------------------

const StyledRoot = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const StyledContent = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100%",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function ForgotPassword() {
  const mdUp = useResponsive("up", "md", "");

  return (
    <>
      <Helmet>
        <title> Forgot Password </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <Card sx={{ minHeight: "50vh", marginTop: "20%", padding: "3%" }}>
            <StyledContent>
              <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                Forgot Password
              </Typography>

              <Divider sx={{ my: 3 }} />
              <Typography fontStyle="italic" gutterBottom sx={{ textAlign: "center" }}>
                Enter your registred email so we could get you back in
              </Typography>
              <ForgotPasswordForm />
            </StyledContent>
          </Card>
        </Container>
      </StyledRoot>
    </>
  );
}
