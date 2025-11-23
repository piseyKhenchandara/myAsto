import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
});

export const verifyConnection = async () => {
  try {
    await transporter.verify();
    console.log(' Email service is ready');
    return true;
  } catch (error) {
    console.error(' Email service connection failed:', error);
    return false;
  }
};
