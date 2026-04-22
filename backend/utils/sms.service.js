const twilio = require('twilio');

// Initialize Twilio client
const sendOrderConfirmationSMS = async (customerPhone, orderDetails) => {
  try {
    // Check if Twilio credentials are configured
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
      console.warn('Twilio credentials not configured. SMS not sent.');
      return { success: false, message: 'SMS service not configured' };
    }

    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    // Format phone number (ensure it has country code)
    let formattedPhone = customerPhone;
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = `+91${formattedPhone}`; // Assuming Indian numbers
    }

    // SMS message template
    const message = `Hi ${orderDetails.customerName}, your order for ${orderDetails.productName} (₹${orderDetails.totalAmount.toLocaleString('en-IN')}) has been placed successfully! Order ID: ${orderDetails.orderId}. It will be delivered soon. Thank you! - Gateway Computers`;

    // Send SMS
    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedPhone,
    });

    console.log(`SMS sent successfully to ${formattedPhone}. SID: ${result.sid}`);
    return { success: true, sid: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error.message);
    // Don't throw error - SMS failure should not break order flow
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderConfirmationSMS };
