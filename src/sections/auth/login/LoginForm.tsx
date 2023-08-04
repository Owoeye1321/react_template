import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Box } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useContexts } from "../../../context";
// components
import Iconify from "../../../components/iconify";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();

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
      if (user.login && user.role === "admin") {
        await navigate("/dashboard");
      } else {
        await navigate("/candidate/assessments");
      }
      await set_loading(false);
    } catch (error) {
      console.log(error);
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
        <Link variant="subtitle2" underline="hover">
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" loading={loading}>
        Login
      </LoadingButton>
    </Box>
  );
}
