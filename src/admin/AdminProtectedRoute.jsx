
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { adminApi } from './adminApi.js';

export default function AdminProtectedRoute({ children }) {
  const [status, setStatus] = useState('checking');
  const location = useLocation();

  useEffect(() => {
    let active = true;

    async function verifyAuth() {
      try {
        await adminApi('/api/auth/me');
        if (active) setStatus('authenticated');
      } catch (err) {
        // If 401, retry once after a short delay in case of cross-origin cookie sync delay
        if (err.status === 401) {
          try {
            await new Promise((resolve) => setTimeout(resolve, 200));
            if (!active) return;
            await adminApi('/api/auth/me');
            if (active) {
              setStatus('authenticated');
              return;
            }
          } catch {
            // Second attempt failed, proceed to unauthenticated
          }
        }
        if (active) setStatus('unauthenticated');
      }
    }

    verifyAuth();

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
