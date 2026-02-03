import crypto from "crypto";
import db from "../../config/db_pool.js";


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


export { generateInviteToken, verifyInviteToken, generateForgotPasswordToken, verifyForgotPasswordToken };