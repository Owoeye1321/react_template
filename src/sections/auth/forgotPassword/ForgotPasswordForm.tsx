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
import { forgot_password } from "../../../utils/api";
const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ----------------------------------------------------------------------

export default function LoginForm() {
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

  const {
    state: { loading },
    set_loading,
  } = useContexts();
  const [data, setData] = useState({ email: "" });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      await set_loading(true);
      const res = await forgot_password(data.email);
      if (res.code === 200) {
        await notify("success", "Reset password email sent");
        setData({ ...data, email: "" });
      } else {
        await notify("error", res.message);
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
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link to="/signup" style={{ textDecoration: "none", color: "#2065D1" }}>
          No account?
        </Link>
        <Link to="/login" style={{ textDecoration: "none", color: "#2065D1" }}>
          Login
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Get Reset Link
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
