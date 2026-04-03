import type { NextApiRequest, NextApiResponse } from 'next';

interface EmailRequest {
  to: string;
  subject: string;
  templateType: 'booking-confirmation' | 'booking-reminder' | 'booking-cancelled' | 'custom';
  data?: {
    customerName?: string;
    bookingRef?: string;
    date?: string;
    time?: string;
    services?: string[];
    totalPrice?: number;
    message?: string;
    [key: string]: any;
  };
}

interface ApiResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * EMAIL API ENDPOINT
 * ==================
 * Sends emails using Resend or SendGrid
 * Set NEXT_PUBLIC_EMAIL_PROVIDER in .env to 'resend' or 'sendgrid'
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { to, subject, templateType, data }: EmailRequest = req.body;

    // Validate input
    if (!to || !subject || !templateType) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, subject, templateType',
      });
    }

    const provider = process.env.NEXT_PUBLIC_EMAIL_PROVIDER || 'resend';

    let messageId: string | undefined;

    if (provider === 'resend') {
      messageId = await sendViaResend({
        to,
        subject,
        templateType,
        data,
      });
    } else if (provider === 'sendgrid') {
      messageId = await sendViaSendGrid({
        to,
        subject,
        templateType,
        data,
      });
    } else {
      // Fallback: log to console (development)
      console.log('Email (simulated):', { to, subject, data });
      messageId = `sim_${Date.now()}`;
    }

    return res.status(200).json({
      success: true,
      messageId,
    });
  } catch (error: any) {
    console.error('Email API error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email',
    });
  }
}

/**
 * Send email via Resend
 * https://resend.com/
 */
