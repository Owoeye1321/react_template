import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { filter, isArray } from "lodash";
import { sentenceCase } from "change-case";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Modal,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  Box,
} from "@mui/material";
// components
import { useNavigate, useOutletContext } from "react-router-dom";
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
import { useContexts } from "../context";
import { userRole } from "../utils/usertype";
// sections
import ReviewCandidate from "./ReviewCandidate";
import { UserListHead, AssessmentListToolbar } from "../sections/@dashboard/user";
import { get_in_active_users, approve_candidate } from "../utils/api";
const url = "http://localhost:5002/";
// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "nam", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "designation", label: "Designation", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

export interface Candidate {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: boolean;
  role: string;
  designation: string;
  isAdmin: boolean;
  file_path: string;
  isActive: boolean;
  createdAt: Date;
}

function descendingComparator(a: any, b: any, orderBy: any) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order: any, orderBy: any) {
  return order === "desc"
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array: any, comparator: any, query: any) {
  const stabilizedThis = array.map((el: any, index: any) => [el, index]);
  stabilizedThis.sort((a: any, b: any) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(
      array,
      (_user) =>
        _user.first_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.last_name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _user.email.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return stabilizedThis.map((el: any) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [notify]: any = useOutletContext();
  const [order, setOrder] = useState("asc");

  const [selected, setSelected] = useState<any>([]);

  const [orderBy, setOrderBy] = useState("name");
  const [staff, setStaff] = useState<Candidate>({
    _id: "",
    first_name: "",
    last_name: "",
    email: "",
    status: false,
    role: "",
    designation: "",
    isAdmin: false,
    file_path: "",
    isActive: false,
    createdAt: new Date(),
  });
  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [candidates, set_candidates] = useState<any>([]);
  const { set_loading } = useContexts();
  const navigate = useNavigate();

  const loadData = async () => {
    await set_loading(true);
    const data = await get_in_active_users();

    if (isArray(data)) {
      await set_candidates(data);
    }
    await set_loading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleOpenModal = async (staff: Candidate) => {
    await setStaff({ ...staff, file_path: url?.slice(0, -1) + staff.file_path });
    await setModalOpen(true);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = candidates.map((n: any) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event: any) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - candidates.length) : 0;

  const filteredUsers = applySortFilter(candidates, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const approve = async () => {
    try {
      await set_loading(true);
      const res = await approve_candidate(staff._id);
      if (res.code === 200) {
        await notify("success", "Candidate approval successful");
        await loadData();
        await defaultState();
      } else {
        await notify("error", "Candidate approval error");
        await set_loading(false);
      }
    } catch (error) {
      console.log(error);
      notify("error", "An error occurred");
      await set_loading(false);
    }
  };

  const close = () => {
    setModalOpen(false);
  };

  const defaultState = () => {
    setStaff({
      _id: "",
      first_name: "",
      last_name: "",
      email: "",
      status: false,
      role: "",
      designation: "",
      isAdmin: false,
      file_path: "",
      isActive: false,
      createdAt: new Date(),
    });
    close();
  };

  return (
    <>
      <Helmet>
        <title> Candidates </title>
      </Helmet>

      <Container sx={{ minHeight: "100vh", height: "100%" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Candidates Request
          </Typography>
          {/*<Button
            variant="contained"
            onClick={() => navigate("/candidates/create")}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Candidate
          </Button>*/}
        </Stack>

        <Card>
          <AssessmentListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeHolder="Search candidates...."
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={candidates.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: Candidate) => {
                    const { _id, designation, first_name, last_name, email, role, file_path } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;
                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="left">
                          <Box display="flex" alignItems="center">
                            <Avatar
                              src={url?.slice(0, -1) + file_path}
                              sx={{ width: "50px", height: "50px", marginRight: "10px" }}
                              alt="img"
                            />
                            {`${first_name} ${last_name}`}
                          </Box>
                        </TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{designation}</TableCell>
                        <TableCell align="left">{userRole(role)}</TableCell>

                        <TableCell align="right">
                          <Button variant="outlined" onClick={() => handleOpenModal(row)}>
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: "center",
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>
                              &quot;
                              {filterName}
                              &quot;
                            </strong>
                            .
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={candidates.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            "& .MuiMenuItem-root": {
              px: 1,
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <MenuItem>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem sx={{ color: "error.main" }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>

      <Modal
        open={modalOpen}
        onClose={() => {
          defaultState();
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: { lg: "40%", md: "60%", sm: "100%", xs: "100%" },
            minHeight: "40vh",
            margin: "auto",
            backgroundColor: "#fff",
            overflow: "scroll",
            marginTop: "10%",
          }}
        >
          <ReviewCandidate staff={staff} close={close} approve={approve} />
        </Box>
      </Modal>
    </>
  );
}
