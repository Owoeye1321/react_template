import { Navigate, Route, Routes } from "react-router-dom";
import * as React from "react";
import UserPage from "./pages/UserPage";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/Register";
import ProductsPage from "./pages/ProductsPage";
import Dashboard from "./pages/DashboardAppPage";
import Assessment from "./pages/Assessment";
import CreateAssessment from "./pages/CreateAssessment";
import CreateCandidate from "./pages/CreateCandidate";
import CreateStaff from "./pages/CreateStaff";
import Candidates from "./pages/Candidates";
import CandidatesRequest from "./pages/CandidateRequest";
import Results from "./pages/Result";
import Staffs from "./pages/Staff";
import Designation from "./pages/Designations";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ScoreEssay from "./pages/ScoreEssay";
import CandidateStaff from "./pages/CandidateAssessment";
import CreateUser from "./pages/CreateUser";
import { ProtectedRoute, ProtectedAdminRoute } from "./protectedRoute";

export default function Routess() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/404" element={<Page404 />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/forgot-password/reset" element={<ResetPassword />} />
      <Route path="/" element={<ProtectedAdminRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assessments" element={<Assessment />} />
        <Route path="user" element={<UserPage />} />
        <Route path="product" element={<ProductsPage />} />
        <Route path="assessments/create" element={<CreateAssessment />} />
        <Route path="results" element={<Results />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/create" element={<CreateCandidate />} />
        <Route path="candidates-request" element={<CandidatesRequest />} />
        <Route path="user/create" element={<CreateUser />} />
        <Route path="staffs/create" element={<CreateStaff />} />
        <Route path="staffs" element={<Staffs />} />
        <Route path="designation" element={<Designation />} />
        <Route path="essay/score" element={<ScoreEssay />} />
      </Route>
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="candidate/assessments" element={<CandidateStaff />} />
      </Route>
    </Routes>
  );
}
