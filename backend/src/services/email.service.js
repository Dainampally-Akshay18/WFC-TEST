import sgMail from '@sendgrid/mail';
import sendGridConfig from '../config/sendgrid.js';

sgMail.setApiKey(sendGridConfig.apiKey);

export const sendEmail = async (to, subject, html) => {
  try {
    const msg = {
      to,
      from: sendGridConfig.fromEmail,
      subject,
      html,
    };

    await sgMail.send(msg);
    console.log(`✅ Email sent to ${to}`);
    return true;
  } catch (error) {
    console.error('❌ Email service error:', error);
    throw error;
  }
};

export default sendEmail;
