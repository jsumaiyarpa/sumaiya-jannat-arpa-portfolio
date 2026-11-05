
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminApi } from './adminApi.js';

export default function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let active = true;

    adminApi('/api/auth/me')
      .then(() => {
        if (active) setStatus('authenticated');
      })
      .catch(() => {
        if (active) setStatus('unauthenticated');
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <main className="admin-loading-screen">
        <div className="admin-loading-spinner" />
        <p>Verifying admin session...</p>
      </main>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
