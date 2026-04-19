import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext.jsx';
import './Auth.css';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.pathname.includes('/signup')) {
      setMode('signup');
    } else {
      setMode('login');
    }
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      const destination = user.role === 'admin' || user.role === 'superadmin' ? '/admin' : '/';
      navigate(destination, { replace: true });
    }
  }, [user, navigate]);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    navigate(nextMode === 'signup' ? '/signup' : '/login', { replace: true });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      let userData;
      if (mode === 'login') {
        userData = await login(formData.email, formData.password);
      } else {
        userData = await register(formData.name, formData.email, formData.password);
      }

      const successMessage = mode === 'login' ? 'Successfully signed in' : 'Account created successfully';
      toast.success(successMessage);

      const destination = userData.role === 'admin' || userData.role === 'superadmin' ? '/admin' : '/';
      navigate(destination, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || error?.message || 'Unable to complete request';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === 'login';

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <div className="auth-brand">Gateway Computers</div>
          <h1>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p>
            {isLogin
              ? 'Sign in to manage your bookings, service requests, and customer dashboard from one secure location.'
              : 'Create an account to book services, get quotes, and stay connected with our support team.'}
          </p>

          <div className="auth-highlights">
            <div className="auth-feature">
              <i className="fa-solid fa-shield-halved" />
              <div>
                <strong>Secure access</strong>
                <span>Protected login for every session.</span>
              </div>
            </div>
            <div className="auth-feature">
              <i className="fa-solid fa-clock" />
              <div>
                <strong>Fast entry</strong>
                <span>Quick and seamless sign in experience.</span>
              </div>
            </div>
            <div className="auth-feature">
              <i className="fa-solid fa-headset" />
              <div>
                <strong>Friendly support</strong>
                <span>Service help whenever you need it.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-content">
          <div className="auth-panel">
            <div className="auth-toolbar">
              <button
                type="button"
                className={`auth-tab ${isLogin ? 'active' : ''}`}
                onClick={() => switchMode('login')}
              >
                Login
              </button>
              <button
                type="button"
                className={`auth-tab ${!isLogin ? 'active' : ''}`}
                onClick={() => switchMode('signup')}
              >
                Sign Up
              </button>
            </div>

            <div className="auth-header">
              <h2>{isLogin ? 'Sign in to your account' : 'Register for Gateway'}</h2>
              <p>
                {isLogin
                  ? 'Enter your email and password to continue.'
                  : 'Fill in your details to create a new account.'}
              </p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {!isLogin && (
                <label>
                  Full name
                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </label>
              )}

              <label>
                Email address
                <input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </label>

              <button type="submit" className="btn btn-primary btn-lg auth-submit" disabled={loading}>
                {isLogin ? (loading ? 'Signing in...' : 'Login') : (loading ? 'Creating account...' : 'Sign Up')}
              </button>
            </form>

            <div className="auth-footer">
              <span>{isLogin ? "Don't have an account?" : 'Already have an account?'}</span>
              <button type="button" className="auth-link" onClick={() => switchMode(isLogin ? 'signup' : 'login')}>
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
