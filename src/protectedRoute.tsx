import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay-ts';
import { GridLoader } from 'react-spinners';
import { useContexts } from './context';
import DashboardLayout from './layouts/dashboard/DashboardLayout';

export function ProtectedRoute() {
  const {
    state: { isAuth, loading },
  } = useContexts();

  return isAuth ? (
    <LoadingOverlay active={loading} spinner={<GridLoader color="black" style={{ position: 'fixed', top: '50%' }} />}>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </LoadingOverlay>
  ) : (
    <Navigate to="/login" />
  );
}
