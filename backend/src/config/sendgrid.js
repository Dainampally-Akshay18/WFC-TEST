const sendGridConfig = {
  apiKey: process.env.SENDGRID_API_KEY || '',
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@wfc.com',
};

export default sendGridConfig;
