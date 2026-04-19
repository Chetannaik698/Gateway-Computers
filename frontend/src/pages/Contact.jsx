import { useState } from 'react';
import { getWhatsAppLink, PHONE_DISPLAY } from '../data/data';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapLink = 'https://www.google.com/maps/search/?api=1&query=14.079034,74.502825';
  const mapEmbed = 'https://www.google.com/maps?q=14.079034,74.502825&z=17&output=embed';

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async () => {
    if (!form.name || !form.phone || !form.message) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      // Submit to backend
      const response = await api.post('/contacts', {
        name: form.name,
        phone: form.phone,
        message: form.message,
        type: 'general',
      });
      
      if (response.data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        // Also open WhatsApp
        const msg = `Hi! I'm ${form.name} (${form.phone}). ${form.message}`;
        window.open(getWhatsAppLink(msg), '_blank');
        setForm({ name: '', phone: '', message: '' });
        setSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-tag">Get In Touch</span>
          <h1 className="section-title">Contact <span>Us</span></h1>
          <p className="section-subtitle">We're here to help. Reach out via call, WhatsApp, or visit our store.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Contact Cards */}
          <div className="contact-cards-row">
            <a href="tel:+919591064356" className="contact-info-card">
              <div className="cic-icon"><i className="fa-solid fa-phone" /></div>
              <div>
                <div className="cic-label">Call Us</div>
                <div className="cic-value">{PHONE_DISPLAY}</div>
                <div className="cic-sub">Mon–Sat, 9AM–7PM</div>
              </div>
            </a>
            <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="contact-info-card">
              <div className="cic-icon cic-icon--wa"><i className="fa-brands fa-whatsapp" /></div>
              <div>
                <div className="cic-label">WhatsApp</div>
                <div className="cic-value">Chat Instantly</div>
                <div className="cic-sub">We reply within minutes</div>
              </div>
            </a>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="contact-info-card">
              <div className="cic-icon cic-icon--loc"><i className="fa-solid fa-location-dot" /></div>
              <div>
                <div className="cic-label">Visit Us</div>
                <div className="cic-value">Gateway Computer</div>
                <div className="cic-sub">Karnataka, India</div>
              </div>
            </a>
            <div className="contact-info-card">
              <div className="cic-icon cic-icon--clock"><i className="fa-solid fa-clock" /></div>
              <div>
                <div className="cic-label">Working Hours</div>
                <div className="cic-value">Mon – Sat</div>
                <div className="cic-sub">9:00 AM – 7:00 PM</div>
              </div>
            </div>
          </div>

          {/* Map + Form */}
          <div className="contact-main-grid">
            {/* Map */}
            <div className="contact-map-block">
              <h2 className="section-title" style={{marginBottom:'24px'}}>Our <span>Location</span></h2>
              <div className="contact-map-frame">
                <iframe
                  title="Gateway Computer Location"
                  src={mapEmbed}
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="contact-quick-btns">
                <a href="tel:+919591064356" className="btn btn-primary">
                  <i className="fa-solid fa-phone" /> Call Now
                </a>
                <a href={mapLink} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  <i className="fa-solid fa-location-dot" /> Open Map
                </a>
                <a href={getWhatsAppLink('Hi! I want to know your shop location and directions.')} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                  <i className="fa-brands fa-whatsapp" /> Get Directions via WhatsApp
                </a>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="contact-form-block">
              <h2 className="section-title" style={{marginBottom:'8px'}}>Send Us a <span>Message</span></h2>
              <p style={{color:'var(--text-muted)',marginBottom:'28px',fontSize:'14px'}}>
                Fill out the form and we'll send your message directly to our WhatsApp.
              </p>

              {sent ? (
                <div className="contact-sent">
                  <i className="fa-solid fa-circle-check" />
                  <h3>Message Sent!</h3>
                  <p>Your WhatsApp should have opened. We'll get back to you shortly.</p>
                  <button className="btn btn-outline" onClick={() => { setForm({name:'',phone:'',message:''}); setSent(false); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <div className="contact-form-fields">
                  <div className="form-group">
                    <label>Your Name</label>
                    <input name="name" value={form.name} onChange={handle} className="form-control" placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input name="phone" value={form.phone} onChange={handle} className="form-control" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div className="form-group">
                    <label>Message</label>
                    <textarea name="message" value={form.message} onChange={handle} className="form-control"
                      rows={5} placeholder="How can we help you?" />
                  </div>
                  <button className="btn btn-whatsapp btn-lg" style={{width:'100%',justifyContent:'center'}} onClick={submit} disabled={loading}>
                    {loading ? (
                      <>
                        <i className="fa-solid fa-spinner fa-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <i className="fa-brands fa-whatsapp" /> Send via WhatsApp
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
