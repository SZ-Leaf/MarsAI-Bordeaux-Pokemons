import { transporter } from "./mailer.config.js";

const sendInviteMail = async (email, token) => {
   const inviteLink = `${process.env.FRONTEND_URL}/register?token=${token}&email=${email}`;

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
   const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

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

// Email de confirmation inscription newsletter (double opt-in)
const sendNewsletterConfirmation = async (email, token) => {
   const baseUrl = process.env.NEWSLETTER_CONFIRM_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
   const confirmUrl = `${baseUrl}/newsletter/confirm?token=${encodeURIComponent(token)}`;

   await transporter.sendMail({
      from: '"Mars AI" <no-reply@marsai.com>',
      to: email,
      subject: "Confirmez votre inscription à la newsletter",
      html: `
         <h1>Bienvenue !</h1>
         <p>Merci de votre inscription à notre newsletter.</p>
         <p>Cliquez sur le lien ci-dessous pour confirmer votre inscription :</p>
         <a href="${confirmUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
            Confirmer mon inscription
         </a>
         <p style="color:#666;font-size:12px;margin-top:20px;">
            Si vous n'avez pas demandé cette inscription, ignorez cet email.
         </p>
      `
   });

   return true;
};

// Envoi massif newsletter par batch (100 emails par lot)
const sendNewsletterBulk = async (newsletter, subscribers) => {
   const BATCH_SIZE = 100;
   const results = { success: 0, failed: 0, errors: [] };

   for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const promises = batch.map(async (subscriber) => {
         try {
            const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;

            await transporter.sendMail({
               from: '"Mars AI" <no-reply@marsai.com>',
               to: subscriber.email,
               subject: newsletter.subject,
               html: `
                  ${newsletter.content}
                  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;">
                  <p style="font-size:12px;color:#666;text-align:center;">
                     <a href="${unsubscribeUrl}" style="color:#666;">Se désinscrire</a>
                  </p>
               `
            });

            results.success++;
         } catch (error) {
            console.error(`Error sending to ${subscriber.email}:`, error.message);
            results.failed++;
            results.errors.push({ email: subscriber.email, error: error.message });
         }
      });

      await Promise.all(promises);

      // Pause entre les lots pour éviter le rate limiting
      if (i + BATCH_SIZE < subscribers.length) {
         await new Promise(resolve => setTimeout(resolve, 1000));
      }
   }

   return results;
};

const sendReservationConfirmation = async (email, token) => {
   const confirmationLink = `http://localhost:3000/api/events/:id/reservation/confirm?token=${token}&email=${email}`;

   await transporter.sendMail({
      from: '"Mars AI" <no-reply@marsai.com>',
      to: email,
      subject: "Confirmation invitation",
      html: `
         <p>Confirm:</p>
         <a href="${confirmationLink}">${confirmationLink}</a>
      `
   });

   return true;
};


export { sendInviteMail, sendForgotPasswordMail, sendNewsletterConfirmation, sendNewsletterBulk, sendReservationConfirmation};
