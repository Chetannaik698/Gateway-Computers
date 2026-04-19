import { useState } from 'react';
import { services, getWhatsAppLink } from '../data/data';
import UPIPayment from '../components/UPIPayment';
import api from '../utils/api';
import { toast } from 'react-toastify';
import './Booking.css';

const initialForm = {
  name: '', phone: '', service: '', date: '', address: '', message: ''
};

export default function Booking() {
  const [form, setForm]       = useState(initialForm);
  const [errors, setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Name is required';
    if (!form.phone.trim())   e.phone   = 'Phone is required';
    else if (!/^\d{10}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit number';
    if (!form.service)        e.service = 'Please select a service';
    if (!form.date)           e.date    = 'Please pick a date';
    if (!form.address.trim()) e.address = 'Address is required';
    return e;
  };

  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }));
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setLoading(true);
    try {
      const response = await api.post('/bookings', {
        name: form.name,
        phone: form.phone,
        service: form.service,
        serviceLabel: form.service,
        preferredDate: form.date,
        address: form.address,
        additionalNotes: form.message,
      });
      
      if (response.data.success) {
        toast.success(response.data.message || 'Booking submitted successfully!');
        setSubmitted(true);
        setForm(initialForm);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const waMsg = form.name
    ? `Hi! I'm ${form.name}. I'd like to book: ${form.service} on ${form.date}. My address: ${form.address}. Phone: ${form.phone}.`
    : 'Hi! I want to book a service.';

  if (submitted) {
    return (
      <div className="booking-success-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon"><i className="fa-solid fa-circle-check" /></div>
            <h2>Booking Received!</h2>
            <p>Thank you, <strong>{form.name}</strong>! We've received your booking request for <strong>{form.service}</strong> on <strong>{form.date}</strong>.</p>
            <p>Our team will contact you at <strong>+91 {form.phone}</strong> shortly to confirm.</p>
            
            <div className="booking-advance-payment" style={{ marginTop: '24px', marginBottom: '24px', padding: '24px', background: 'var(--black-3)', borderRadius: '12px', border: '1px solid rgba(255,107,0,0.2)' }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--orange)' }}>Pay Booking Advance (Optional)</h3>
              <p style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-muted)' }}>You can pay an advance of ₹500 to confirm your slot immediately.</p>
              <UPIPayment amount={500} note={`Advance for ${form.service}`} />
            </div>

            <div className="success-actions">
              <a href={getWhatsAppLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
                <i className="fa-brands fa-whatsapp" /> Confirm via WhatsApp
              </a>
              <button className="btn btn-outline" onClick={() => { setForm(initialForm); setSubmitted(false); }}>
                Book Another Service
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-tag">Schedule</span>
          <h1 className="section-title">Book a <span>Service</span></h1>
          <p className="section-subtitle">Fill the form below and we'll confirm your appointment within 2 hours.</p>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="booking-layout">
            {/* Form */}
            <div className="booking-form-card">
              <div className="booking-form-header">
                <i className="fa-solid fa-calendar-check" />
                <div>
                  <h2>Service Booking Form</h2>
                  <p>All fields marked * are required</p>
                </div>
              </div>

              <div className="booking-form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="name" value={form.name} onChange={handleChange}
                    placeholder="Enter your full name" className="form-control" />
                  {errors.name && <span className="field-error"><i className="fa-solid fa-circle-exclamation" /> {errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <div className="phone-input-wrap">
                    <span className="phone-prefix">+91</span>
                    <input name="phone" value={form.phone} onChange={handleChange}
                      placeholder="10-digit mobile number" className="form-control phone-input"
                      maxLength={10} inputMode="numeric" />
                  </div>
                  {errors.phone && <span className="field-error"><i className="fa-solid fa-circle-exclamation" /> {errors.phone}</span>}
                </div>

                <div className="form-group span-2">
                  <label>Select Service *</label>
                  <select name="service" value={form.service} onChange={handleChange} className="form-control">
                    <option value="">-- Choose a service --</option>
                    {services.map(s => (
                      <option key={s.id} value={s.title}>{s.title}</option>
                    ))}
                  </select>
                  {errors.service && <span className="field-error"><i className="fa-solid fa-circle-exclamation" /> {errors.service}</span>}
                </div>

                <div className="form-group">
                  <label>Preferred Date *</label>
                  <input type="date" name="date" value={form.date} onChange={handleChange}
                    className="form-control" min={today} />
                  {errors.date && <span className="field-error"><i className="fa-solid fa-circle-exclamation" /> {errors.date}</span>}
                </div>

                <div className="form-group">
                  <label>Preferred Time</label>
                  <select name="time" value={form.time} onChange={handleChange} className="form-control">
                    <option value="">-- Select time slot --</option>
                    <option>9:00 AM – 11:00 AM</option>
                    <option>11:00 AM – 1:00 PM</option>
                    <option>2:00 PM – 4:00 PM</option>
                    <option>4:00 PM – 6:00 PM</option>
                  </select>
                </div>

                <div className="form-group span-2">
                  <label>Your Address *</label>
                  <textarea name="address" value={form.address} onChange={handleChange}
                    placeholder="House/Flat No., Street, Area, City" className="form-control"
                    rows={3} />
                  {errors.address && <span className="field-error"><i className="fa-solid fa-circle-exclamation" /> {errors.address}</span>}
                </div>

                <div className="form-group span-2">
                  <label>Additional Notes</label>
                  <textarea name="message" value={form.message} onChange={handleChange}
                    placeholder="Describe the issue or any special requirements..." className="form-control"
                    rows={3} />
                </div>
              </div>

              <div className="booking-form-footer">
                <button className="btn btn-primary btn-lg" style={{width:'100%',justifyContent:'center'}} onClick={handleSubmit} disabled={loading}>
                  {loading ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin" /> Submitting...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar-check" /> Submit Booking Request
                    </>
                  )}
                </button>
                <p className="form-note">
                  <i className="fa-solid fa-lock" /> Your information is safe with us. We do not share your data.
                </p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="booking-sidebar">
              <div className="sidebar-card">
                <h3><i className="fa-solid fa-phone" /> Prefer to Call?</h3>
                <p>Our team is available Mon–Sat, 9AM–7PM</p>
                <a href="tel:+919591064356" className="btn btn-primary" style={{width:'100%',justifyContent:'center',marginTop:'12px'}}>
                  +91 9591064356
                </a>
              </div>
              <div className="sidebar-card">
                <h3><i className="fa-brands fa-whatsapp" /> WhatsApp Us</h3>
                <p>Send a message and we'll respond immediately.</p>
                <a href={getWhatsAppLink(waMsg)} target="_blank" rel="noopener noreferrer"
                  className="btn btn-whatsapp" style={{width:'100%',justifyContent:'center',marginTop:'12px'}}>
                  Chat on WhatsApp
                </a>
              </div>
              <div className="sidebar-card services-sidebar">
                <h3>Available Services</h3>
                {services.map(s => (
                  <div key={s.id} className="sidebar-service-item">
                    <div className="ss-icon"><i className={`fa-solid ${s.icon}`} /></div>
                    <div>
                      <div className="ss-name">{s.title}</div>
                      <div className="ss-price">{s.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sidebar-card guarantee-card">
                <i className="fa-solid fa-medal" />
                <h3>Our Guarantee</h3>
                <p>90-day warranty on all repair services. No fix, no charge.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
