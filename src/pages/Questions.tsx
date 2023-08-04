import { Helmet } from "react-helmet-async";
import React, { useEffect } from "react";
//import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography, Card, Box, TextareaAutosize, Modal, Avatar, Button } from "@mui/material";
import { useContexts } from "../context";
import { LoadingButton } from "@mui/lab";
import numeral from "numeral";
import { IQuestions } from "./CandidateAssessment";
import { useState } from "react";
import { submit_assessment } from "../utils/api";
// ----------------------------------------------------------------------

export default function Questions({ questions, time, assessment_id, endAssessment }: any) {
  const {
    set_loading,
    state: { user },
  } = useContexts();
  //const theme = useTheme();
  const [selectedAnswer, setSelectedAnswer] = useState<any>({ question: "", answer: "" });
  const [start, setStart] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  let [hours, setHour] = useState(time && time);
  const [assessmentData, setAssessmentData] = useState<any>({ group_id: "", objective: [], essay: [] });
  const [doneModal, setDoneModal] = useState(false);

  const generalStyle = {
    width: "100%",
    minHeight: "50px",
    padding: "10px",
    border: 1,
    "&:hover": {
      transform: "scale(1.04)",
      background: "#ADD8E6",
    },
    cursor: "pointer",
  };

  const nextQuestion = async () => {
    let obj: any = [];
    let essay: any = [];
    if (!selectedAnswer.question || !selectedAnswer.answer) return;
    if (questions[currentQuestion].option_a && questions[currentQuestion].option_a) {
      await setAssessmentData({
        ...assessmentData,
        objective: [
          ...assessmentData.objective,
          { _id: questions[currentQuestion]._id, answer: selectedAnswer.answer },
        ],
      });
      await obj.push(...assessmentData.objective, {
        _id: questions[currentQuestion]._id,
        answer: selectedAnswer.answer,
      });
    } else {
      await setAssessmentData({
        ...assessmentData,
        essay: [
          ...assessmentData.essay,
          { question: questions[currentQuestion].question, answer: selectedAnswer.answer },
        ],
      });
      await essay.push(...assessmentData.essay, {
        question: questions[currentQuestion].question,
        answer: selectedAnswer.answer,
      });
    }
    await setSelectedAnswer({ question: "", answer: "" });
    if (questions.length > currentQuestion + 1) {
      await setCurrentQuestion(currentQuestion + 1);
    }
    if (questions.length === currentQuestion + 1) {
      await submitAssessment({ objective: obj, essay: essay });
      await setStart(false);
    }
  };

  const submitAssessment = async (data: any) => {
    try {
      await set_loading(true);
      const done = await submit_assessment({ ...assessmentData, group_id: assessment_id });
      if (done) {
        //alert("Assessment Submitted");
        setDoneModal(true);
        await setSelectedAnswer({ question: "", answer: "" });
      }
      await set_loading(false);
    } catch (error) {
      alert("An error occured");
    }
  };

  const autoSubmitAssessment = async () => {
    try {
      await set_loading(true);
      const done = await submit_assessment({ ...assessmentData, group_id: assessment_id });
      if (done) {
        alert("Assessment Submitted");
        await setSelectedAnswer({ question: "", answer: "" });
      }
      await set_loading(false);
    } catch (error) {
      alert("An error occured");
    }
  };

  useEffect(() => {
    const unloadCallback = (event: any) => {
      event.preventDefault();
      //autoSubmitAssessment();
      event.returnValue = "Do not close";
      //return autoSubmitAssessment();
    };

    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  useEffect(() => {
    if (time && hours === 0) {
      autoSubmitAssessment();
      return;
    }
    if (!start) return;
    const interval = setInterval(() => {
      setHour(hours--);
    }, 500);

    return () => clearInterval(interval);
  }, [hours]);

  return (
    <>
      <Helmet>
        <title>Questions</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ width: { md: "70%", xs: "100%" }, margin: "auto" }}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h4" sx={{ mb: 5 }}>
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Typography variant="h4" sx={{ mb: 5 }}>
            {time && numeral(hours).format(":")}
          </Typography>
        </Box>
        <Grid container spacing={0}>
          <Box>
            <i>Please know that you closing this window automatically submits your assessment.</i>
          </Box>
          <Grid item xs={12} md={12} lg={12}>
            <Card
              component="div"
              sx={{
                minHeight: { md: "40vh", xs: "60vh" },
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h5">{questions[currentQuestion].question}</Typography>
              <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
                {questions[currentQuestion].option_a ? (
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6} lg={6}>
                      <Card
                        onClick={() =>
                          setSelectedAnswer({
                            ...selectedAnswer,
                            question: questions[currentQuestion].question,
                            answer: questions[currentQuestion].option_a,
                          })
                        }
                        sx={{
                          ...generalStyle,
                          ...(selectedAnswer.answer === questions[currentQuestion].option_a
                            ? { background: "#ADD8E6" }
                            : ""),
                        }}
                      >
                        {questions[currentQuestion].option_a}
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                      <Card
                        onClick={() =>
                          setSelectedAnswer({
                            ...selectedAnswer,
                            question: questions[currentQuestion].question,
                            answer: questions[currentQuestion].option_b,
                          })
                        }
                        sx={{
                          ...generalStyle,
                          ...(selectedAnswer.answer === questions[currentQuestion].option_b
                            ? { background: "#ADD8E6" }
                            : ""),
                        }}
                      >
                        {questions[currentQuestion].option_b}
                      </Card>
                    </Grid>
                    {questions[currentQuestion].option_c && (
                      <Grid item xs={12} md={6} lg={6}>
                        <Card
                          onClick={() =>
                            setSelectedAnswer({
                              ...selectedAnswer,
                              question: questions[currentQuestion].question,
                              answer: questions[currentQuestion].option_c,
                            })
                          }
                          sx={{
                            ...generalStyle,
                            ...(selectedAnswer.answer === questions[currentQuestion].option_c
                              ? { background: "#ADD8E6" }
                              : ""),
                          }}
                        >
                          {questions[currentQuestion].option_c}
                        </Card>
                      </Grid>
                    )}
                    {questions[currentQuestion].option_d && (
                      <Grid item xs={12} md={6} lg={6}>
                        <Card
                          onClick={() =>
                            setSelectedAnswer({
                              ...selectedAnswer,
                              question: questions[currentQuestion].question,
                              answer: questions[currentQuestion].option_d,
                            })
                          }
                          sx={{
                            ...generalStyle,
                            ...(selectedAnswer.answer === questions[currentQuestion].option_d
                              ? { background: "#ADD8E6" }
                              : ""),
                          }}
                        >
                          {questions[currentQuestion].option_d}
                        </Card>
                      </Grid>
                    )}
                  </Grid>
                ) : (
                  <TextareaAutosize
                    value={!questions[currentQuestion].option_a ? selectedAnswer.answer : ""}
                    minRows={7}
                    onChange={(e) => {
                      setSelectedAnswer({
                        ...selectedAnswer,
                        question: questions[currentQuestion].question,
                        answer: e.target.value,
                      });
                    }}
                  />
                )}
                <LoadingButton
                  sx={{ minWidth: { md: "10%", xs: "100%" }, marginLeft: "auto", marginTop: "20px" }}
                  variant="contained"
                  onClick={nextQuestion}
                  disabled={!selectedAnswer.question || !selectedAnswer.answer}
                >
                  {questions.length === currentQuestion + 1 ? "Complete Assessment" : "Next"}
                </LoadingButton>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>

      <Modal
        open={doneModal}
        onClose={() => {}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "30%",
            minHeight: "40vh",
            margin: "auto",
            backgroundColor: "#fff",
            overflow: "scroll",
            marginTop: "15%",
          }}
        >
          <Box sx={{ margin: "30px" }}>
            <Box
              sx={{
                bgcolor: "transparent",
                border: "transparent",
                cursor: "pointer",
                marginBottom: "10px",
              }}
              component="button"
              onClick={() => setDoneModal(false)}
            >
              <Avatar
                src="/assets/images/completed-icon.jpg"
                sx={{ height: "50%", width: "50%", margin: "auto" }}
                alt="photoURL"
              />
            </Box>
            <Typography
              id="modal-modal-title"
              sx={{ textAlign: "center", marginBottom: "30px" }}
              variant="h4"
              component="h2"
            >
              Assessment Completed
            </Typography>
            <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <Button variant="contained" onClick={endAssessment}>
                Go Home
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </>
  );
}
