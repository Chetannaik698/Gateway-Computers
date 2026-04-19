import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext.jsx';
import Navbar        from './components/Navbar.jsx';
import Footer        from './components/Footer.jsx';
import Home          from './pages/Home.jsx';
import Services      from './pages/Services.jsx';
import Products      from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Booking       from './pages/Booking.jsx';
import Contact       from './pages/Contact.jsx';
import Auth          from './pages/Auth.jsx';
import Admin         from './admin/Admin.jsx';

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [pathname]);
  return null;
}

// Layout wraps public pages with Navbar + Footer
function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 'var(--nav-height)' }}>{children}</main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/booking" element={<Layout><Booking /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/login" element={<Layout><Auth /></Layout>} />
          <Route path="/signup" element={<Layout><Auth /></Layout>} />

          {/* Admin — no Navbar/Footer */}
          <Route path="/admin" element={<Admin />} />

          {/* 404 */}
          <Route path="*" element={
            <Layout>
              <div style={{textAlign:'center',padding:'160px 24px',minHeight:'60vh'}}>
                <i className="fa-solid fa-circle-exclamation" style={{fontSize:'64px',color:'var(--orange)',marginBottom:'24px',display:'block'}} />
                <h1 style={{fontSize:'48px',fontWeight:900,marginBottom:'12px'}}>404</h1>
                <p style={{color:'var(--text-muted)',marginBottom:'32px'}}>Page not found.</p>
                <a href="/" className="btn btn-primary btn-lg">← Back to Home</a>
              </div>
            </Layout>
          } />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={2700} hideProgressBar newestOnTop closeOnClick pauseOnHover draggable theme="dark" />
    </AuthProvider>
  );
}
