import React from 'react';
import { Navigate } from 'react-router-dom';

const getTokenPayload = (token) => {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const decoded = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(
      decoded.split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join('')
    ));
  } catch (error) {
    return null;
  }
};

const ProtectedRoute = ({ role, children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to='/' replace />;
  }

  const payload = getTokenPayload(token);
  if (!payload || payload.role !== role) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
