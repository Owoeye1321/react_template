import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import {
  Stack,
  IconButton,
  Button,
  TextField,
  Checkbox,
  Box,
  MenuItem,
  Snackbar,
  Avatar,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useContexts } from "../../../context";
import { Link } from "react-router-dom";
import MuiAlert, { AlertProps, AlertColor } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
// components
import Iconify from "../../../components/iconify";

export interface Props {
  uploadImage: boolean;
  setSwitch(): any;
  setSuccessRes(): any;
}
// ----------------------------------------------------------------------

export default function RegisterForm({ uploadImage, setSwitch, setSuccessRes }: Props) {
  const [selectedImg, setSelectedImg] = useState<any>(null);
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

  const {
    loginUser,
    state: { loading, designations },
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
      const res = await registerUser({ ...data, role: "guest", file: selectedImg, isActive: false });
      //if (res) {
      // await navigate("/candidate/assessments");
      //}
      if (res.success) {
        await setSuccessRes();
      } else {
        await notify("error", res.message);
      }
      await set_loading(false);
    } catch (error) {
      await set_loading(false);
    }
  };

  const handleUpload = async (e: any) => {
    e.preventDefault();
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
    const createTimeOut: any = setTimeout(setSwitch, 3000);

    await set_loading(true);
    await createTimeOut();
    await clearTimeout(createTimeOut);
  };
  if (!uploadImage) {
    return (
      <Box component="form" onSubmit={handleUpload}>
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
              <MenuItem key={i.name} value={i.name}>
                {i.name}
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
          <Link to="/login" style={{ textDecoration: "none", color: "#2065D1" }}>
            Login
          </Link>
        </Stack>

        <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
          Next
        </LoadingButton>

        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alertOpen}
          onClose={handleClose}
          key={"top" + "center"}
          autoHideDuration={6000}
        >
          <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
            {alertMessage}!
          </Alert>
        </Snackbar>
      </Box>
    );
  } else {
    return (
      <Box>
        <Typography textAlign="center" fontStyle="italic">
          Click the icon below to select
        </Typography>

        <Box
          sx={{
            border: 1,
            borderColor: "rgba(145, 158, 171, 0.24)",
            borderRadius: "10px",
            width: "100%",
            height: "40vh",
          }}
        >
          {selectedImg !== null ? (
            <Avatar
              component="label"
              src={URL.createObjectURL(selectedImg)}
              variant="rounded"
              sx={{
                height: "50%",
                width: "50%",
                margin: "auto",
                marginTop: "10%",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              alt="photoURL"
              htmlFor="fileImg"
            />
          ) : (
            <Avatar
              component="label"
              src="/assets/images/upload-profile.svg"
              sx={{
                height: "70%",
                width: "50%",
                margin: "auto",
                marginTop: "10%",
                marginBottom: "10px",
                cursor: "pointer",
              }}
              alt="photoURL"
              htmlFor="fileImg"
            />
          )}
          <input
            type="file"
            id="fileImg"
            accept=".png, .jpg, .PNG, .JPEG"
            onChange={(e) => {
              setSelectedImg(e.target.files?.[0]);
            }}
            hidden
          />
          <Typography textAlign="center" variant="h5">
            Click the icon above to select
          </Typography>
        </Box>
        <Box width="100%" marginTop="20px" display="flex" flexDirection="row" justifyContent="space-between">
          <Button
            variant="outlined"
            disabled={loading}
            sx={{ width: "45%", height: "50px" }}
            onClick={() => {
              setSelectedImg(null);
              setSwitch();
            }}
          >
            Go back
          </Button>
          <LoadingButton
            onClick={handleSubmit}
            disabled={!selectedImg}
            variant="contained"
            sx={{ width: "45%", height: "50px" }}
            loading={loading}
          >
            Confirm
          </LoadingButton>
        </Box>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={alertOpen}
          onClose={handleClose}
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
}
