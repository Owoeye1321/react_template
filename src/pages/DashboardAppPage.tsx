import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
import React, { useEffect, useState } from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Iconify from "../components/iconify";
// sections
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from "../sections/@dashboard/app";
import { useContexts } from "../context";
import { get_dashboard_data } from "../utils/api";

// ----------------------------------------------------------------------

interface assessmentTaken {
  assessmentTaken: number;
  month: string;
  year: string | number;
}
export interface DashboardPage {
  users: {
    candidates: number;
    staffs: number;
  };
  assessment: {
    totalAssessment: number;
    totalObjectives: number;
    totalEssay: number;
    pastTakenAssessment: Array<assessmentTaken>;
  };
}

export default function DashboardAppPage() {
  const [data, setData] = useState<DashboardPage>({
    users: {
      candidates: 0,
      staffs: 0,
    },
    assessment: {
      totalAssessment: 0,
      totalObjectives: 0,
      totalEssay: 0,
      pastTakenAssessment: [],
    },
  });
  const { set_loading } = useContexts();
  const theme = useTheme();

  const loadData = async () => {
    try {
      await set_loading(true);
      const data: DashboardPage = await get_dashboard_data();
      setData(data);
      await set_loading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Hi, Welcome back
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Candidates" total={data.users.candidates} icon="mdi:account-arrow-down" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Assessments"
              total={data.assessment.totalAssessment}
              color="info"
              icon="mdi:application-edit"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary
              title="Questions"
              total={data.assessment.totalObjectives + data.assessment.totalEssay}
              color="warning"
              icon="raphael:question"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Staffs" total={data.users.staffs} color="error" icon="mdi:account-check" />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Assessment Taken"
              subheader="List of assessment taken for the last 12 months"
              chartLabels={data.assessment.pastTakenAssessment.map((i) => {
                return `01/${i.month}/${i.year}`;
              })}
              chartData={[
                {
                  name: "Assessment",
                  type: "area",
                  fill: "gradient",
                  data: data.assessment.pastTakenAssessment.map((i) => {
                    return i.assessmentTaken;
                  }),
                },
              ]}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits
              title="Designations"
              chartData={[
                { label: "Fullstack Developer", value: 4344 },
                { label: "Human Resources", value: 5435 },
                { label: "Accountant", value: 1443 },
                { label: "Backend Engineer", value: 4443 },
              ]}
              chartColors={[
                theme.palette.primary.main,
                theme.palette.info.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