async function sendViaResend({
  to,
  subject,
  templateType,
  data,
}: EmailRequest): Promise<string> {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const html = generateEmailTemplate(templateType, data);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'noreply@elegancenails.com',
      to,
      subject,
      html,
      replyTo: process.env.NEXT_PUBLIC_EMAIL_REPLY_TO || 'support@elegancenails.com',
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resend API error: ${error.message}`);
  }

  const result = await response.json();
  return result.id;
}

/**
 * Send email via SendGrid
 * https://sendgrid.com/
 */
async function sendViaSendGrid({
  to,
  subject,
  templateType,
  data,
}: EmailRequest): Promise<string> {
  const sendGridApiKey = process.env.SENDGRID_API_KEY;

  if (!sendGridApiKey) {
    throw new Error('SENDGRID_API_KEY not configured');
  }

  const html = generateEmailTemplate(templateType, data);

  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sendGridApiKey}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: to }],
          subject,
        },
      ],
      from: {
        email: process.env.NEXT_PUBLIC_EMAIL_FROM || 'noreply@elegancenails.com',
        name: 'Elegance Nails',
      },
      replyTo: {
        email: process.env.NEXT_PUBLIC_EMAIL_REPLY_TO || 'support@elegancenails.com',
      },
      content: [
        {
          type: 'text/html',
          value: html,
        },
      ],
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`SendGrid API error: ${error}`);
  }

  // SendGrid returns 202 with no body, generate ID
  return `sendgrid_${Date.now()}`;
}

/**
 * Generate HTML email template
 */
function generateEmailTemplate(
  templateType: string,
  data: any = {}
): string {
  const styles = `
    <style>
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        line-height: 1.6;
        color: #333;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        overflow: hidden;
      }
      .header {
        background-color: #E6B7A9;
        color: #FAF7F4;
        padding: 30px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
        font-family: 'Playfair Display', serif;
      }
      .content {
        padding: 30px;
      }
      .section {
        margin-bottom: 20px;
      }
      .label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 1px;
        color: #999;
        margin-bottom: 5px;
      }
      .detail-box {
        background-color: #FAF7F4;
        padding: 15px;
        border-radius: 6px;
        border-left: 4px solid #E6B7A9;
        margin: 15px 0;
      }
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .detail-row:last-child {
        margin-bottom: 0;
      }
      .detail-label {
        font-weight: 600;
        color: #1E1E1E;
      }
      .detail-value {
        color: #777777;
      }
      .button {
        display: inline-block;
        padding: 12px 30px;
        background-color: #E6B7A9;
        color: #FAF7F4;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        margin: 20px 0;
      }
      .footer {
        background-color: #F5F5F5;
        padding: 20px;
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #E0E0E0;
      }
      .social-link {
        display: inline-block;
        margin: 0 10px;
        color: #E6B7A9;
        text-decoration: none;
      }
    </style>
  `;

  const baseHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${styles}
    </head>
    <body>
      <div class="container">
  `;

  const footerHtml = `
      <div class="footer">
        <p>© 2024 Elegance Nails. All rights reserved.</p>
        <div>
          <a href="https://facebook.com/elegancenails" class="social-link">Facebook</a>
          <a href="https://instagram.com/elegancenails" class="social-link">Instagram</a>
          <a href="https://twitter.com/elegancenails" class="social-link">Twitter</a>
        </div>
        <p><a href="mailto:support@elegancenails.com" style="color: #E6B7A9; text-decoration: none;">support@elegancenails.com</a></p>
      </div>
      </div>
    </body>
    </html>
  `;

  let middleHtml = '';

  if (templateType === 'booking-confirmation') {
    middleHtml = `
      <div class="header">
        <h1>✨ Booking Confirmed!</h1>
        <p>Thank you for choosing Elegance Nails</p>
      </div>
      <div class="content">
        <p>Hi ${data.customerName || 'Guest'},</p>
        <p>Your appointment has been confirmed. Here are your booking details:</p>

        <div class="detail-box">
          <div class="label">Booking Reference</div>
          <div style="font-size: 18px; font-weight: bold; color: #E6B7A9; font-family: 'Courier New', monospace;">
            ${data.bookingRef || 'NAB-' + Date.now()}
          </div>
        </div>

        <div class="section">
          <div class="label">Date & Time</div>
          <div style="font-size: 16px; color: #1E1E1E; font-weight: 500;">
            ${data.date || 'TBA'} at ${data.time || 'TBA'}
          </div>
        </div>

        <div class="section">
          <div class="label">Services</div>
          <div style="color: #1E1E1E;">
            ${
              data.services && data.services.length > 0
                ? data.services.map((s: string) => `<div>• ${s}</div>`).join('')
                : '<div>Premium Nail Services</div>'
            }
          </div>
        </div>

        ${
          data.totalPrice
            ? `
          <div class="section">
            <div class="label">Total Amount</div>
            <div style="font-size: 20px; color: #E6B7A9; font-weight: bold;">
              $${parseFloat(data.totalPrice).toFixed(2)}
            </div>
          </div>
        `
            : ''
        }

        <div style="background-color: #FAF7F4; padding: 20px; border-radius: 6px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1E1E1E;">What's Next?</h3>
          <ol style="margin: 10px 0; padding-left: 20px; color: #777;">
            <li>Please arrive 10 minutes early</li>
            <li>Bring your booking reference</li>
            <li>We'll send you a reminder 24 hours before</li>
            <li>Any changes? Just message us on WhatsApp</li>
          </ol>
        </div>

        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://elegancenails.com'}/bookings" class="button">View Your Booking</a>

        <p style="color: #999; font-size: 14px;">
          Questions? Contact us at <a href="tel:+1234567890" style="color: #E6B7A9; text-decoration: none;">+1 (234) 567-8900</a>
          or message us on <a href="https://wa.me/1234567890" style="color: #E6B7A9; text-decoration: none;">WhatsApp</a>
        </p>
      </div>
    `;
  } else if (templateType === 'booking-reminder') {
    middleHtml = `
      <div class="header">
        <h1>📅 Reminder: Your Appointment Tomorrow</h1>
      </div>
      <div class="content">
        <p>Hi ${data.customerName || 'Guest'},</p>
        <p>We're excited to see you tomorrow!</p>

        <div class="detail-box">
          <div class="detail-row">
            <span class="detail-label">Date & Time:</span>
            <span class="detail-value">${data.date} at ${data.time}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Location:</span>
            <span class="detail-value">123 Elegance Street, Beautiful City, BC 12345</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Duration:</span>
            <span class="detail-value">${data.duration || '45-60 minutes'}</span>
          </div>
        </div>

        <p>Please arrive 10 minutes early. If you need to reschedule, let us know as soon as possible.</p>

        <a href="https://wa.me/1234567890" class="button">Message us on WhatsApp</a>
      </div>
    `;
  } else if (templateType === 'booking-cancelled') {
    middleHtml = `
      <div class="header">
        <h1>❌ Booking Cancelled</h1>
      </div>
      <div class="content">
        <p>Hi ${data.customerName || 'Guest'},</p>
        <p>Your booking has been cancelled:</p>

        <div class="detail-box">
          <div class="detail-row">
            <span class="detail-label">Booking Reference:</span>
            <span class="detail-value">${data.bookingRef}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Original Date:</span>
            <span class="detail-value">${data.date}</span>
          </div>
        </div>

        <p>${data.message || 'If you would like to rebook, please visit our website or contact us.'}</p>

        <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://elegancenails.com'}/booking" class="button">Book Again</a>
      </div>
    `;
  } else {
    // Custom template
    middleHtml = `
      <div class="header">
        <h1>${data.title || 'Message from Elegance Nails'}</h1>
      </div>
      <div class="content">
        <p>${data.message || 'Hello,'}</p>
      </div>
    `;
  }

  return baseHtml + middleHtml + footerHtml;
}

/**
 * USAGE EXAMPLES
 * ==============
 *
 * // Send booking confirmation
 * fetch('/api/send-email', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     to: 'customer@example.com',
 *     subject: 'Booking Confirmation - Elegance Nails',
 *     templateType: 'booking-confirmation',
 *     data: {
 *       customerName: 'Sarah',
 *       bookingRef: 'NAB-2024-001234',
 *       date: 'March 31, 2024',
 *       time: '2:00 PM',
 *       services: ['Gel Manicure', 'Nail Art'],
 *       totalPrice: 120,
 *     },
 *   }),
 * })
 *
 * // Send appointment reminder
 * fetch('/api/send-email', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     to: 'customer@example.com',
 *     subject: 'Reminder: Your Appointment Tomorrow',
 *     templateType: 'booking-reminder',
 *     data: {
 *       customerName: 'Sarah',
 *       date: 'March 31, 2024',
 *       time: '2:00 PM',
 *     },
 *   }),
 * })
 */
