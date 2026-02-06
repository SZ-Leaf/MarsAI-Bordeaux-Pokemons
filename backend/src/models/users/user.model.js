import db from "../../config/db_pool.js";
import { generateInviteToken, verifyInviteToken } from "../../services/mailer/mailer.tokens.js";

const getUsers = async () => {
   try {
      const [rows] = await db.pool.execute("SELECT id, firstname, lastname, email, role_id, last_login, created_at FROM users");
      return rows;
   } catch (error) {
      console.error("Error getting users:", error.message);
      throw new Error(error.message);
   }
};

const getUserById = async (id) => {
   try {
      const [rows] = await db.pool.execute("SELECT firstname, lastname, email, role_id, last_login, created_at FROM users WHERE id = ?", [id]);
      return rows[0];
   } catch (error) {
      console.error("Error getting user by id:", error);
      throw new Error(error.message);
   }
};

const getUserCredentials = async (email) => {
   try {
      const [rows] = await db.pool.execute("SELECT id, email, password_hash, role_id FROM users WHERE email = ?", [email]);
      return rows[0];
   } catch (error) {
      console.error("Error getting user credentials:", error);
      throw new Error(error.message);
   }
};

const loginUser = async (email) => {
   let connection;
   try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();
      await connection.execute("UPDATE users SET last_login = NOW() WHERE email = ?", [email]);
      const [rows] = await connection.execute("SELECT id, firstname, lastname, email, last_login, created_at, role_id FROM users WHERE email = ?", [email]);

      await connection.commit();
      return rows[0];
   } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error logging in user:", error);
      throw new Error(error.message);
   } finally {
      if (connection) await connection.release();
   }
};

const inviteUser = async (email, role_id) => {
   let connection;
   try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();

      // Check if invite already exists for this email
      const [existingInvites] = await connection.execute(
         "SELECT * FROM invites WHERE email = ? FOR UPDATE",
         [email]
      );

      // Check if user already exists
      const [existingUsers] = await connection.execute(
         "SELECT id FROM users WHERE email = ?",
         [email]
      );

      if (existingUsers.length > 0) {
         await connection.rollback();
         throw new Error("User with this email already exists");
      }

      let token = "";
      while (true) {
         token = generateInviteToken();
         const isUnique = await verifyInviteToken(token);
         if (isUnique) break;
      }

      if (existingInvites.length > 0) {
         // Check if invite was already used (registered IS NOT NULL)
         const existingInvite = existingInvites[0];
         
         if (existingInvite.registered !== null) {
            await connection.rollback();
            throw new Error("User has already registered with this invitation");
         }

         // Update existing invite with new token, role_id, and updated_at
         await connection.execute(
            "UPDATE invites SET token = ?, role_id = ?, updated_at = NOW() WHERE email = ?",
            [token, role_id, email]
         );

         await connection.commit();
         return { success: true, token, updated: true };
      } else {
         // Create new invite
         const [result] = await connection.execute(
            "INSERT INTO invites (email, role_id, token) VALUES (?, ?, ?)",
            [email, role_id, token]
         );
         await connection.commit();
         return { success: true, userId: result.insertId, token, updated: false };
      }
   } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error inviting user:", error);
      throw error;
   } finally {
      if (connection) await connection.release();
   }
};

const registerUser = async (token, user) => {
   let connection;

   try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();

      const [invites] = await connection.execute(
         "SELECT * FROM invites WHERE token = ? FOR UPDATE",
         [token]
      );

      if (invites.length === 0 || invites[0].registered !== null) {
         await connection.rollback();
         return { success: false, error: "Invalid link or email already registered." };
      }

      const invite = invites[0];

      const [result] = await connection.execute(
         `INSERT INTO users 
            (firstname, lastname, email, password_hash, role_id)
          VALUES (?, ?, ?, ?, ?)`,
         [
            user.firstname,
            user.lastname,
            invite.email,
            user.password_hash,
            invite.role_id
         ]
      );

      await connection.execute(
         "UPDATE invites SET registered = NOW() WHERE token = ?",
         [token]
      );

      await connection.commit();

      return {
         success: true,
         userId: result.insertId,
         email: invite.email
      };

   } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error registering user:", error);
      throw error;
   } finally {
      if (connection) await connection.release();
   }
};

