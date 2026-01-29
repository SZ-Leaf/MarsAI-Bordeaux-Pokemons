import { inviteUser, registerUser, deleteUser, getUserCredentials, loginUser, updateUser, updateUserPassword } from "../../models/users/user_model.js";
import validator from "validator";
import { hashPassword, verifyPassword } from "../../helpers/password/password_hasher.js";
import { checkPasswordStrength } from "../../helpers/password/password_strength.js";
import { sendInviteMail, sendForgotPasswordMail } from "../../services/mailer/mailer_mail.js";
import { signToken, verifyToken } from "../../services/jwt/jwt_token.js";
import { sendError, sendSuccess } from "../../helpers/response_helper.js";
import { generateForgotPasswordToken, verifyForgotPasswordToken } from "../../services/mailer/mailer_tokens.js";

const inviteUserController = async (req, res) => {
   try {
      // input validation
      let { email, role_id } = req.body;
      email = email?.trim();
      role_id = role_id?.toString().trim();
      if (!email || !role_id) {
         return sendError(res, 400,
            "Email et rôle sont requis",
            "Email and role are required",
            null
         );
      }

      // validate role_id is a number and existing
      const allowedRoles = ["1", "2"];
      if (!allowedRoles.includes(role_id)) {
         return sendError(res, 400,
            "Rôle invalide",
            "Invalid role",
            null
         );
      }
      role_id = Number(role_id);

      // validate email is a valid email
      if (!validator.isEmail(email)) {
         return sendError(res, 400,
            "Email invalide",
            "Invalid email",
            null
         );
      }

      // invite user
      const result = await inviteUser(email, role_id);
      await sendInviteMail(email, result.token);
      return sendSuccess(res, 200,
         "Invitation envoyée avec succès",
         "Invitation sent successfully",
         { token: result.token, email: email }
      );
   } catch (error) {
      console.error("Error inviting user:", error);

      if (error.message.includes("Duplicate entry") || error.message.includes("already invited")) {
         return sendError(res, 400,
            "Invitation échouée",
            "Invitation failed",
            error.message
         );
      }

      return sendError(res, 500,
         "Erreur lors de l'invitation",
         "Error inviting user",
         error.message
      );
   }
}

const registerUserController = async (req, res) => {
   try {
      // input validation
      let { firstname, lastname, password } = req.body;
      const token = req.query.token;

      // validate token
      if (!token) {
         return sendError(res, 400,
            "Lien Invalide",
            "Invalid link",
            null
         );
      }

      // trim inputs
      firstname = firstname?.trim();
      lastname = lastname?.trim();
      password = password?.trim();

      // basic validation
      if (!firstname || !lastname || !password) {
         return sendError(res, 400,
            "Prénom, nom et mot de passe sont requis",
            "Firstname, lastname and password are required",
            null
         );
      }

      // check password strength
      try {
         checkPasswordStrength(password);
      } catch (error) {
         return sendError(res, 400,
            "Mot de passe invalide",
            "Invalid password",
            error.message
         );
      }

      // hash password
      const password_hash = await hashPassword(password);
      const user = {
         firstname: firstname,
         lastname: lastname,
         password_hash: password_hash
      }

      // register user
      const result = await registerUser(token, user);

      if (!result.success) {
         return sendError(res, 400,
            "Erreur lors de l'inscription",
            "Error registering user",
            result.error
         );
      }

      const email = result.email;
      return sendSuccess(res, 200,
         "Inscription réussie",
         "Registration successful",
         { email: email }
      );

   } catch (error) {
      console.error("Error registering user:", error);
      return sendError(res, 500,
         "Erreur lors de l'inscription",
         "Error registering user",
         error.message
      );
   }
}

const deleteUserController = async (req, res) => {
   try {
      const { id } = req.params;

      if (!id || isNaN(id)) {
         return sendError(res, 400,
            "ID utilisateur invalide",
            "Invalid user ID",
            null
         );
      }
      id = Number(id);

      const result = await deleteUser(id);
      if (!result.success) {
         return sendError(res, 400,
            "Erreur lors de la suppression de l'utilisateur",
            "Error deleting user",
            result.error
         );
      }
      return sendSuccess(res, 200,
         "Utilisateur supprimé avec succès",
         "User deleted successfully",
         null
      );
   } catch (error) {
      console.error("Error deleting user:", error);
      return sendError(res, 500,
         "Erreur lors de la suppression de l'utilisateur",
         "Error deleting user",
         error.message
      );
   }
}

