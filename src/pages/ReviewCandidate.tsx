import { LoadingButton } from "@mui/lab";
import { Avatar, Box, Typography, Button } from "@mui/material";
import moment from "moment";
import { useContexts } from "../context";

export default function ReviewCandidate({ staff, approve, close }: any) {
  const styles = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
    borderBottom: 1,
    borderColor: "divider",
  };
  const {
    state: { loading },
  } = useContexts();
  return (
    <Box>
      <Box sx={{ margin: "20px" }}>
        <Avatar
          src={staff.file_path}
          sx={{
            height: "200px",
            width: "200px",
            margin: "auto",
          }}
          variant="square"
          alt="img"
        />
        <Box marginTop="50px">
          <Box sx={{ ...styles }}>
            <Typography variant="h6">Name:</Typography>
            <Typography>{staff.first_name + " " + staff.last_name}</Typography>
          </Box>
          <Box sx={{ ...styles }}>
            <Typography variant="h6">Email:</Typography>
            <Typography>{staff.email}</Typography>
          </Box>
          <Box sx={{ ...styles }}>
            <Typography variant="h6">Designation:</Typography>
            <Typography>{staff.designation}</Typography>
          </Box>
          <Box sx={{ ...styles }}>
            <Typography variant="h6">Signed up date:</Typography>
            <Typography>{moment(staff.created).format("DD-MMM-YYYY")}</Typography>
          </Box>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" margin="20px">
        <Button disabled={loading} sx={{ width: "45%", height: "50px" }} variant="outlined" onClick={close}>
          Cancel
        </Button>
        <LoadingButton loading={loading} sx={{ width: "45%", height: "50px" }} variant="contained" onClick={approve}>
          Approve
        </LoadingButton>
      </Box>
    </Box>
  );
}
