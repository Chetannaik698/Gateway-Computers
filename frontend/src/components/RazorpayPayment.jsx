import { useState } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';
import { getWhatsAppLink } from '../data/data';
import './RazorpayPayment.css';

export default function RazorpayPayment({ 
  amount, 
  product, 
  customerDetails, 
  onSuccess, 
  onClose 
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Step 1: Create Razorpay order on backend
      const orderResponse = await api.post('/razorpay/create-order', {
        amount: amount,
        product_name: product?.name || 'Product Purchase'
      });

      if (!orderResponse.data.success) {
        toast.error('Failed to create payment order');
        setIsProcessing(false);
        return;
      }

      const { orderId, amount: razorpayAmount, currency, key } = orderResponse.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: key,
        amount: razorpayAmount,
        currency: currency,
        name: 'Gateway Computers',
        description: product?.name || 'Product Purchase',
        order_id: orderId,
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await api.post('/razorpay/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verifyResponse.data.success) {
              // Step 4: Create order in database
              const orderData = {
                product: product._id,
                customerName: customerDetails.name,
                customerPhone: customerDetails.phone,
                customerAddress: customerDetails.address,
                quantity: customerDetails.quantity,
                paymentStatus: 'completed',
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };

              const createOrderResponse = await api.post('/orders', orderData);

              if (createOrderResponse.data.success) {
                // Show success message to customer first
                toast.success('✅ Payment Successful! Your order has been placed.');

                // Step 5: Auto-send order details to shop owner via WhatsApp
                const waMsg = `🎉 *New Order Received!*\n\n📦 *Product:* ${product.name}\n🔢 *Quantity:* ${customerDetails.quantity}\n💰 *Amount:* ₹${amount.toLocaleString('en-IN')}\n\n👤 *Customer Details:*\nName: ${customerDetails.name}\nPhone: ${customerDetails.phone}\nAddress: ${customerDetails.address}\n\n✅ *Payment:* Completed via Razorpay\n🆔 *Payment ID:* ${response.razorpay_payment_id}`;
                
                // Open WhatsApp immediately with pre-filled message
                window.open(getWhatsAppLink(waMsg), '_blank');

                // Call success callback
                if (onSuccess) {
                  onSuccess(createOrderResponse.data.order);
                }

                // Close modal after showing success
                setTimeout(() => {
                  if (onClose) {
                    onClose();
                  }
                }, 1500);
              }
            } else {
              toast.error('❌ Payment verification failed');
            }
          } catch (error) {
            console.error('Error in payment handler:', error);
            toast.error(error.response?.data?.message || 'Failed to process payment');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerDetails.name,
          contact: customerDetails.phone,
        },
        theme: {
          color: '#FF6B00', // Your brand color
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

      // Step 3: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Error initiating payment:', error);
      toast.error(error.response?.data?.message || 'Failed to initiate payment');
      setIsProcessing(false);
    }
  };

  return (
    <div className="razorpay-payment-container">
      <div className="payment-info-card">
        <h3>Complete Your Payment</h3>
        <div className="payment-details">
          <div className="detail-row">
            <span className="detail-label">Product:</span>
            <span className="detail-value">{product?.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Quantity:</span>
            <span className="detail-value">{customerDetails?.quantity}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value amount">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="btn btn-primary btn-lg"
          style={{ width: '100%', justifyContent: 'center', marginTop: '20px' }}
        >
          {isProcessing ? (
            <>
              <i className="fa-solid fa-spinner fa-spin" /> Processing...
            </>
          ) : (
            <>
              <i className="fa-solid fa-credit-card" /> Pay Now
            </>
          )}
        </button>

        <p style={{ 
          textAlign: 'center', 
          marginTop: '16px', 
          fontSize: '13px', 
          color: 'var(--text-muted)' 
        }}>
          Secure payment via Razorpay (UPI, Cards, NetBanking, Wallets)
        </p>
      </div>
    </div>
  );
}
