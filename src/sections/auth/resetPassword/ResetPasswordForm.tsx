import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Stack, IconButton, InputAdornment, TextField, Checkbox, Box, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Link } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import { useSearchParams } from "react-router-dom";
import { useContexts } from "../../../context";
import { update_password } from "../../../utils/api";
// components
import Iconify from "../../../components/iconify";

import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [alertMessage, setAlertMessage] = useState("Alert");
  const [type, setType] = useState<AlertColor>("success");
  const [disbale, setdisable] = useState(true);
  const [success, setSuccess] = useState(false);
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
    loginUser,
    state: { loading },
    set_loading,
  } = useContexts();
  const [data, setData] = useState({ password: "", confirm_password: "" });

  useEffect(() => {
    if (searchParams.get("resetid")) {
      setdisable(false);
    }
  });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      if (data.password.length < 8) {
        notify("warning", "password cannot be less than 8 characters");
        return;
      }
      if (data.password !== data.confirm_password) {
        notify("warning", "password does not match");
        return;
      }
      await set_loading(true);

      const user = await update_password({ password: data.password, token: searchParams.get("resetid") });
      if (user.code === 200) {
        await notify("success", "Password updated");
        await setSuccess(true);
        await setData({ password: "", confirm_password: "" });
      } else if (user.response && user.response.data && user.response.data.message === "jwt malformed") {
        notify("error", "Invalid link");
      } else if (user.response && user.response.data && user.response.data.message === "jwt expired") {
        notify("error", "Link expired");
      } else {
        notify("error", user && user.message ? user.message : "Could not update password");
      }

      await set_loading(false);
    } catch (error) {
      notify("error", "An error occurred");
      await set_loading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {disbale && (
        <Typography gutterBottom sx={{ textAlign: "center", color: "red" }}>
          Invalid link
        </Typography>
      )}
      <Stack spacing={3}>
        <TextField
          name="password"
          label="Password"
          type="password"
          disabled={disbale}
          required
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <TextField
          name="confirmPassword"
          label="Confirm Password"
          type="password"
          disabled={disbale}
          required
          value={data.confirm_password}
          onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Link to="/signup" style={{ textDecoration: "none", color: "#2065D1" }}></Link>
        {success && (
          <Link to="/login" style={{ textDecoration: "none", color: "#2065D1" }}>
            Login to your back
          </Link>
        )}
      </Stack>
      <LoadingButton disabled={disbale} fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Reset Password
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
