import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Stack, IconButton, InputAdornment, TextField, Checkbox, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { useContexts } from "../../../context";
// components
import Iconify from "../../../components/iconify";

import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

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

  const [showPassword, setShowPassword] = useState(false);

  const {
    loginUser,
    state: { loading },
    set_loading,
  } = useContexts();
  const [data, setData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const user = await loginUser(data);
      if (!user) {
        notify("error", "Invalid Email/Password");
        return;
      }
      if (user.login && user.role === "admin") {
        await navigate("/dashboard");
      } else {
        await navigate("/candidate/assessments");
      }
      await set_loading(false);
    } catch (error) {
      notify("error", "An error occurred");
      await set_loading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          required
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <TextField
          name="password"
          label="Password"
          required
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" />
        <Link to="/signup" style={{ textDecoration: "none", color: "#2065D1" }}>
          Sign up
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Login
      </LoadingButton>

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
    </Box>
  );
}
