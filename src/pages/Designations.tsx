import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { filter, isArray } from "lodash";
import CreateDesignation from "./CreateDesignation";
import moment from "moment";
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
import { get_designations, update_user, create_designation, edit_designation } from "../utils/api";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "designation", label: "Designation", alignRight: false },
  { id: "date", label: "Added Date", alignRight: false },
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
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el: any) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [notify]: any = useOutletContext();
  const [order, setOrder] = useState("asc");
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState<any>([]);

  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [designations, set_designations] = useState<any>([]);
  const { set_loading } = useContexts();
  const navigate = useNavigate();

  const [data, setData] = useState<any>({
    name: "",
    _id: "",
  });
  const onChange = (datas: any, type: string) => {
    switch (type) {
      case "designation":
        return setData({ ...data, name: datas });
      default:
        return setData(data);
    }
  };

  const defaultState = () => {
    setData({
      name: "",
      _id: "",
    });
  };

  const loadData = async () => {
    await set_loading(true);
    const data = await get_designations();
    if (isArray(data)) {
      await set_designations(data);
    }
    await set_loading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenMenu = async (event: any, staff: any) => {
    try {
      setEdit(true);
      setOpen(event.currentTarget);
      setData(staff);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseMenu = () => {
    setOpen(null);
    defaultState();
    setEdit(false);
  };

  const handleRequestSort = (event: any, property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: any) => {
    if (event.target.checked) {
      const newSelecteds = designations.map((n: any) => n.name);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - designations.length) : 0;

  const filteredUsers = applySortFilter(designations, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const close = () => {
    setModalOpen(false);
  };

  const handleUpdate = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    try {
      e.preventDefault();
      await set_loading(true);
      if (edit) {
        const done = await edit_designation(data._id, data);
        if (done && done.code === 200) {
          await notify("success", "Designation Updated");
          await loadData();
          await defaultState();
          await setModalOpen(false);
        } else {
          await notify("error", "Designation already exist");
          await set_loading(false);
        }
      } else {
        const done = await create_designation({ name: data.name });
        if (done && done.code === 200) {
          await notify("success", "Designation Created");
          await loadData();
          await defaultState();
          await setModalOpen(false);
        } else {
          await notify("error", "Designation already exist");
          await set_loading(false);
        }
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
        <title> Designation </title>
      </Helmet>

      <Container sx={{ minHeight: "100vh", height: "100%" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Designation
          </Typography>
          <Button variant="contained" onClick={() => setModalOpen(true)} startIcon={<Iconify icon="eva:plus-fill" />}>
            New Designation
          </Button>
        </Stack>

        <Card>
          <AssessmentListToolbar
            numSelected={selected.length}
            filterName={filterName}
            onFilterName={handleFilterByName}
            placeHolder="Search designations...."
          />
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={designations.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                    const { _id, name, createdAt } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="left">{name}</TableCell>

                        <TableCell align="left">{moment(createdAt).format("DD-MMMM-YYYY")}</TableCell>

                        <TableCell align="right">
                          <IconButton size="large" color="inherit" onClick={(e) => handleOpenMenu(e, { name, _id })}>
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
            count={designations.length}
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
          setEdit(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: { lg: "40%", md: "60%", sm: "100%", xs: "100%" },
            minHeight: "20vh",
            margin: "auto",
            backgroundColor: "#fff",
            overflow: "scroll",
            marginTop: "10%",
          }}
        >
          <CreateDesignation data={data} handleSubmit={handleUpdate} onChange={onChange} close={close} edit={edit} />
        </Box>
      </Modal>
    </>
  );
}
