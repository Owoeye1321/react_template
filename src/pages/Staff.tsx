import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { filter, isArray } from "lodash";
import EditUser from "./EditUser";
import { sentenceCase } from "change-case";
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Box,
  Modal,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import { useNavigate, useOutletContext } from "react-router-dom";
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
import { useContexts } from "../context";
// sections
import { UserListHead, AssessmentListToolbar } from "../sections/@dashboard/user";
import { get_users, update_user } from "../utils/api";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "nam", label: "Name", alignRight: false },
  { id: "email", label: "Email", alignRight: false },
  { id: "designation", label: "Designation", alignRight: false },
  { id: "role", label: "Role", alignRight: false },
  { id: "" },
];

// ----------------------------------------------------------------------

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

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [candidates, set_candidates] = useState<any>([]);
  const { set_loading } = useContexts();
  const navigate = useNavigate();

  const [data, setData] = useState<any>({
    first_name: "",
    last_name: "",
    email: "",
    designation: "",
    _id: "",
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

  const defaultState = () => {
    setData({
      first_name: "",
      last_name: "",
      email: "",
      _id: "",
      designation: "",
    });
  };

  const loadData = async () => {
    await set_loading(true);
    const data = await get_users("user");
    if (isArray(data)) {
      console.group(data);
      await set_candidates(data);
    }
    await set_loading(false);
  };
  useEffect(() => {
    loadData();
  }, []);

  const handleOpenMenu = (event: any, staff: any) => {
    setOpen(event.currentTarget);
    setData(staff);
  };

  const handleCloseMenu = () => {
    setOpen(null);
    defaultState();
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

  const close = () => {
    setModalOpen(false);
  };

  const handleUpdate = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    try {
      e.preventDefault();
      await set_loading(true);
      const done = await update_user(data._id, data);
      if (done) {
        await loadData();
        await notify("success", "User updated");
        await defaultState();
        await setModalOpen(false);
      } else {
        await notify("error", "Could not update user");
        await set_loading(false);
      }
    } catch (error) {
      notify("error", "An error occured");
    }
  };
  const handleOpenModal = async (staff: any) => {
    await setData(staff);
    await setModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title> Staffs </title>
      </Helmet>

      <Container sx={{ minHeight: "100vh", height: "100%" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Staffs
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/staffs/create")}
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Staff
          </Button>
        </Stack>

        <Card>
          <AssessmentListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeHolder="Search staffs...."
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
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                    const { _id, designation, first_name, last_name, email, role } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="left">{`${first_name} ${last_name}`}</TableCell>

                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="left">{designation}</TableCell>
                        <TableCell align="left">Staff</TableCell>

                        <TableCell align="right">
                          <IconButton
                            size="large"
                            color="inherit"
                            onClick={(e) => handleOpenMenu(e, { first_name, last_name, designation, email, _id })}
                          >
                            <Iconify icon="eva:more-vertical-fill" />
                          </IconButton>
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
        <MenuItem onClick={() => setModalOpen(true)}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>
      </Popover>

      <Modal
        open={modalOpen}
        onClose={() => {
          defaultState();
          setModalOpen(false);
          handleCloseMenu();
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
          <EditUser staff={data} handleSubmit={handleUpdate} onChange={onChange} close={close} />
        </Box>
      </Modal>
    </>
  );
}
