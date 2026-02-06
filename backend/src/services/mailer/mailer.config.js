import nodemailer from "nodemailer";

// Transport Mailtrap (invitations, reset password, newsletter)
export const transporter = nodemailer.createTransport({
   host: process.env.MAILTRAP_HOST,
   port: parseInt(process.env.MAILTRAP_PORT),
   auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
   }
});