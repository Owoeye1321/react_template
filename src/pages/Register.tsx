import { useState } from "react";
import { Helmet } from "react-helmet-async";
// @mui
import { styled } from "@mui/material/styles";
import { Avatar, Container, Typography, Divider, Button, Box, Card } from "@mui/material";
// hooks
import useResponsive from "../hooks/useResponsive";
// components
import Logo from "../components/logo";
import Iconify from "../components/iconify";
// sections
import { RegisterForm } from "../sections/auth/register";
import { useContexts } from "../context";
import { useNavigate } from "react-router-dom";

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

export default function RegisterPage() {
  const [uploadImage, setUploadImage] = useState(false);
  const [success, setSuccess] = useState(false);
  const { set_loading } = useContexts();
  const navigate = useNavigate();

  const mdUp = useResponsive("up", "md", "");
  const setSwitch = async () => {
    await setUploadImage(!uploadImage);
    await set_loading(false);
  };

  const setSuccessRes = async () => {
    await setSuccess(true);
    await setUploadImage(false);
    await set_loading(false);
  };
  return (
    <>
      <Helmet>
        <title> Sign Up </title>
      </Helmet>

      <StyledRoot>
        <Container maxWidth="sm">
          <Card sx={{ minHeight: "50vh", marginTop: "20%", padding: "3%" }}>
            {!success ? (
              <StyledContent>
                <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                  {!uploadImage ? "Sign up" : "Upload your picture"}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <RegisterForm uploadImage={uploadImage} setSwitch={setSwitch} setSuccessRes={setSuccessRes} />
              </StyledContent>
            ) : (
              <Box textAlign="center">
                <Card
                  sx={{
                    height: "50%",
                    width: "50%",
                    margin: "auto",
                    borderRadius: "50%",
                    padding: "10px",
                  }}
                >
                  <Avatar
                    sx={{
                      height: "100%",
                      width: "100%",
                      margin: "auto",
                    }}
                    component="label"
                    src="/assets/images/mark-img.png"
                    alt="photoURL"
                    htmlFor="fileImg"
                  />
                </Card>
                <Typography variant="h4" textAlign="center" marginTop="20px">
                  Account Created Successfully
                </Typography>
                <Typography textAlign="center">
                  Your account has been successfully created and it is being reviewed by the admin. Pending the
                  approval, you won't be able to login into your account{" "}
                </Typography>
                <Button
                  variant="contained"
                  sx={{ marginTop: "30px", height: "50px", width: "60%" }}
                  onClick={() => navigate("/login")}
                >
                  Go to Login
                </Button>
              </Box>
            )}
          </Card>
        </Container>
      </StyledRoot>
    </>
  );
}
