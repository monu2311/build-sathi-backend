import { env } from '../config/env';

export const sendOtpEmail = async (
  email: string,
  otp: string,
) => {
  if (!env.resendApiKey) {
    console.error('❌ RESEND_API_KEY is missing');
    throw new Error('RESEND_API_KEY is not configured');
  }

  console.log('📧 Sending OTP email...');
  console.log('To:', email);
  console.log('From:', env.resendFromEmail);
  console.log(
    'API Key loaded:',
    `${env.resendApiKey.slice(0, 6)}...`,
  );

  const response = await fetch(
    'https://api.resend.com/emails',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.resendFromEmail,
        to: [email],
        subject: 'Your BuildSathi verification code',
        html: `
          <div style="font-family: Arial, sans-serif;">
            <h2>BuildSathi</h2>
            <p>Your verification code is:</p>

            <h1 style="letter-spacing: 8px;">
              ${otp}
            </h1>

            <p>This OTP will expire in 10 minutes.</p>
          </div>
        `,
      }),
    },
  );

  const responseText = await response.text();

  console.log('📨 Resend status:', response.status);
  console.log('📨 Resend response:', responseText);

  if (!response.ok) {
    throw new Error(
      `Resend API error (${response.status}): ${responseText}`,
    );
  }

  return JSON.parse(responseText);
};