import {
  Container,
  Typography,
  TextField,
  Grid,
  MenuItem,
  Avatar,
  Box,
  InputAdornment,
  InputLabel,
  Link,
  Modal,
  Stack,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as xlsx from "xlsx";
import numeral from "numeral";
import { useContexts } from "../context";
import { create_assessment } from "../utils/api";

export default function UserPage() {
  const navigate = useNavigate();
  const [objectives, setObjectives] = useState<any>([]);
  const [theory, setTheory] = useState<any>([]);
  const [openObjective, setOpenObjective] = useState(false);
  const { set_loading } = useContexts();
  const [openTheory, setOpenTheory] = useState(false);
  const designations = ["Accountant", "Software Engineer", "Human Resource"];
  const [data, setData] = useState({
    title: "",
    type: "",
    mode: "",
    time_limit: "",
    optionSchedule: null,
    essaySchedule: null,
    designation: "",
    role: "",
  });
  const onChange = (datas: any, type: string) => {
    switch (type) {
      case "title":
        return setData({ ...data, title: datas });
      case "type":
        return setData({ ...data, type: datas });
      case "mode":
        return setData({ ...data, mode: datas });
      case "time_limit":
        return setData({ ...data, time_limit: datas });
      case "optionSchedule":
        return setData({ ...data, optionSchedule: datas });
      case "essaySchedule":
        return setData({ ...data, essaySchedule: datas });
      case "designation":
        return setData({ ...data, designation: datas });
      case "role":
        return setData({ ...data, role: datas });
      default:
        return setData(data);
    }
  };

  const extractObjectiveData = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setObjectives(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const extractTheoryData = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        setTheory(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const handleModalOpen = (type: string) => {
    if (type === "objective") {
      setOpenObjective(true);
    } else if (type === "theory") {
      setOpenTheory(true);
    }
  };

  const handleClearObjective = () => {
    setData({ ...data, optionSchedule: null });
    setObjectives([]);
  };
  const handleClearThoery = () => {
    setData({ ...data, essaySchedule: null });
    setTheory([]);
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      if (data.optionSchedule === null && data.essaySchedule === null) {
        return alert("Please upload an objective sheet or theory");
      }
      await set_loading(true);
      const done = await create_assessment(data);
      if (done) {
        alert("Assessment created");
        defaultState();
      }
      await set_loading(false);
    } catch (error) {
      alert("An error occured");
    }
  };

  const defaultState = () => {
    setData({
      title: "",
      type: "",
      mode: "",
      time_limit: "",
      optionSchedule: null,
      essaySchedule: null,
      designation: "",
      role: "",
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
      <Box maxWidth="xl" component="form" onSubmit={handleSubmit} margin={2}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Create Assessment
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              sx={{ width: "100%" }}
              name="title"
              label="Title"
              value={data.title}
              required
              onChange={(e) => onChange(e.target.value, "title")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    {data.time_limit && `(${numeral(parseFloat(data.time_limit)).format(":")} ` + "Hour(s))"}
                  </InputAdornment>
                ),
              }}
              sx={{ width: "100%" }}
              type="number"
              value={data.time_limit}
              name="timeLimit"
              label="Time limit(Seconds)"
              required
              onChange={(e) => onChange(e.target.value, "time_limit")}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              select // tell TextField to render select
              value={data.mode}
              label="Mode"
              sx={{ width: "100%" }}
              required
              onChange={(e) => onChange(e.target.value, "mode")}
            >
              <MenuItem key={1} value="foundation">
                Foundation
              </MenuItem>
              <MenuItem key={2} value="master">
                Master
              </MenuItem>
            </TextField>
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
          <Grid item xs={12} sm={6} md={6}>
            <InputLabel>
              Select objective questions excel file.{" "}
              <Link href="https://test.co" target="_blank">
                Sample upload
              </Link>
            </InputLabel>
            <TextField
              label=""
              type="file"
              sx={{ width: "100%" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e.target.files && e.target.files[0], "optionSchedule");
                extractObjectiveData(e);
              }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Button
                sx={{ marginTop: "10px" }}
                disabled={!objectives.length}
                onClick={() => handleModalOpen("objective")}
              >
                Preview objective questions
              </Button>
              <Button sx={{ marginTop: "10px" }} disabled={!objectives.length} onClick={handleClearObjective}>
                Clear
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <InputLabel>
              Select theory questions excel file.{" "}
              <Link href="https://test.co" target="_blank">
                Sample upload
              </Link>
            </InputLabel>
            <TextField
              label=""
              type="file"
              sx={{ width: "100%" }}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e.target.files && e.target.files[0], "essaySchedule");
                extractTheoryData(e);
              }}
            />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Button sx={{ marginTop: "10px" }} disabled={!theory.length} onClick={() => handleModalOpen("theory")}>
                Preview theory questions
              </Button>
              <Button sx={{ marginTop: "10px" }} disabled={!theory.length} onClick={handleClearThoery}>
                Clear
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Box sx={{ textAlign: "center" }}>
          <Button type="submit" sx={{ margin: "auto", marginTop: "20px" }} variant="contained">
            Save Assessment
          </Button>
        </Box>
      </Box>
      <Modal
        open={openObjective}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "60%",
            minHeight: "60vh",
            margin: "auto",
            height: "100%",
            backgroundColor: "#fff",
            overflow: "scroll",
          }}
        >
          <Box sx={{ margin: "30px" }}>
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
              onClick={() => setOpenObjective(false)}
            >
              <Avatar src="/assets/icons/ic_cancel.svg" alt="photoURL" />
            </Box>
            <Typography
              id="modal-modal-title"
              sx={{ textAlign: "center", marginBottom: "30px" }}
              variant="h4"
              component="h2"
            >
              Objective Questions Preview
            </Typography>
            <Grid container spacing={3}>
              {objectives.map((i: any, idx: any) => (
                <Grid
                  sx={{
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);transition: all 0.3s cubic-bezier(.25,.8,.25,1)",
                    margin: "15px",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    border: 1,
                  }}
                  key={idx}
                  item
                  xs={12}
                  sm={5.5}
                  md={5.5}
                >
                  <Typography id="modal-modal-description">Question {idx + 1}:</Typography>
                  <Typography id="modal-modal-description" variant="h6">
                    {i.QUESTION}
                  </Typography>
                  <Typography id="modal-modal-title">Opion A : {i["OPTION A"]}</Typography>
                  <Typography id="modal-modal-title">Opion B : {i["OPTION B"]}</Typography>
                  <Typography id="modal-modal-title">Opion C : {i["OPTION C"]}</Typography>
                  <Typography id="modal-modal-title" sx={{ marginBottom: "10px" }}>
                    Opion D : {i["OPTION D"]}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Modal>
      <Modal
        open={openTheory}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "60%",
            minHeight: "60vh",
            margin: "auto",
            height: "100%",
            backgroundColor: "#fff",
            overflow: "scroll",
          }}
        >
          <Box sx={{ margin: "30px" }}>
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
              onClick={() => setOpenTheory(false)}
            >
              <Avatar src="/assets/icons/ic_cancel.svg" alt="photoURL" />
            </Box>
            <Typography
              id="modal-modal-title"
              sx={{ textAlign: "center", marginBottom: "30px" }}
              variant="h4"
              component="h2"
            >
              Theory Questions Preview
            </Typography>
            <Grid container spacing={3}>
              {theory.map((i: any, idx: any) => (
                <Grid
                  sx={{
                    boxShadow:
                      "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);transition: all 0.3s cubic-bezier(.25,.8,.25,1)",
                    margin: "15px",
                    backgroundColor: "#fff",
                    borderRadius: "5px",
                    border: 1,
                  }}
                  key={idx}
                  item
                  xs={12}
                  sm={5.5}
                  md={5.5}
                >
                  <Typography id="modal-modal-description">Question {idx + 1}:</Typography>
                  <Typography id="modal-modal-description" variant="h6">
                    {i.QUESTION}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
