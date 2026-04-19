import { Link } from 'react-router-dom';
import './Auth.css';

export default function Login() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <div className="auth-brand">Gateway Computers</div>
          <h1>Secure sign in</h1>
          <p>Access your account to book services, view orders, and manage support requests with one secure login.</p>

          <div className="auth-highlights">
            <div className="auth-feature">
              <i className="fa-solid fa-shield-halved" />
              <div>
                <strong>Secure access</strong>
                <span>Protected sign-in with trusted security.</span>
              </div>
            </div>
            <div className="auth-feature">
              <i className="fa-solid fa-clock" />
              <div>
                <strong>Fast entry</strong>
                <span>Quick login from any device.</span>
              </div>
            </div>
            <div className="auth-feature">
              <i className="fa-solid fa-hands-helping" />
              <div>
                <strong>Dedicated support</strong>
                <span>One place for service requests and follow-ups.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-content">
          <div className="auth-panel">
            <div className="auth-header">
              <h2>Welcome back</h2>
              <p>Please enter your credentials to continue.</p>
            </div>

            <form className="auth-form" onSubmit={e => e.preventDefault()}>
              <label>
                Email address
                <input type="email" placeholder="you@example.com" required />
              </label>

              <label>
                Password
                <input type="password" placeholder="Enter your password" required />
              </label>

              <div className="auth-actions">
                <label className="auth-remember">
                  <input type="checkbox" /> Remember me
                </label>
                <Link to="/" className="auth-forgot">Forgot password?</Link>
              </div>

              <button type="submit" className="btn btn-primary btn-lg">Sign In</button>
            </form>

            <div className="auth-footer">
              <span>Don't have an account?</span>
              <Link to="/signup" className="auth-link">Create one</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
