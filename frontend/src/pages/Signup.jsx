import { Link } from 'react-router-dom';
import './Auth.css';

export default function Signup() {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <div className="auth-brand">Gateway Computers</div>
          <h1>Create your account</h1>
          <p>Start booking services, tracking orders, and managing support with a single user profile.</p>

          <div className="auth-highlights">
            <div className="auth-feature">
              <i className="fa-solid fa-user-check" />
              <div>
                <strong>Easy setup</strong>
                <span>Quick account creation in a few steps.</span>
              </div>
            </div>
            <div className="auth-feature">
              <i className="fa-solid fa-lock" />
              <div>
                <strong>Protected data</strong>
                <span>Your information stays safe and secure.</span>
              </div>
            </div>
            <div className="auth-feature">
              <i className="fa-solid fa-cog" />
              <div>
                <strong>Service control</strong>
                <span>Manage bookings, quotes, and requests easily.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-content">
          <div className="auth-panel">
            <div className="auth-header">
              <h2>Create an account</h2>
              <p>Fill in your details to get started with Gateway Computers.</p>
            </div>

            <form className="auth-form" onSubmit={e => e.preventDefault()}>
              <label>
                Full name
                <input type="text" placeholder="Your name" required />
              </label>

              <label>
                Email address
                <input type="email" placeholder="you@example.com" required />
              </label>

              <label>
                Password
                <input type="password" placeholder="Create a password" required />
              </label>

              <label>
                Confirm password
                <input type="password" placeholder="Confirm your password" required />
              </label>

              <button type="submit" className="btn btn-primary btn-lg">Sign Up</button>
            </form>

            <div className="auth-footer">
              <span>Already have an account?</span>
              <Link to="/login" className="auth-link">Sign in</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
