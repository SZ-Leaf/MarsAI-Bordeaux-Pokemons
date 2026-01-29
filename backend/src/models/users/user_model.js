import db from "../../config/db_pool.js";
import { generateInviteToken, verifyInviteToken } from "../../services/mailer/mailer_tokens.js";

const getUsers = async () => {
   try {
      const [rows] = await db.pool.execute("SELECT firstname, lastname, email, role_id, last_login, created_at FROM users");
      return rows;
   } catch (error) {
      console.error("Error getting users:", error);
      throw new Error(error.message);
   }
}

const getUserById = async (id) => {
   try {
      const [rows] = await db.pool.execute("SELECT firstname, lastname, email, role_id, last_login, created_at FROM users WHERE id = ?", [id]);
      return rows[0];
   } catch (error) {
      console.error("Error getting user by id:", error);
      throw new Error(error.message);
   }
}

const getUserCredentials = async (email) => {
   try {
      const [rows] = await db.pool.execute("SELECT id, email, password_hash, role_id FROM users WHERE email = ?", [email]);
      return rows[0];
   } catch (error) {
      console.error("Error getting user credentials:", error);
      throw new Error(error.message);
   }
}

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
      await connection.rollback();
      console.error("Error logging in user:", error);
      throw new Error(error.message);
   } finally {
      if (connection) await connection.release();
   }
}

const inviteUser = async (email, role_id) => {
   try {

      let token = "";
      while (true) {
         token = generateInviteToken();
         const isUnique = await verifyInviteToken(token);
         if (isUnique) break;
      }

      const [result] = await db.pool.execute("INSERT INTO invites (email, role_id, token) VALUES (?, ?, ?)", [email, role_id, token]);
      return { success: true, userId: result.insertId, token };
   } catch (error) {
      console.error("Error inviting user:", error);
      throw new Error(error.message);
   }
}

const registerUser = async (token, user) => {
   let connection;
   try {
      const [invite] = await db.pool.execute("SELECT * FROM invites WHERE token = ?", [token]);
      if (invite.length === 0 || invite[0].registered) {
         return { success: false, error: "Invalid or already registered." };
      }
      connection = await db.pool.getConnection();
      await connection.beginTransaction();
      try {
         const [result] = await connection.execute("INSERT INTO users (firstname, lastname, email, password_hash, role_id) VALUES (?, ?, ?, ?, ?)", [user.firstname, user.lastname, invite[0].email, user.password_hash, invite[0].role_id]);
         await connection.execute("UPDATE invites SET registered = TRUE WHERE token = ?", [token]);
         await connection.commit();
         return { success: true, userId: result.insertId, email: invite[0].email };
      } catch (error) {
         await connection.rollback();
         console.error("Error registering user:", error);
         return { success: false, error: error.message };
      }
   } catch (error) {
      console.error("Error registering user:", error);
      return { success: false, error: error.message };
   } finally {
      if (connection) await connection.release();
   }
}

const deleteUser = async (id) => {
   let connection;
   try {
      const [rows] = await db.pool.execute("SELECT email FROM users WHERE id = ?", [id]);
      if (rows.length === 0) return { success: false, error: "User not found" };
      const email = rows[0].email;
      connection = await db.pool.getConnection();
      await connection.beginTransaction();
      try {
         await connection.execute("DELETE FROM users WHERE id = ?", [id]);
         await connection.execute("DELETE FROM invites WHERE email = ?", [email]);
         await connection.commit();
         return { success: true };
      } catch (error) {
         await connection.rollback();
         console.error("Error deleting user:", error);
         return { success: false, error: error.message };
      }
   } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: error.message };
   } finally {
      if (connection) await connection.release();
   }
}

const updateUser = async (id, user) => {
   try {
      const [result] = await db.pool.execute("UPDATE users SET firstname = ?, lastname = ? WHERE id = ?", [user.firstname, user.lastname, id]);
      return result;
   } catch (error) {
      console.error("Error updating user:", error);
      throw new Error(error.message);
   }
}

const updateUserPassword = async (email, password_hash) => {
   try {
      const [result] = await db.pool.execute("UPDATE users SET password_hash = ? WHERE email = ?", [password_hash, email]);
      return result;
   } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error(error.message);
   }
}

// const resetUserPassword = async (token, password_hash) => {
//    let connection;
//    try {
//       connection = await db.pool.getConnection();
//       await connection.beginTransaction();

//       const [tokens] = await connection.execute(
//          `SELECT user_id 
//           FROM reset_password_tokens 
//           WHERE token = ? AND used_at IS NULL AND expires_at > NOW()`,
//          [token]
//       );

//       if (tokens.length === 0) {
//          throw new Error("Invalid or expired token");
//       }

//       const user_id = tokens[0].user_id;

//       const [userResult] = await connection.execute(
//          "UPDATE users SET password_hash = ? WHERE id = ?",
//          [password_hash, user_id]
//       );

//       if (userResult.affectedRows === 0) {
//          throw new Error("User not found");
//       }

//       await connection.execute(
//          "UPDATE reset_password_tokens SET used_at = NOW() WHERE token = ? AND used_at IS NULL",
//          [token]
//       );

//       await connection.commit();
//       return { success: true };

//    } catch (error) {
//       if (connection) await connection.rollback();
//       console.error("Error resetting user password:", error);
//       return { success: false, error: error.message };
//    } finally {
//       if (connection) await connection.release();
//    }
// };

const changeUserRole = async (id, role_id) => {
   try {
      const [result] = await db.pool.execute("UPDATE users SET role_id = ? WHERE id = ?", [role_id, id]);
      return result;
   } catch (error) {
      console.error("Error changing user role:", error);
      throw new Error(error.message);
   }
}

export { getUsers, getUserById, inviteUser, registerUser, deleteUser, getUserCredentials, loginUser, updateUser, updateUserPassword, changeUserRole };