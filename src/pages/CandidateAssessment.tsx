import { Helmet } from "react-helmet-async";
//import { useTheme } from "@mui/material/styles";
import { shuffle } from "../utils/shuffleQuestions";
import {
  Grid,
  Container,
  Typography,
  Card,
  Box,
  Avatar,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useContexts } from "../context";
import Questions from "./Questions";
import React, { useEffect, useState } from "react";
import { get_assessments_by_candidate } from "../utils/api";

// ----------------------------------------------------------------------
export interface IAssessment {
  _id: string;
  title: string;
  mode: string;
  designation: string;
  role: string;
}

export interface IQuestions {
  _id: string;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  score: string;
  time_limit: string;
  group_id: string;
}
export default function Assessment() {
  const {
    set_loading,
    state: { user },
  } = useContexts();
  const [start, setStart] = useState(false);
  const [assessment, setAssessment] = useState<Array<IAssessment>>([]);
  const [questions, set_questions] = useState<Array<IQuestions>>([]);
  const [selected_assessment, set_selected_assessment] = useState<string>("");
  const [time, setTime] = useState<number>(0);
  //const theme = useTheme();
  const getData = async () => {
    try {
      await set_loading(true);
      const data = await get_assessments_by_candidate(selected_assessment);
      if (!selected_assessment) {
        setAssessment(data);
      } else {
        const arr = shuffle([...data.optionAssessment, ...data.essayAssessment]);
        set_questions(arr);
      }
      await setAssessment(data);
      await set_loading(false);
    } catch (error) {
      await set_loading(false);
    }
  };

  const onChangeAssessment = (data: any) => {
    const assessment = JSON.parse(data);
    set_selected_assessment(assessment._id);
    if (assessment.time_limits) {
      setTime(parseInt(assessment.time_limits));
    }
  };
  useEffect(() => {
    getData();
  }, [start]);

  const startAssessment = async () => {
    await getData();
    await setStart(true);
  };
  if (!start) {
    return (
      <>
        <Helmet>
          <title>Assessment</title>
        </Helmet>

        <Container maxWidth="xl">
          <Box sx={{ width: { md: "70%", xs: "100%" }, margin: "auto" }}>
            <Typography variant="h4" sx={{ mb: 5 }}>
              Hi, {user && user.first_name + " " + user.last_name}
            </Typography>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={12} lg={12}>
              <Card
                component="div"
                sx={{
                  minHeight: "30vh",
                  background: "linear-gradient(to bottom, #5CB23A, #048002 200px)",
                  width: { md: "70%", xs: "100%" },
                  margin: "auto",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ width: { md: "50%", xs: "100%" }, margin: "5%" }}>
                  <Typography fontSize="18px" color="#fff">
                    This assessment will test how efficient you are in the role you have chosen. This will tell the
                    interviewer how prepared you are to go on a journey with the company
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: "50%",
                    display: { md: "flex", xs: "none" },
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    variant="square"
                    sx={{ width: "60%", height: "60%" }}
                    src="/assets/images/quiz-landing-page.svg"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>
          {assessment.length ? (
            <Box sx={{ width: { md: "70%", xs: "100%", margin: "auto", marginTop: "20px" } }}>
              <Typography>Kindly select the assessment you are taking....</Typography>
              <FormControl>
                <RadioGroup
                  aria-labelledby="demo-radio-buttons-group-label"
                  defaultValue="female"
                  name="radio-buttons-group"
                >
                  {assessment.map((i: IAssessment) => (
                    <FormControlLabel
                      key={i._id}
                      value={JSON.stringify(i)}
                      control={<Radio />}
                      label={i.title}
                      onChange={(e: any) => onChangeAssessment(e.target.value)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </Box>
          ) : (
            <Box sx={{ width: { md: "70%", xs: "100%", margin: "auto", marginTop: "20px" } }}>
              <Typography>You have no assessment to take</Typography>
            </Box>
          )}
          {selected_assessment && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Card
                onClick={startAssessment}
                sx={{
                  minHeight: { md: "100px", xs: "70px" },
                  borderColor: "divider",
                  border: 0,
                  width: { md: "10%", xs: "50%" },
                  margin: "auto",
                  borderRadius: "10px",
                  marginTop: "20px",
                  textAlign: "center",
                  cursor: "pointer",
                }}
                component="button"
              >
                <Typography variant="h6">Start</Typography>
              </Card>
            </Box>
          )}
        </Container>
      </>
    );
  } else {
    return (
      <Questions
        questions={questions}
        time={time}
        assessment_id={selected_assessment}
        endAssessment={() => setStart(false)}
      />
    );
  }
}
