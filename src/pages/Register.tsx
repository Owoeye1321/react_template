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
import { RegisterForm } from "../sections/auth/register";

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

export default function LoginPage() {
  const mdUp = useResponsive("up", "md", "");

  return (
    <>
      <Helmet>
        <title> Sign Up </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <Card sx={{ minHeight: "50vh", marginTop: "20%", padding: "3%" }}>
            <StyledContent>
              <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                Sign up
              </Typography>

              <Divider sx={{ my: 3 }} />

              <RegisterForm />
            </StyledContent>
          </Card>
        </Container>
      </StyledRoot>
    </>
  );
}
