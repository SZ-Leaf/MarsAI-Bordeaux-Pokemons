import { transporter } from "./mailer_config.js";

const sendInviteMail = async (email, token) => {
   const inviteLink = `http://localhost:3000/api/auth/register?token=${token}`;

   await transporter.sendMail({
      from: '"Mars AI" <no-reply@marsai.com>',
      to: email,
      subject: "You're invited!",
      html: `
         <p>You have been invited. Click the link below to create your account:</p>
         <a href="${inviteLink}">${inviteLink}</a>
      `
   });

   return true;
};

const sendForgotPasswordMail = async (email, token) => {
   const resetPasswordLink = `http://localhost:3000/api/auth/reset-password?token=${token}`;

   await transporter.sendMail({
      from: '"Mars AI" <no-reply@marsai.com>',
      to: email,
      subject: "Forgot your password?",
      html: `
         <p>Click the link below to reset your password. This link will expire in 2 hours.</p>
         <p>If you did not request a password reset, please ignore this email.</p>
         <a href="${resetPasswordLink}">${resetPasswordLink}</a>
      `
   });

   return true;
};


export { sendInviteMail, sendForgotPasswordMail };