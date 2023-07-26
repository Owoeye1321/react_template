import { Navigate, Route, Routes } from "react-router-dom";
import React from "react";
import UserPage from "./pages/UserPage";
import Page404 from "./pages/Page404";
import LoginPage from "./pages/LoginPage";
import ProductsPage from "./pages/ProductsPage";
import Dashboard from "./pages/DashboardAppPage";
import Assessment from "./pages/Assessment";
import CreateAssessment from "./pages/CreateAssessment";
import CreateCandidate from "./pages/CreateCandidate";
import CreateStaff from "./pages/CreateStaff";
import Candidates from "./pages/Candidates";
import Results from "./pages/Result";
import Staffs from "./pages/Staff";
import { ProtectedRoute } from "./protectedRoute";

export default function Routess() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/404" />} />
      <Route path="/404" element={<Page404 />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<ProtectedRoute />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="assessments" element={<Assessment />} />
        <Route path="user" element={<UserPage />} />
        <Route path="product" element={<ProductsPage />} />
        <Route path="assessments/create" element={<CreateAssessment />} />
        <Route path="results" element={<Results />} />
        <Route path="candidates" element={<Candidates />} />
        <Route path="candidates/create" element={<CreateCandidate />} />
        <Route path="staffs/create" element={<CreateStaff />} />
        <Route path="staffs" element={<Staffs />} />
      </Route>
    </Routes>
  );
}
