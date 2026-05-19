// Lazy-load config to read environment variables after dotenv.config() is called
const getResendConfig = () => ({
  apiKey: process.env.RESEND_API_KEY || '',
  fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@wfc.com',
});

export default getResendConfig;
