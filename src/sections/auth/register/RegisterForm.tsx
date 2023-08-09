import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Stack, IconButton, InputAdornment, TextField, Checkbox, Box, MenuItem, Snackbar } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useContexts } from "../../../context";
import { Link } from "react-router-dom";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// components
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

export default function RegisterForm() {
  const designations = ["Accountant", "Software Engineer", "Human Resource"];

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

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    loginUser,
    state: { loading },
    set_loading,
    registerUser,
  } = useContexts();
  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    designation: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      await set_loading(true);
      if (data.password.length < 8) {
        notify("warning", "password cannot be less than 8 characters");
        await set_loading(false);
        return;
      }
      if (data.password !== data.confirm_password) {
        notify("warning", "password does not match");
        await set_loading(false);
        return;
      }
      const res = await registerUser({ ...data, role: "guest" });
      if (res) {
        await navigate("/candidate/assessments");
      }
      await set_loading(false);
    } catch (error) {
      await set_loading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <TextField
          name="text"
          label="First name"
          required
          value={data.first_name}
          onChange={(e) => setData({ ...data, first_name: e.target.value })}
        />
        <TextField
          name="text"
          label="Last name"
          required
          value={data.last_name}
          onChange={(e) => setData({ ...data, last_name: e.target.value })}
        />
        <TextField
          name="email"
          type="email"
          label="Email address"
          required
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />

        <TextField
          select // tell TextField to render select
          value={data.designation}
          label="Designation"
          required
          sx={{ width: "100%" }}
          onChange={(e) => setData({ ...data, designation: e.target.value })}
        >
          {designations.map((i) => (
            <MenuItem key={i} value={i}>
              {i}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          name="password"
          label="Password"
          type="password"
          required
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <TextField
          name="confirmpassword"
          label="Confirm Password"
          type="password"
          required
          value={data.confirm_password}
          onChange={(e) => setData({ ...data, confirm_password: e.target.value })}
        />
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        <Checkbox name="remember" />
        <Link to="/login">Login</Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Sign Up
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
