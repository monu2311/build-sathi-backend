import nodemailer, { Transporter } from 'nodemailer';

import { env } from '../config/env';

const SUBJECT = 'Your BuildSathi verification code';

const buildHtml = (otp: string) => `
  <div style="font-family: Arial, sans-serif;">
    <h2>BuildSathi</h2>
    <p>Your verification code is:</p>
    <h1 style="letter-spacing: 8px;">${otp}</h1>
    <p>This OTP will expire in 10 minutes.</p>
  </div>
`;

const buildText = (otp: string) =>
  `Your BuildSathi verification code is ${otp}. It expires in 10 minutes.`;

// ---------------- SMTP ----------------
let transporter: Transporter | null = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (!env.smtpHost || !env.smtpUser || !env.smtpPass) {
    throw new Error(
      'SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required)',
    );
  }

  // transporter = nodemailer.createTransport({
  //   host:,
  //   port: env.smtpPort,
  //   auth: { user: env.smtpUser, pass: env.smtpPass },
  // });


  transporter = nodemailer.createTransport({
                host:  env.smtpHost,
                port: env.smtpPort,
                auth:{ user: env.smtpUser, pass: env.smtpPass },
  });


  return transporter;
};

const sendViaSmtp = async (email: string, otp: string) => {
  const info = await getTransporter().sendMail({
    from: env.smtpFrom,
    to: email,
    subject: SUBJECT,
    text: buildText(otp),
    html: buildHtml(otp),
  });

  return { provider: 'smtp', id: info.messageId };
};

// ---------------- Resend ----------------
const sendViaResend = async (email: string, otp: string) => {
  if (!env.resendApiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.resendFromEmail,
      to: [email],
      subject: SUBJECT,
      text: buildText(otp),
      html: buildHtml(otp),
    }),
  });

  const body = await response.text();

  if (!response.ok) {
    throw new Error(`Resend API error (${response.status}): ${body}`);
  }

  return { provider: 'resend', ...JSON.parse(body) };
};

// ---------------- Console (local only) ----------------
const sendViaConsole = async (email: string, otp: string) => {
  if (env.nodeEnv === 'production') {
    throw new Error('EMAIL_PROVIDER=console is not allowed in production');
  }

  console.log('\n=============================');
  console.log(`📧 [DEV OTP] to: ${email}`);
  console.log(`🔑 OTP: ${otp}`);
  console.log('=============================\n');

  return { provider: 'console' };
};

// ---------------- Public API (same signature as before) ----------------
export const sendOtpEmail = async (email: string, otp: string) => {
  switch (env.emailProvider) {
    case 'smtp':
      return sendViaSmtp(email, otp);
    case 'resend':
      return sendViaResend(email, otp);
    case 'console':
      return sendViaConsole(email, otp);
    default:
      throw new Error(`Unknown EMAIL_PROVIDER: ${env.emailProvider}`);
  }
};