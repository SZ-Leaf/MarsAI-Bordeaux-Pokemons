import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
   host: "sandbox.smtp.mailtrap.io",
   port: 587,
   auth: {
      user: "3382c07068f174",
      pass: "aaf4e1b3e25a71"
   }
});