const nodemailer = require('nodemailer');

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App Password (not regular password)
    },
  });
};

// Send order notification email to shop owner
const sendOrderNotificationEmail = async (orderDetails) => {
  try {
    console.log('📧 Attempting to send order notification email...');
    console.log('Email User:', process.env.EMAIL_USER);
    
    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.warn('❌ Email credentials not configured. Email not sent.');
      console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
      console.log('EMAIL_PASSWORD exists:', !!process.env.EMAIL_PASSWORD);
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = createTransporter();
    console.log('✅ Transporter created successfully');

    const mailOptions = {
      from: `"Gateway Computers" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to shop owner's email
      subject: `🎉 New Order Received - ₹${orderDetails.totalAmount.toLocaleString('en-IN')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
            <h1 style="margin: 0; font-size: 28px;">🎉 New Order Received!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Gateway Computers - Order Notification</p>
          </div>

          <div style="background: #f9f9f9; padding: 25px; border-radius: 10px; margin-top: 20px;">
            <h2 style="color: #333; margin-top: 0;">Order Details</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">📦 Product:</td>
                  <td style="padding: 10px 0; color: #333;">${orderDetails.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">🔢 Quantity:</td>
                  <td style="padding: 10px 0; color: #333;">${orderDetails.quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">💰 Product Price:</td>
                  <td style="padding: 10px 0; color: #333;">₹${orderDetails.productPrice.toLocaleString('en-IN')}</td>
                </tr>
                <tr style="border-top: 2px solid #667eea;">
                  <td style="padding: 15px 0 10px 0; color: #667eea; font-weight: bold; font-size: 18px;">Total Amount:</td>
                  <td style="padding: 15px 0 10px 0; color: #667eea; font-weight: bold; font-size: 18px;">₹${orderDetails.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </table>
            </div>

            <h2 style="color: #333;">Customer Information</h2>
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">👤 Name:</td>
                  <td style="padding: 10px 0; color: #333;">${orderDetails.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">📞 Phone:</td>
                  <td style="padding: 10px 0; color: #333;">
                    <a href="tel:+91${orderDetails.customerPhone}" style="color: #667eea; text-decoration: none;">
                      ${orderDetails.customerPhone}
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold; vertical-align: top;">📍 Address:</td>
                  <td style="padding: 10px 0; color: #333;">${orderDetails.customerAddress}</td>
                </tr>
              </table>
            </div>

            <h2 style="color: #333; margin-top: 25px;">Payment Information</h2>
            <div style="background: #e8f5e9; padding: 20px; border-radius: 8px; border-left: 4px solid #4caf50;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">✅ Payment Status:</td>
                  <td style="padding: 10px 0; color: #4caf50; font-weight: bold;">Completed</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">💳 Payment Method:</td>
                  <td style="padding: 10px 0; color: #333;">Razorpay (UPI/Card/NetBanking)</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">🆔 Payment ID:</td>
                  <td style="padding: 10px 0; color: #333; font-family: monospace;">${orderDetails.razorpay_payment_id}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #666; font-weight: bold;">📋 Order ID:</td>
                  <td style="padding: 10px 0; color: #333; font-family: monospace;">${orderDetails.orderId}</td>
                </tr>
              </table>
            </div>

            <div style="margin-top: 25px; padding: 20px; background: #fff3e0; border-radius: 8px; border-left: 4px solid #ff9800;">
              <p style="margin: 0; color: #666; font-size: 14px;">
                <strong>⏰ Order Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
              </p>
            </div>
          </div>

          <div style="margin-top: 25px; padding: 20px; background: #f5f5f5; border-radius: 8px; text-align: center;">
            <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
              <strong>Next Steps:</strong>
            </p>
            <p style="margin: 0; color: #333; font-size: 14px;">
              1. Contact customer to confirm order<br>
              2. Arrange product for delivery<br>
              3. Update order status in admin panel
            </p>
          </div>

          <div style="margin-top: 25px; text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 0;">This is an automated notification from Gateway Computers</p>
            <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} Gateway Computers. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);

    console.log(`✅ Order notification email sent successfully to ${process.env.EMAIL_USER}`);
    console.log(`Email Message ID: ${result.messageId}`);
    console.log('Email Response:', result.response);
    
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
    console.error('Full error:', error);
    // Don't throw error - email failure should not break order flow
    return { success: false, error: error.message };
  }
};

// Send order confirmation email to customer (optional - for future use)
const sendCustomerConfirmationEmail = async (customerEmail, orderDetails) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return { success: false, message: 'Email service not configured' };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Gateway Computers" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `✅ Order Confirmed - ₹${orderDetails.totalAmount.toLocaleString('en-IN')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; color: white; text-align: center;">
            <h1 style="margin: 0;">✅ Order Confirmed!</h1>
            <p style="margin: 10px 0 0 0;">Thank you for your purchase</p>
          </div>

          <div style="background: #f9f9f9; padding: 25px; border-radius: 10px; margin-top: 20px;">
            <p>Hi <strong>${orderDetails.customerName}</strong>,</p>
            <p>Your order has been placed successfully and will be delivered soon!</p>

            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #333;">Order Summary</h3>
              <p><strong>Product:</strong> ${orderDetails.productName}</p>
              <p><strong>Quantity:</strong> ${orderDetails.quantity}</p>
              <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount.toLocaleString('en-IN')}</p>
              <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
            </div>

            <p>We'll contact you soon with delivery details.</p>
            <p><strong>Need help?</strong> Contact us at +91 9591064356</p>
          </div>

          <div style="margin-top: 25px; text-align: center; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Gateway Computers</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending customer email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOrderNotificationEmail, sendCustomerConfirmationEmail };
