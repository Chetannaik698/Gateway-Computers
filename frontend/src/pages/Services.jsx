import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { services as defaultServices, getWhatsAppLink } from '../data/data';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Services.css';

export default function Services() {
  const [services, setServices] = useState(defaultServices);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await api.get('/services');
      if (response.data.success && response.data.services.length > 0) {
        setServices(response.data.services);
      }
    } catch (error) {
      // Use default services from data.js if API fails
      console.log('Using default services');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{textAlign:'center',paddingTop:'160px'}}>
        <i className="fa-solid fa-spinner fa-spin" style={{fontSize:'64px',color:'var(--orange)',marginBottom:'24px'}} />
        <h2>Loading services...</h2>
      </div>
    );
  }
  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <span className="section-tag">What We Offer</span>
          <h1 className="section-title">Our <span>Services</span></h1>
          <p className="section-subtitle">Professional tech services for homes and businesses. Book online or call us directly.</p>
        </div>
      </div>

      {/* Services List */}
      <section className="section">
        <div className="container">
          <div className="services-list">
            {services.map((s, i) => (
              <ServiceItem key={s._id || s.id} service={s} reverse={i % 2 !== 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Book CTA */}
      <section className="section booking-cta-band">
        <div className="container" style={{textAlign:'center'}}>
          <h2 className="section-title">Need a Service? <span>Book Now</span></h2>
          <p className="section-subtitle" style={{margin:'0 auto 32px'}}>
            Fill our quick booking form or reach us directly via call or WhatsApp.
          </p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/booking" className="btn btn-primary btn-lg">
              <i className="fa-solid fa-calendar-check" /> Book a Service
            </Link>
            <a href="tel:+919591064356" className="btn btn-ghost btn-lg">
              <i className="fa-solid fa-phone" /> Call Now
            </a>
            <a href={getWhatsAppLink('Hi! I want to book a service.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <i className="fa-brands fa-whatsapp" /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function ServiceItem({ service: s, reverse }) {
  const waMsg = `Hi! I want to book the service: ${s.title}. Please share more details.`;
  return (
    <div className={`service-item ${reverse ? 'service-item--rev' : ''}`}>
      <div className="si-icon-col">
        <div className="si-big-icon">
          <i className={`fa-solid ${s.icon}`} />
        </div>
        <div className="si-price-badge">{s.price}</div>
      </div>
      <div className="si-content">
        <h2>{s.title}</h2>
        <p className="si-desc">{s.description}</p>
        <div className="si-features">
          {s.features.map(f => (
            <div key={f} className="si-feature">
              <i className="fa-solid fa-check" /> {f}
            </div>
          ))}
        </div>
        <div className="si-actions">
          <Link to="/booking" className="btn btn-primary">
            <i className="fa-solid fa-calendar-check" /> Book Now
          </Link>
          <a href={getWhatsAppLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
            <i className="fa-brands fa-whatsapp" /> WhatsApp
          </a>
          <a href="tel:+919591064356" className="btn btn-ghost">
            <i className="fa-solid fa-phone" /> Call
          </a>
        </div>
      </div>
    </div>
  );
}
