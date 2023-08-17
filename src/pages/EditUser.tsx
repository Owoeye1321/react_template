import { LoadingButton } from "@mui/lab";
import { Box, MenuItem, Button, Grid, TextField, Typography } from "@mui/material";
import { useContexts } from "../context";

export default function EditUser({ staff, handleSubmit, onChange, close }: any) {
  const designations = ["Accountant", "Software Engineer", "Human Resource"];

  const {
    state: { loading },
  } = useContexts();
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ marginTop: "20px", textAlign: "center" }}>
        Edit User
      </Typography>
      <Box sx={{ marginTop: "30px", margin: "20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              sx={{ width: "100%" }}
              name="first_name"
              label="First Name"
              value={staff.first_name}
              required
              onChange={(e) => onChange(e.target.value, "first_name")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              sx={{ width: "100%" }}
              name="last_name"
              label="Last Name"
              value={staff.last_name}
              required
              onChange={(e) => onChange(e.target.value, "last_name")}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={6}>
            <TextField
              value={staff.email}
              type="email"
              label="Email"
              sx={{ width: "100%" }}
              required
              disabled
              onChange={(e) => onChange(e.target.value, "email")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select // tell TextField to render select
              value={staff.designation}
              label="Designation"
              required
              sx={{ width: "100%" }}
              onChange={(e) => onChange(e.target.value, "designation")}
            >
              {designations.map((i) => (
                <MenuItem key={i} value={i}>
                  {i}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Box>
      <Box display="flex" justifyContent="space-between" margin="20px">
        <Button disabled={loading} sx={{ width: "45%", height: "50px" }} variant="outlined" onClick={close}>
          Cancel
        </Button>
        <LoadingButton loading={loading} sx={{ width: "45%", height: "50px" }} variant="contained" type="submit">
          Save
        </LoadingButton>
      </Box>
    </Box>
  );
}
