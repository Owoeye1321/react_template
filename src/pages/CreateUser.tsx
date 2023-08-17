import { Container, Typography, TextField, Grid, MenuItem, Avatar, Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useContexts } from "../context";
import { create_single_user } from "../utils/api";

export default function UserPage() {
  const navigate = useNavigate();
  const {
    set_loading,
    state: { designations },
  } = useContexts();
  const [notify]: any = useOutletContext();

  const [data, setData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    designation: "",
  });
  const onChange = (datas: any, type: string) => {
    switch (type) {
      case "first_name":
        return setData({ ...data, first_name: datas });
      case "last_name":
        return setData({ ...data, last_name: datas });
      case "email":
        return setData({ ...data, email: datas });
      case "role":
        return setData({ ...data, role: datas });
      case "designation":
        return setData({ ...data, designation: datas });
      default:
        return setData(data);
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      await set_loading(true);
      const done = await create_single_user({ ...data, role: "admin" });
      if (done) {
        notify("success", "User created");
        defaultState();
      }
      await set_loading(false);
    } catch (error) {
      notify("error", "An error occurred");
    }
  };

  const defaultState = () => {
    setData({
      first_name: "",
      last_name: "",
      email: "",
      role: "",
      designation: "",
    });
  };

  return (
    <>
      {" "}
      <Box
        sx={{
          width: "20px",
          height: "20px",
          bgcolor: "transparent",
          border: "transparent",
          cursor: "pointer",
          marginBottom: "10px",
        }}
        component="button"
        onClick={() => navigate(-1)}
      >
        <Avatar src="/assets/icons/ic_back.svg" alt="photoURL" />
      </Box>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create Team Member
        </Typography>

        <Box component="form" sx={{ marginTop: "30px" }} onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                sx={{ width: "100%" }}
                name="first_name"
                label="First Name"
                value={data.first_name}
                required
                onChange={(e) => onChange(e.target.value, "first_name")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                sx={{ width: "100%" }}
                name="last_name"
                label="Last Name"
                value={data.last_name}
                required
                onChange={(e) => onChange(e.target.value, "last_name")}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                value={data.email}
                type="email"
                label="Email"
                sx={{ width: "100%" }}
                required
                onChange={(e) => onChange(e.target.value, "email")}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <TextField
                select // tell TextField to render select
                value={data.designation}
                label="Designation"
                required
                sx={{ width: "100%" }}
                onChange={(e) => onChange(e.target.value, "designation")}
              >
                {designations.map((i) => (
                  <MenuItem key={i.value} value={i.value}>
                    {i.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center" }}>
            <Button type="submit" sx={{ margin: "auto", marginTop: "20px" }} variant="contained">
              Save User
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
