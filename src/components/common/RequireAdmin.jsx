import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export default function RequireAdmin() {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return null;
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}





