import { Helmet } from "react-helmet-async";
import { faker } from "@faker-js/faker";
import React from "react";
// @mui
import { useTheme } from "@mui/material/styles";
import { Grid, Container, Typography } from "@mui/material";
// components
import Iconify from "../components/iconify";
// sections
import { AppCurrentVisits, AppWebsiteVisits, AppWidgetSummary } from "../sections/@dashboard/app";

// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

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
            <AppWidgetSummary title="Candidates" total={714000} icon="mdi:account-arrow-down" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Assessments" total={1352831} color="info" icon="mdi:application-edit" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Questions" total={1723315} color="warning" icon="raphael:question" />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Staffs" total={234} color="error" icon="mdi:account-check" />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits
              title="Assessment Taken"
              subheader="List of assessment taken for the last 12 months"
              chartLabels={[
                "01/01/2023",
                "02/01/2023",
                "03/01/2023",
                "04/01/2023",
                "05/01/2023",
                "06/01/2023",
                "07/01/2023",
                "08/01/2023",
                "09/01/2023",
                "10/01/2023",
                "11/01/2023",
              ]}
              chartData={[
                {
                  name: "Staff",
                  type: "column",
                  fill: "solid",
                  data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                },
                {
                  name: "Candidates",
                  type: "area",
                  fill: "gradient",
                  data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
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
