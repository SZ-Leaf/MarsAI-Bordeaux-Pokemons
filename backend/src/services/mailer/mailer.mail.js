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
// language: 'en' | 'fr' — envoie la version anglaise si 'en'
const sendNewsletterConfirmation = async (email, token, language = 'fr') => {
   const baseUrl = process.env.NEWSLETTER_CONFIRM_BASE_URL || process.env.FRONTEND_URL || 'http://localhost:5173';
   const confirmUrl = `${baseUrl}/newsletter/confirm?token=${encodeURIComponent(token)}`;

   const isEn = language === 'en';

   const subject = isEn
      ? 'Confirm your newsletter subscription'
      : 'Confirmez votre inscription à la newsletter';

   const html = isEn
      ? `
         <h1>Welcome!</h1>
         <p>Thank you for subscribing to our newsletter.</p>
         <p>Click the link below to confirm your subscription:</p>
         <a href="${confirmUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
            Confirm my subscription
         </a>
         <p style="color:#666;font-size:12px;margin-top:20px;">
            If you did not request this subscription, please ignore this email.
         </p>
      `
      : `
         <h1>Bienvenue !</h1>
         <p>Merci de votre inscription à notre newsletter.</p>
         <p>Cliquez sur le lien ci-dessous pour confirmer votre inscription :</p>
         <a href="${confirmUrl}" style="display:inline-block;padding:10px 20px;background:#007bff;color:#fff;text-decoration:none;border-radius:5px;">
            Confirmer mon inscription
         </a>
         <p style="color:#666;font-size:12px;margin-top:20px;">
            Si vous n'avez pas demandé cette inscription, ignorez cet email.
         </p>
      `;

   await transporter.sendMail({
      from: '"Mars AI" <no-reply@marsai.com>',
      to: email,
      subject,
      html
   });

   return true;
};

// Envoi massif newsletter par batch (100 emails par lot)
// Utilise la langue de l'abonné : EN → subject_en/content_en (sinon fallback FR)
const sendNewsletterBulk = async (newsletter, subscribers) => {
   const BATCH_SIZE = 100;
   const results = { success: 0, failed: 0, errors: [] };

   for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
      const batch = subscribers.slice(i, i + BATCH_SIZE);

      const promises = batch.map(async (subscriber) => {
         try {
            const useEn = subscriber.language === 'en' && newsletter.subject_en && newsletter.content_en;
            const subject = useEn ? newsletter.subject_en : newsletter.subject;
            const content = useEn ? newsletter.content_en : newsletter.content;
            const unsubscribeLabel = useEn ? 'Unsubscribe' : 'Se désinscrire';

            const unsubscribeUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/newsletter/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribe_token)}`;

            await transporter.sendMail({
               from: '"Mars AI" <no-reply@marsai.com>',
               to: subscriber.email,
               subject,
               html: `
                  ${content}
                  <hr style="margin:30px 0;border:none;border-top:1px solid #ddd;">
                  <p style="font-size:12px;color:#666;text-align:center;">
                     <a href="${unsubscribeUrl}" style="color:#666;">${unsubscribeLabel}</a>
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

// Email de confirmation de soumission de film (envoyé au créateur)
const sendSubmissionConfirmation = async (creatorEmail, creatorFirstname, submissionTitle = '') => {
   const titleText = submissionTitle ? ` pour « ${submissionTitle} »` : '';

   await transporter.sendMail({
      from: '"Mars AI" <no-reply@marsai.com>',
      to: creatorEmail,
      subject: "Votre soumission a bien été reçue — Mars AI",
      html: `
         <h1>Confirmation de soumission</h1>
         <p>Bonjour ${creatorFirstname || 'Créateur'},</p>
         <p>Nous vous confirmons la bonne réception de votre soumission${titleText}.</p>
         <p>Votre film sera examiné par le jury du festival. Vous serez informé des suites données à votre candidature.</p>
         <p style="color:#666;font-size:12px;margin-top:24px;">
            Ceci est un message automatique, merci de ne pas y répondre.
         </p>
         <p style="color:#666;font-size:12px;">
            — L'équipe Mars AI
         </p>
      `
   });

   return true;
};

export { sendInviteMail, sendForgotPasswordMail, sendNewsletterConfirmation, sendNewsletterBulk, sendSubmissionConfirmation, sendReservationConfirmation };
