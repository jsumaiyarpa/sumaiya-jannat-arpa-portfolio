import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from './adminApi.js';
import './admin.css';

export default function AdminLogin() {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setCredentials((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!credentials.username.trim() || !credentials.password) {
      setError('Please enter your username and password.');
      return;
    }

    try {
      setLoading(true);

      await adminApi('/api/auth/login', {
        method: 'POST',
        body: credentials,
      });

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.status === 401
          ? 'Invalid username or password.'
          : err.message || 'Unable to sign in. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <section className="admin-login-panel">
        <div className="admin-login-heading">
          <span className="admin-login-eyebrow">ARPA PORTFOLIO</span>
          <h1>Admin Sign In</h1>
          <p>Sign in to manage your portfolio content.</p>
        </div>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <div className="admin-form-field">
            <label htmlFor="admin-username">Username or email</label>
            <input
              id="admin-username"
              name="username"
              type="text"
              autoComplete="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="admin-form-field">
            <label htmlFor="admin-password">Password</label>

            <div className="admin-password-wrapper">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />

              <button
                type="button"
                className="admin-password-toggle"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-login-submit"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="admin-login-footer">
          Authorized access only.
        </p>
      </section>
    </main>
  );
}