const loginUserController = async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password) {
         return sendError(res, 400,
            "Email et mot de passe sont requis",
            "Email and password are required",
            null
         );
      }

      const credentials = await getUserCredentials(email);
      if (!credentials) {
         return sendError(res, 400,
            "Utilisateur non trouvé",
            "User not found",
            null
         );
      }
      const isPasswordValid = await verifyPassword(password, credentials.password_hash);
      if (!isPasswordValid) {
         return sendError(res, 400,
            "Mot de passe incorrect",
            "Invalid password",
            null
         );
      }

      const result = await loginUser(email);
      if (!result) {
         return sendError(res, 400,
            "Utilisateur non trouvé",
            "User not found",
            null
         );
      }
      const token = signToken({sub: result.id, email: result.email, role_id: result.role_id});
      return sendSuccess(res, 200,
         "Utilisateur trouvé avec succès",
         "User found successfully",
         { token: token, user: { firstname: result.firstname, lastname: result.lastname, last_login: result.last_login, created_at: result.created_at } }
      );
   } catch (error) {
      console.error("Error logging in user:", error);
      return sendError(res, 500,
         "Erreur lors de la connexion",
         "Error logging in user",
         error.message
      );
   }
}

// const updateUserController = async (req, res) => {
//    try {
//       const { id } = req.params;
//       const { firstname, lastname } = req.body;
//       const result = await updateUser(id, { firstname, lastname });
//       return sendSuccess(res, 200,
//          "Utilisateur mis à jour avec succès",
//          "User updated successfully",
//          result
//       );
// }

const getAllUsersController = async (req, res) => {
   try {
      const result = await getUsers();
      return sendSuccess(res, 200,
         "Utilisateurs récupérés avec succès",
         "Users retrieved successfully",
         result
      );
   } catch (error) {
      console.error("Error getting all users:", error);
      return sendError(res, 500,
         "Erreur lors de la récupération des utilisateurs",
         "Error getting all users",
         error.message
      );
   }
}

const updateUserPasswordController = async (req, res) => {
   try {
      const { email, new_password } = req.body;
      const trimmedPassword = new_password?.trim();
      const token = req.headers.authorization?.split(" ")[1];

      // Validate input
      if (!trimmedPassword) return sendError(res, 400,
         "Nouveau mot de passe requis",
         "New password required",
         null
      );
      try { 
         checkPasswordStrength(trimmedPassword); 
      } catch (error) {
         return sendError(res, 400,
            "Mot de passe invalide",
            "Invalid password",
            error.message
         );
      }

      // Validate token
      if (!token) return sendError(res, 400,
         "Session invalide",
         "Invalid login session",
         null
      );
      let decoded;
      try {
         decoded = verifyToken(token); 
      } catch (error) { 
         return sendError(res, 400,
            "Session invalide",
            "Invalid login session",
            null
         );
      }

      // Validate email matches token
      if (decoded.email !== email) return sendError(res, 400,
         "Email non autorisé",
         "Unauthorized email",
         null
      );

      // Hash and update password
      const password_hash = await hashPassword(trimmedPassword);
      const result = await updateUserPassword(email, password_hash);
      if (result.affectedRows === 0) return sendError(res, 400,
         "Mot de passe non mis à jour",
         "Password not updated",
         null
      );

      return sendSuccess(res, 200,
         "Mot de passe mis à jour avec succès",
         "Password updated successfully",
         null
      );
   } catch (error) {
      console.error("Error updating user password:", error);
      return sendError(res, 500,
         "Erreur lors de la mise à jour du mot de passe",
         "Error updating user password", 
         error.message
      );
   }
}

const forgotPasswordController = async (req, res) => {
   try {
      const {email} = req.body;
      if (!email) {
         return sendError(res, 400,
            "Email requis",
            "Email required",
            null
         );
      }

      const credentials = await getUserCredentials(email);
      if (!credentials) {
         return sendSuccess(res, 200,
            "Si l'email existe, un lien de réinitialisation a été envoyé",
            "If the email exists, a reset link has been sent",
            null
         );
      }
      const user_id = credentials.id;

      const { token } = await generateForgotPasswordToken(user_id);

      await sendForgotPasswordMail(email, token);

      return sendSuccess(res, 200,
         "Lien de réinitialisation de mot de passe a été envoyé",
         "Reset password link has been sent",
         { email: email }
      );
   }
      catch (error) {
         console.error("Error resetting user password request:", error);
         return sendError(res, 500,
            "Erreur lors de la requête de réinitialisation du mot de passe",
            "Error resetting user password request",
            error.message
         );
   }
}

export { inviteUserController, registerUserController, deleteUserController, loginUserController, getAllUsersController, updateUserPasswordController, forgotPasswordController };