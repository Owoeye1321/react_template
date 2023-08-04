import {
  Container,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Avatar,
  Box,
  Button,
  Tab,
  Tabs,
  Card,
  TableContainer,
  Link,
  InputLabel,
  TableRow,
  Table,
  TablePagination,
  TableBody,
  TableCell,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as xlsx from "xlsx";
import { Icon } from "@iconify/react";
import numeral from "numeral";
import { UserListHead } from "../sections/@dashboard/user";
import SvgColor from "../components/svg-color";
import { useContexts } from "../context";
import { create_bulk_user, create_single_user } from "../utils/api";

export default function UserPage() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState<any>([]);
  const [activeTab, setActiveTab] = useState(0);
  const { set_loading } = useContexts();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const designations = ["Accountant", "Software Engineer", "Human Resource"];
  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState("name");

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const TABLE_HEAD = [
    { id: "nii", label: "Name", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    { id: "designation", label: "Designation", alignRight: false },
  ];

  const [data, setData] = useState<any>({
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

  const extractCandidateData = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setCandidates(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      await set_loading(true);
      const done = await create_single_user({ ...data, role: "guest" });
      if (done) {
        alert("User created");
        defaultState();
      }
      await set_loading(false);
    } catch (error) {
      alert("An error occured");
    }
  };
  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    try {
      e.preventDefault();
      await set_loading(true);
      const done = await create_bulk_user({ file: selectedFile });
      if (done) {
        alert("File uploaded");
        cancelUpload();
      }
      await set_loading(false);
    } catch (error) {
      alert("An error occured");
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

  const switchTab = (event: React.SyntheticEvent, data: number) => {
    setActiveTab(data);
  };

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const notShow: boolean = false;

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - candidates.length) : 0;

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setCandidates([]);
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
          Create Candidate
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={activeTab} onChange={switchTab} aria-label="basic tabs example">
            <Tab label="Single upload" {...a11yProps(0)} />
            <Tab label="Bulk upload" {...a11yProps(1)} />
          </Tabs>
        </Box>

        {activeTab === 0 && (
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
                    <MenuItem key={i} value={i}>
                      {i}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ textAlign: "center" }}>
              <Button type="submit" sx={{ margin: "auto", marginTop: "20px" }} variant="contained">
                Save Candidate
              </Button>
            </Box>
          </Box>
        )}
        {activeTab === 1 && (
          <Box sx={{ marginTop: "30px" }}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={5}>
                <Card sx={{ minHeight: "40vh" }} variant="outlined">
                  <Box sx={{ margin: "20px" }}>
                    <Typography variant="h4">Bulk upload candidate</Typography>
                    <Icon
                      style={{ marginLeft: "-20px" }}
                      icon="ic:baseline-upload-file"
                      color="#2065D1"
                      fontSize="100px"
                    />
                    <Typography>Upload an Excel file with a list of staff</Typography>
                    <Typography>
                      Please make sure it matches the format specified in the{" "}
                      <Link href="https://test.co" target="_blank">
                        Sample Excel File
                      </Link>
                      <input
                        type="file"
                        hidden
                        id="file"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          setSelectedFile(e.target.files && e.target.files[0]);
                          extractCandidateData(e);
                        }}
                      />
                      <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
                        <InputLabel
                          component="button"
                          sx={{
                            height: "40px",
                            borderRadius: "8px",
                            minWidth: "150px",
                            maxWidth: "250px",
                            border: "transparent",
                            cursor: "pointer",
                          }}
                        >
                          <InputLabel sx={{ cursor: "pointer" }} htmlFor="file">
                            {selectedFile && selectedFile.name ? selectedFile.name : "Select file"}
                          </InputLabel>
                        </InputLabel>
                        {candidates.length > 0 && (
                          <Button onClick={cancelUpload} sx={{ height: "40px" }} variant="outlined">
                            Cancel
                          </Button>
                        )}
                      </Box>
                    </Typography>
                  </Box>
                </Card>
              </Grid>
              {candidates.length > 0 && (
                <Grid item xs={12} sm={6} md={7}>
                  <Card sx={{ minHeight: "40vh" }} variant="outlined">
                    <Box>
                      <TableContainer>
                        <Table>
                          <UserListHead
                            order={order}
                            orderBy={orderBy}
                            headLabel={TABLE_HEAD}
                            rowCount={candidates.length}
                            numSelected={selected.length}
                          />
                          <TableBody>
                            {candidates
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row: any, idx: any) => (
                                // const selectedUser = selected.indexOf(_id) !== -1;

                                <TableRow hover key={idx} tabIndex={-1} role="checkbox">
                                  <TableCell align="left">{`${row["FIRST NAME"]} ${row["LAST NAME"]}`}</TableCell>

                                  <TableCell align="left">{row.EMAIL}</TableCell>

                                  <TableCell align="left">{row.DESIGNATION}</TableCell>
                                </TableRow>
                              ))}
                            {emptyRows > 0 && (
                              <TableRow style={{ height: 53 * emptyRows }}>
                                <TableCell colSpan={6} />
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", margin: "15px" }}>
                      <Button variant="contained" onClick={handleBulkUpload}>
                        Upload file{" "}
                        <Icon style={{ marginLeft: "10px" }} icon="material-symbols:upload" fontSize="20px" />
                      </Button>
                      <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={candidates.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                      />
                    </Box>
                  </Card>
                </Grid>
              )}
            </Grid>
          </Box>
        )}
      </Container>
    </>
  );
}
