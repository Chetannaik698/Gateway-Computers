import { useState } from 'react';
import UPIPayment from '../components/UPIPayment';
import { getWhatsAppLink } from '../data/data';
import './Payment.css';

export default function Payment() {
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [showQR, setShowQR] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (amountInput && Number(amountInput) > 0) {
      setShowQR(true);
    }
  };

  const waMsg = `Hi, I just made a payment of ₹${amountInput} for ${noteInput || 'services'}. Here is my screenshot:`;

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <span className="section-tag">Secure Payment</span>
          <h1 className="section-title">Pay <span>Online</span></h1>
          <p className="section-subtitle">Use our secure UPI QR code to pay for your repairs, purchases, or advance booking.</p>
        </div>
      </div>

      <section className="section payment-section">
        <div className="container">
          <div className="payment-layout">
            <div className="payment-form-card card">
              <h2>Payment Details</h2>
              <p className="payment-desc">Enter the amount you wish to pay to generate a custom QR code.</p>
              
              <form onSubmit={handleGenerate} className="payment-form">
                <div className="form-group">
                  <label>Amount (₹) *</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Enter amount (e.g. 500)"
                    value={amountInput}
                    onChange={(e) => {
                      setAmountInput(e.target.value);
                      setShowQR(false);
                    }}
                    min="1"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Note / Reference (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Laptop Repair Advance"
                    value={noteInput}
                    onChange={(e) => {
                      setNoteInput(e.target.value);
                      setShowQR(false);
                    }}
                    maxLength={50}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                  <i className="fa-solid fa-qrcode" /> Generate QR Code
                </button>
              </form>
            </div>

            <div className="payment-qr-display">
              {showQR ? (
                <div className="animate-fade-in-up">
                  <UPIPayment 
                    amount={Number(amountInput)} 
                    note={noteInput || 'Gateway Computers Payment'} 
                  />
                  <div className="payment-success-action" style={{ textAlign: 'center', marginTop: '16px' }}>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '12px', fontSize: '14px' }}>
                      After paying, please share a screenshot with us on WhatsApp.
                    </p>
                    <a href={getWhatsAppLink(waMsg)} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp">
                      <i className="fa-brands fa-whatsapp" /> Share Screenshot
                    </a>
                  </div>
                </div>
              ) : (
                <div className="empty-qr-state">
                  <i className="fa-solid fa-qrcode empty-qr-icon" />
                  <p>Enter an amount to generate your payment QR code.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
