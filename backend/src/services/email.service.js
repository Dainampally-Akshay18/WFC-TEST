import { Resend } from 'resend';
import getResendConfig from '../config/sendgrid.js';

/**
 * ============================================
 * EMAIL SERVICE
 * ============================================
 * 
 * Send emails via Resend
 */

// Lazy-load Resend to allow environment variables to be loaded first
let resend = null;

const getResendClient = () => {
  if (!resend) {
    const resendConfig = getResendConfig();
    
    if (!resendConfig.apiKey) {
      throw new Error('❌ CRITICAL: Resend API key is NOT set! Add RESEND_API_KEY to .env');
    }
    resend = new Resend(resendConfig.apiKey);
    console.log('✅ Resend initialized with API key');
  }
  return resend;
};

/**
 * Send email using Resend
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} html - HTML email content
 * @returns {Promise} Resend response
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Validate inputs
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html');
    }

    // Get Resend client (lazy load)
    const resendClient = getResendClient();
    const resendConfig = getResendConfig();

    const response = await resendClient.emails.send({
      from: resendConfig.fromEmail,
      to,
      subject,
      html,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log(`✅ Email sent successfully to ${to}`);

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: response.data?.id,
    };
  } catch (error) {
    console.error('❌ Email service error:', error.message);

    // Don't throw error, just log it - email failure shouldn't break the flow
    return {
      success: false,
      message: `Email service error: ${error.message}`,
    };
  }
};

/**
 * Send password reset email
 * @param {String} to - User email
 * @param {String} resetLink - Password reset link
 * @returns {Promise}
 */
export const sendPasswordResetEmail = async (to, resetLink) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Password Reset Request</h2>
      <p>You requested a password reset for your account.</p>
      <p>Click the button below to reset your password:</p>
      <p>
        <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p>${resetLink}</p>
      <p><strong>This link expires in 15 minutes.</strong></p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, 'Password Reset Request', html);
};

/**
 * Send account approval email
 * @param {String} to - User email
 * @param {String} userName - User name
 * @returns {Promise}
 */
export const sendApprovalEmail = async (to, userName) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Account Approved</h2>
      <p>Hi ${userName},</p>
      <p>Your account has been approved! You can now login and start using the application.</p>
      <p>
        <a href="${process.env.FRONTEND_URL}" style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
          Go to App
        </a>
      </p>
      <hr />
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, 'Account Approved', html);
};

/**
 * Send account rejection email
 * @param {String} to - User email
 * @param {String} userName - User name
 * @param {String} reason - Rejection reason
 * @returns {Promise}
 */
export const sendRejectionEmail = async (to, userName, reason = null) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2>Application Reviewed</h2>
      <p>Hi ${userName},</p>
      <p>We regret to inform you that your account application has been rejected.</p>
      ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
      <p>If you believe this is in error, please contact support.</p>
      <hr />
      <p style="color: #666; font-size: 12px;">This is an automated email. Please do not reply.</p>
    </div>
  `;

  return sendEmail(to, 'Application Status', html);
};

export default sendEmail;