const deleteUser = async (id) => {
   let connection;
   try {
      const [rows] = await db.pool.execute("SELECT email FROM users WHERE id = ?", [id]);
      if (rows.length === 0) return { success: false, error: "User not found" };
      
      const email = rows[0].email;
      connection = await db.pool.getConnection();
      await connection.beginTransaction();
      
      await connection.execute("DELETE FROM users WHERE id = ?", [id]);
      await connection.execute("DELETE FROM invites WHERE email = ?", [email]);
      await connection.execute("DELETE FROM reset_password_tokens WHERE user_id = ?", [id]);
      await connection.commit();
      
      return { success: true };
   } catch (error) {
      if (connection) await connection.rollback();  // ✅ Check needed
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
   } finally {
      if (connection) await connection.release();
   }
};

const updateUser = async (id, user) => {
   try {
      // update user dynamic fields and values array
      const fields = [];
      const values = [];
   
      if (user.firstname !== undefined) {
         fields.push("firstname = ?");
         values.push(user.firstname);
      }
      if (user.lastname !== undefined) {
         fields.push("lastname = ?");
         values.push(user.lastname);
      }
   
      if (fields.length === 0) {
         // no fields to update
         return { affectedRows: 0 };
      }
   
      const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;
      values.push(id);
   
      const [result] = await db.pool.execute(sql, values);
      return result;
 
   } catch (error) {
     console.error("Error updating user:", error);
     throw new Error(error.message);
   }
};
 
const updateUserPassword = async (email, password_hash) => {
   try {
      const [result] = await db.pool.execute("UPDATE users SET password_hash = ? WHERE email = ?", [password_hash, email]);
      return result;
   } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error(error.message);
   }
};

const resetUserPassword = async (token, password_hash) => {
   let connection;
   try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();

      const [rows] = await connection.execute(
         `SELECT user_id
          FROM reset_password_tokens
          WHERE token = ?
            AND used_at IS NULL
            AND expires_at > NOW()
          FOR UPDATE`,
         [token]
      );

      if (rows.length === 0) {
         throw new Error("Invalid or expired token");
      }

      const user_id = rows[0].user_id;

      const [userResult] = await connection.execute(
         "UPDATE users SET password_hash = ? WHERE id = ?",
         [password_hash, user_id]
      );

      if (userResult.affectedRows === 0) {
         throw new Error("User not found");
      }

      const [tokenResult] = await connection.execute(
         "UPDATE reset_password_tokens SET used_at = NOW() WHERE token = ? AND used_at IS NULL",
         [token]
      );

      if (tokenResult.affectedRows === 0) {
         throw new Error("Token already used");
      }
      const [userRows] = await connection.execute("SELECT email FROM users WHERE id = ?", [user_id]);
      await connection.commit();
      return { user_email: userRows[0].email };

   } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error resetting user password:", error);
      throw error;
   } finally {
      if (connection) await connection.release();
   }
};

const changeUserRole = async (id, role_id) => {
   try {
      const [result] = await db.pool.execute("UPDATE users SET role_id = ? WHERE id = ?", [role_id, id]);
      return result;
   } catch (error) {
      console.error("Error changing user role:", error);
      throw new Error(error.message);
   }
};

const deleteInvite = async (email) => {
   let connection;
   try {
      connection = await db.pool.getConnection();
      await connection.beginTransaction();

      // Use FOR UPDATE to lock the row and prevent race conditions
      const [rows] = await connection.execute(
         "SELECT * FROM invites WHERE email = ? AND registered IS NULL FOR UPDATE",
         [email]
      );

      if (rows.length === 0) {
         await connection.rollback();
         throw new Error("Invite not found");
      }

      // Include registered IS NULL in DELETE for extra safety
      const [result] = await connection.execute(
         "DELETE FROM invites WHERE email = ? AND registered IS NULL",
         [email]
      );

      if (result.affectedRows === 0) {
         await connection.rollback();
         throw new Error("Invite not found");
      }

      await connection.commit();
      return { success: true, email: email };
   } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error deleting invite:", error);
      throw error;
   } finally {
      if (connection) await connection.release();
   }
};

const getWaitingInvites = async () => {
   try {
      const [rows] = await db.pool.execute("SELECT * FROM invites WHERE registered IS NULL ORDER BY created_at DESC");
      return rows;
   } catch (error) {
      console.error("Error getting waiting invites:", error);
      throw new Error(error.message);
   }
};

export { getUsers, getUserById, inviteUser, registerUser, deleteUser, getUserCredentials, loginUser, updateUser, updateUserPassword, changeUserRole, resetUserPassword, deleteInvite, getWaitingInvites };