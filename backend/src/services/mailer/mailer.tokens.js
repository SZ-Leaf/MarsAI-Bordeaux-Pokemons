import crypto from "crypto";
import db from "../../config/db_pool.js";
import { signToken, verifyToken } from "../jwt/jwt.token.js";


const generateInviteToken = (length = 32) => {
   return crypto.randomBytes(length).toString("hex");
};

const verifyInviteToken = async (token) => {
   try {
      const [rows] = await db.pool.execute("SELECT * FROM invites WHERE token = ?", [token]);

      return rows.length === 0; // token does not exist, can be used to create a new invite
   } catch (error) {
      console.error("Error verifying invite token:", error);
      throw new Error(error.message);
   }
}

const generateForgotPasswordToken = async (user_id, length = 32) => {
   let connection;
   try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();

      // invalidate existing token
      await connection.execute("UPDATE reset_password_tokens SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL", [user_id]);


      // generate new token
      const token = crypto.randomBytes(length).toString("hex");
      const expires_at = new Date(Date.now() + 1000 * 60 * 60 * 2); // 2 hours

      const [result] = await connection.execute("INSERT INTO reset_password_tokens (user_id, token, expires_at) VALUES (?, ?, ?)", [user_id, token, expires_at]);

      await connection.commit();
      return { token };

   } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error generating reset password token:", error);
      throw new Error(error.message);
   } finally {
      if (connection) await connection.release();
   }
}

const verifyForgotPasswordToken = async (token) => {
   try {
      const [rows] = await db.pool.execute(
         `SELECT user_id FROM reset_password_tokens WHERE token = ? AND used_at IS NULL AND expires_at > NOW()`,
         [token]
      );

      if (rows.length === 0) {
         throw new Error("Invalid or expired token");
      }

      return rows[0]; // contains user_id

   } catch (error) {
      console.error("Error verifying reset password token:", error);
      throw error;
   }
};

// Token de confirmation newsletter (JWT avec email, expire 24h)
const generateNewsletterConfirmToken = (email) => {
   return signToken({ email, type: "newsletter_confirm" });
};

// Vérifie le JWT et retourne l'email
const verifyNewsletterConfirmToken = (token) => {
   try {
      const decoded = verifyToken(token);

      if (decoded.type !== "newsletter_confirm") {
         throw new Error("Invalid token type");
      }

      return decoded.email;
   } catch (error) {
      throw new Error("Token invalide ou expiré");
   }
};

// Token de désinscription (crypto permanent, stocké en BDD)
const generateNewsletterUnsubscribeToken = () => {
   return crypto.randomBytes(32).toString("hex");
};

// Vérifie le token en BDD et retourne l'email
const verifyNewsletterUnsubscribeToken = async (token) => {
   try {
      const [rows] = await db.pool.execute(
         "SELECT email FROM newsletter_listings WHERE unsubscribe_token = ?",
         [token]
      );

      if (rows.length === 0) {
         throw new Error("Invalid token");
      }

      return rows[0].email;
   } catch (error) {
      console.error("Error verifying newsletter unsubscribe token:", error);
      throw error;
   }
};

const generateReservationConfirmToken = (reservationId, email) => {
  return signToken({ reservationId, email });
};


const verifyReservationConfirmToken = (token) => {
  try {
     const decoded = verifyToken(token);

     return decoded;
  } catch (error) {
     throw new Error("Token invalide ou expiré");
  }
};


export {
   generateInviteToken,
   verifyInviteToken,
   generateForgotPasswordToken,
   verifyForgotPasswordToken,
   generateNewsletterConfirmToken,
   verifyNewsletterConfirmToken,
   generateNewsletterUnsubscribeToken,
   verifyNewsletterUnsubscribeToken,
   generateReservationConfirmToken,
   verifyReservationConfirmToken
};
