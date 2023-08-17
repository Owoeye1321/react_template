import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import { useContexts } from "../context";

export default function CreateDesignation({ data, handleSubmit, onChange, close, edit }: any) {
  const {
    state: { loading },
  } = useContexts();
  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" sx={{ marginTop: "20px", textAlign: "center" }}>
        {edit ? "Edit Designation" : "Create Designation"}
      </Typography>
      <Box sx={{ marginTop: "30px", margin: "20px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12}>
            <TextField
              sx={{ width: "100%" }}
              name="designation"
              label="Designation Title"
              value={data.name}
              required
              onChange={(e) => onChange(e.target.value, "designation")}
            />
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
