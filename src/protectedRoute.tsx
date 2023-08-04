import { Outlet, Navigate } from "react-router-dom";
import LoadingOverlay from "react-loading-overlay-ts";
import { useContexts } from "./context";
import DashboardLayout from "./layouts/dashboard/DashboardLayout";
import CircularProgress from "@mui/material/CircularProgress";

export function ProtectedRoute() {
  const {
    state: { isAuth, loading },
  } = useContexts();

  return isAuth ? (
    <LoadingOverlay
      active={loading}
      spinner={<CircularProgress variant="indeterminate" style={{ position: "fixed", top: "50%" }} />}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </LoadingOverlay>
  ) : (
    <Navigate to="/login" />
  );
}

export function ProtectedAdminRoute() {
  const {
    state: { isAuth, loading, user },
  } = useContexts();

  return isAuth && user.role === "admin" ? (
    <LoadingOverlay
      active={loading}
      spinner={<CircularProgress variant="indeterminate" style={{ position: "fixed", top: "50%" }} />}
    >
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </LoadingOverlay>
  ) : (
    <Navigate to="/login" />
  );
}
