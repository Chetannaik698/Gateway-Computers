import { Link } from 'react-router-dom';
import { PHONE_DISPLAY, getWhatsAppLink } from '../data/data';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon-sm"><i className="fa-solid fa-microchip" /></div>
              <div>
                <div className="f-logo-name">Gateway Computers</div>
                <div className="f-logo-tag">Your Trusted Tech Partner</div>
              </div>
            </div>
            <p className="footer-about">
              Gateway Computers — your go-to local tech shop for computers, CCTV, printers, and professional repair services. We bring technology closer to you.
            </p>
            <div className="footer-socials">
              <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                <i className="fa-brands fa-whatsapp" />
              </a>
              <a href="tel:+919591064356" aria-label="Call">
                <i className="fa-solid fa-phone" />
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fa-brands fa-instagram" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/booking">Book a Service</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Our Services</h4>
            <ul>
              <li><Link to="/services">CCTV Installation</Link></li>
              <li><Link to="/services">IP / PTZ Cameras</Link></li>
              <li><Link to="/services">Computer Repair</Link></li>
              <li><Link to="/services">Gaming PC Build</Link></li>
              <li><Link to="/services">Printer Service</Link></li>
              <li><Link to="/services">Laptop Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact Us</h4>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <i className="fa-solid fa-phone" />
                <a href="tel:+919591064356">{PHONE_DISPLAY}</a>
              </div>
              <div className="footer-contact-item">
                <i className="fa-brands fa-whatsapp" />
                <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-location-dot" />
                <span>Karnataka, India</span>
              </div>
              <div className="footer-contact-item">
                <i className="fa-solid fa-clock" />
                <span>Mon–Sat: 9AM – 7PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {year} Gateway Computers. All rights reserved.</p>
          <p>Designed with <i className="fa-solid fa-heart" style={{color:'var(--orange)'}} /> for our customers</p>
        </div>
      </div>
    </footer>
  );
}
