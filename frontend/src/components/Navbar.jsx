import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import logoDark from '../Assets/logo.jpeg';
import logoLight from '../Assets/logo_white.png';
import './Navbar.css';

const navLinks = [
  { path: '/',          label: 'Home'     },
  { path: '/services',  label: 'Services' },
  { path: '/products',  label: 'Products' },
  { path: '/booking',   label: 'Book Now' },
  { path: '/contact',   label: 'Contact'  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    if (typeof window === 'undefined') return 'dark';
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    document.documentElement.classList.toggle('theme-light', theme === 'light');
    document.documentElement.classList.toggle('theme-dark', theme === 'dark');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setProfileOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__logo">
          <img
            src={theme === 'light' ? logoLight : logoDark}
            alt="Gateway Computers logo"
            className="logo-image"
          />
        </Link>

        <nav className="navbar__links">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar__cta">
          <button
            type="button"
            className="btn btn-ghost btn-sm theme-toggle"
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
          </button>
          <a href="tel:+919591064356" className="btn btn-ghost btn-sm">
            <i className="fa-solid fa-phone" /> Call Us
          </a>

          {user ? (
            <div className="navbar__profile">
              <button
                type="button"
                className="profile-toggle btn btn-ghost btn-sm"
                onClick={() => setProfileOpen((prev) => !prev)}
                aria-expanded={profileOpen}
              >
                <i className="fa-solid fa-user-circle" />
                <span>{user.name ? user.name.split(' ')[0] : user.email}</span>
                <i className={`fa-solid ${profileOpen ? 'fa-caret-up' : 'fa-caret-down'}`} />
              </button>
              {profileOpen && (
                <div className="navbar__profile-menu">
                  {isAdmin && (
                    <Link to="/admin" className="profile-menu-item" onClick={() => setProfileOpen(false)}>
                      <i className="fa-solid fa-lock" /> Admin Panel
                    </Link>
                  )}
                  <button type="button" className="profile-menu-item" onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
          )}
        </div>

        <button
          className={`hamburger ${menuOpen ? 'hamburger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}>
        <nav className="mobile-nav">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === '/'}
              className={({ isActive }) => `mobile-nav-link ${isActive ? 'mobile-nav-link--active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="mobile-actions">
            <button
              type="button"
              className="btn btn-ghost theme-toggle"
              onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <i className={`fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} />
            </button>
            <a href="tel:+919591064356" className="btn btn-ghost">
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-outline">
                    <i className="fa-solid fa-lock" /> Admin Panel
                  </Link>
                )}
                <button type="button" className="btn btn-primary" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">
                Login
              </Link>
            )}
          </div>
        </nav>
      </div>

      {menuOpen && <div className="mobile-overlay" onClick={() => setMenuOpen(false)} />}
    </header>
  );
}
