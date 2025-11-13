import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ profile, children }) {
  if (!profile?.is_admin) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
