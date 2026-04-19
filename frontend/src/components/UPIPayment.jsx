import React from 'react';
import QRCode from 'react-qr-code';
import { UPI_CONFIG } from '../data/data';
import './UPIPayment.css';

export default function UPIPayment({ amount, note, onClose }) {
  // Construct the UPI link
  const upiLink = `upi://pay?pa=${UPI_CONFIG.upiId}&pn=${encodeURIComponent(UPI_CONFIG.payeeName)}${amount ? `&am=${amount}` : ''}${note ? `&tn=${encodeURIComponent(note)}` : ''}&cu=${UPI_CONFIG.currency}`;

  return (
    <div className="upi-payment-container">
      <div className="upi-qr-card">
        <h3 className="upi-title">Scan & Pay</h3>
        <p className="upi-subtitle">Use any UPI app (GPay, PhonePe, Paytm)</p>
        
        <div className="qr-wrapper">
          <QRCode
            value={upiLink}
            size={200}
            bgColor="#ffffff"
            fgColor="#000000"
            level="Q"
          />
        </div>

        <div className="upi-details">
          <div className="upi-detail-row">
            <span className="upi-label">UPI ID:</span>
            <span className="upi-value">{UPI_CONFIG.upiId}</span>
          </div>
          <div className="upi-detail-row">
            <span className="upi-label">Payee:</span>
            <span className="upi-value">{UPI_CONFIG.payeeName}</span>
          </div>
          {amount && (
            <div className="upi-detail-row upi-amount-row">
              <span className="upi-label">Amount:</span>
              <span className="upi-value amount-highlight">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        <div className="upi-actions">
          {/* On mobile, this link can directly open the UPI app */}
          <a href={upiLink} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}>
            <i className="fa-solid fa-mobile-screen" /> Pay Now via App
          </a>
          {onClose && (
            <button className="btn btn-ghost" onClick={onClose} style={{ width: '100%', justifyContent: 'center' }}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
