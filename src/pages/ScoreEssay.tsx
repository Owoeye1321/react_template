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
  Box,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TextField,
  TableContainer,
  TablePagination,
} from "@mui/material";
// components
import { useNavigate, useLocation, useOutletContext } from "react-router-dom";
import Label from "../components/label";
import Iconify from "../components/iconify";
import Scrollbar from "../components/scrollbar";
import { useContexts } from "../context";
// sections
import { UserListHead, UserListToolbar, AssessmentListToolbar } from "../sections/@dashboard/user";
import { get_result, get_user, submit_essay_test } from "../utils/api";
// mock
import USERLIST from "../_mock/user";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: "question", label: "Question", alignRight: false },
  { id: "answer", label: "Answer", alignRight: false },
  { id: "inputscore", label: "Score", alignRight: false },
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
    return filter(array, (_user) => _user.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el: any) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState("asc");
  const [candidate, set_candidate] = useState<any>({ first_name: "", last_name: "" });
  const [selected, setSelected] = useState<any>([]);
  const [total_score, set_total_score] = useState<any>([]);
  const [orderBy, setOrderBy] = useState("name");

  const [filterName, setFilterName] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [assessment, set_assessment] = useState<any>([]);
  const { set_loading } = useContexts();
  const navigate = useNavigate();
  const [notify]: any = useOutletContext();
  const location = useLocation();
  const { resultId, participant_id } = location.state;

  const getData = async () => {
    try {
      set_loading(true);
      const candidate_data = await get_user(participant_id);
      const results = await get_result(resultId);
      await set_candidate(candidate_data);
      await set_assessment(results && results.essay && results.essay);
      await set_total_score(
        results &&
          results.essay &&
          results.essay.map((i: any) => {
            i.score = 0;
            return { _id: i._id, score: 0 };
          })
      );
      await set_loading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleOpenMenu = (event: any) => {
    setOpen(event.currentTarget);
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
      const newSelecteds = assessment.map((n: any) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: any, name: any) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: any = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
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

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - assessment.length) : 0;

  const filteredUsers = applySortFilter(assessment, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredUsers.length && !!filterName;

  const onChangeScore = (score: any, id: any) => {
    if (score) {
      set_total_score(
        total_score.map((i: any) => {
          if (i._id === id) {
            i.score = parseFloat(score);
          }
          return i;
        })
      );
    } else {
      set_total_score(
        total_score.map((i: any) => {
          if (i._id === id) {
            i.score = 0;
          }
          return i;
        })
      );
    }
  };

  const eachValue = (id: string) => {
    return total_score.find((i: any) => i._id === id).score;
  };
  const handle_submit = async () => {
    try {
      await set_loading(true);
      const total = total_score
        .map((i: any) => {
          return i.score;
        })
        .reduce((a: number, b: number) => a + b, 0);
      const res = await submit_essay_test({ administration_id: resultId, essay_score: total });
      if (res) {
        notify("success", "Essay marked success");
        navigate(-1);
      }
    } catch (error) {
      notify("error", "An error occurred");
      await set_loading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title> Results </title>
      </Helmet>

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
      <Container sx={{ minHeight: "100vh", height: "100%" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            {candidate.first_name + " " + candidate.last_name}
          </Typography>

          <Box sx={{ display: "flex" }}>
            <Typography variant="h5" sx={{ marginRight: "20px" }}>
              {total_score
                .map((i: any) => {
                  return i.score;
                })
                .reduce((a: number, b: number) => a + b, 0)}{" "}
              marks
            </Typography>
            <Button variant="outlined" onClick={handle_submit}>
              Submit
            </Button>
          </Box>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={assessment.length}
                  numSelected={selected.length}
                  onRequestSort={handleRequestSort}
                  onSelectAllClick={handleSelectAllClick}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: any) => {
                    const { _id, question, answer } = row;
                    const selectedUser = selected.indexOf(_id) !== -1;

                    return (
                      <TableRow hover key={_id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                        <TableCell align="left">{question}</TableCell>
                        <TableCell align="left">{answer}</TableCell>
                        <TableCell align="left">
                          <TextField
                            type="number"
                            //value={eachValue(_id)}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                              onChangeScore(e.target.value, _id)
                            }
                            sx={{ width: "20%" }}
                            variant="outlined"
                          />{" "}
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
            count={assessment.length}
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
    </>
  );
}
