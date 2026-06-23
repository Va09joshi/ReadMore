import nodemailer from 'nodemailer';
import { ApiError } from './ApiError.js';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT == 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Pool and other settings to improve deliverability
      pool: true,
      maxConnections: 1,
      maxMessages: 10,
    });

    const mailOptions = {
      from: `"ReadMore Media" <${process.env.FROM_EMAIL}>`,
      replyTo: process.env.FROM_EMAIL,
      to,
      subject,
      text,
      html,
      // Adding headers can help prevent emails from being flagged as spam
      headers: {
        'X-Priority': '1 (Highest)',
        'X-Mailer': 'Nodemailer',
        'Importance': 'High',
      },
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error('Email sending error:', error);
    throw new ApiError(500, 'Failed to send email');
  }
};
