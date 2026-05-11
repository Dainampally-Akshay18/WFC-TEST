import sgMail from '@sendgrid/mail';
import sendGridConfig from '../config/sendgrid.js';

/**
 * ============================================
 * EMAIL SERVICE
 * ============================================
 * 
 * Send emails via SendGrid
 */

// Initialize SendGrid
if (sendGridConfig.apiKey) {
  sgMail.setApiKey(sendGridConfig.apiKey);
}

/**
 * Send email using SendGrid
 * @param {String} to - Recipient email
 * @param {String} subject - Email subject
 * @param {String} html - HTML email content
 * @returns {Promise} SendGrid response
 */
export const sendEmail = async (to, subject, html) => {
  try {
    // Validate inputs
    if (!to || !subject || !html) {
      throw new Error('Missing required email fields: to, subject, html');
    }

    // Check if SendGrid is configured
    if (!sendGridConfig.apiKey) {
      console.warn('⚠️  SendGrid API key not configured. Email not sent to:', to);
      return {
        success: false,
        message: 'Email service not configured',
      };
    }

    const msg = {
      to,
      from: sendGridConfig.fromEmail,
      subject,
      html,
    };

    const response = await sgMail.send(msg);

    console.log(`✅ Email sent successfully to ${to}`);

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: response[0]?.messageId,
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
