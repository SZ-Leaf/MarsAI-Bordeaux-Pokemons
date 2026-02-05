import { inviteUser, registerUser, deleteUser, getUserCredentials, loginUser, updateUser, updateUserPassword, resetUserPassword, getUsers, changeUserRole, getWaitingInvites } from "../../models/users/user.model.js";
import { hashPassword, verifyPassword } from "../../helpers/password/password_hasher.js";
import { sendInviteMail, sendForgotPasswordMail } from "../../services/mailer/mailer.mail.js";
import { signToken } from "../../services/jwt/jwt.token.js";
import { sendError, sendSuccess } from "../../helpers/response.helper.js";
import { generateForgotPasswordToken, verifyForgotPasswordToken } from "../../services/mailer/mailer.tokens.js";
import { registerUserSchema, updateUserSchema, userPasswordSchema } from "../../utils/schemas/user.schemas.js";
import { checkEmail } from "../../utils/email.validator.js";

const inviteUserController = async (req, res) => {
   try {
      // input validation
      const { role_id } = req.body;
      let { email } = req.body;
      email = email?.trim();
      if (!email || !role_id) {
         return sendError(res, 400,
            "Email et rôle sont requis",
            "Email and role are required",
            null
         );
      }

      // validate email is a valid email
      try {
         checkEmail(email);
      } catch (error) {
         return sendError(res, 400,
            error.fr,
            error.en,
            null
         );
      }

      let numericRoleId = Number(role_id);
      // verify role_id is either 1 (user) or 2 (admin)
      if (numericRoleId !== 1 && numericRoleId !== 2) {
         return sendError(res, 400,
            "Rôle invalide",
            "Invalid role",
            null
         );
      }

      // role based permission check
      const inviterRoleId = req.user.role_id;
      if (inviterRoleId === 2) {
         numericRoleId = 1;
      }

      const result = await inviteUser(email, numericRoleId);
      await sendInviteMail(email, result.token);
      const messageFr = result.updated 
         ? "Invitation renouvelée avec succès" 
         : "Invitation envoyée avec succès";
      const messageEn = result.updated 
         ? "Invitation renewed successfully" 
         : "Invitation sent successfully";
      return sendSuccess(res, 200,
         messageFr,
         messageEn,
         { token: result.token, email: email }
      );
   } catch (error) {
      console.error("Error inviting user:", error);

      if (error.message.includes("User with this email already exists")) {
         return sendError(res, 400,
            "Un utilisateur avec cet email existe déjà",
            "User with this email already exists",
            error.message
         );
      }

      if (error.message.includes("already registered")) {
         return sendError(res, 400,
            "L'utilisateur a déjà enregistré avec cette invitation",
            "User has already registered with this invitation",
            error.message
         );
      }

      if (error.message.includes("Duplicate entry")) {
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
      const token = req.query.token;

      // validate token
      if (!token) {
         return sendError(res, 400,
            "Lien Invalide",
            "Invalid link",
            null
         );
      }

      // validate input using Zod
      let { firstname, lastname, password } = req.body;
      firstname = firstname?.trim();
      lastname = lastname?.trim();
      password = password?.trim();


      try {
         registerUserSchema.parse({ firstname, lastname, password });
      } catch (err) {
         // Zod throws an object with `issues`, map them to your i18n messages
         const firstError = err.errors?.[0]?.message || 'Invalid input';
         return sendError(res, 400, firstError, firstError, null);
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

      return sendSuccess(res, 200,
         "Inscription réussie",
         "Registration successful",
         { email: result.email }
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
      let { id } = req.params;
      
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
      let { email, password } = req.body;
      email = email?.trim();
      password = password?.trim();
      
      if (!email || !password) {
         return sendError(res, 400,
            "Email et mot de passe sont requis",
            "Email and password are required",
            null
         );
      }

      // validate email is a valid email
      try {
         checkEmail(email);
      } catch (error) {
         return sendError(res, 400,
            error.fr,
            error.en,
            null
         );
      }
      // validate input using Zod
      try {
         userPasswordSchema.parse({ password });
      } catch (err) {
         const firstError = err.errors?.[0]?.message || 'Invalid input';
         return sendError(res, 400, firstError, firstError, null);
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
            "Identifiants de connexion incorrects",
            "Invalid login credentials",
            null
         );
      }

      const result = await loginUser(email);
      if (!result) {
         return sendError(res, 400,
            "Identifiants de connexion incorrects",
            "Invalid login credentials",
            null
         );
      }
      const token = signToken({sub: result.id, email: result.email, role_id: result.role_id});


      // set httpOnly cookie
      res.cookie(
         'authToken',
         token,
         {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            path: '/',
         }
      );


      return sendSuccess(res, 200,
         "Utilisateur connecté avec succès",
         "User logged in successfully",
         { user: { firstname: result.firstname, lastname: result.lastname, last_login: result.last_login, created_at: result.created_at } }
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

const updateUserController = async (req, res) => {
   try {
      const { id } = req.params;
      let { firstname, lastname } = req.body;
      
      // Check if user is updating their own profile
      if (req.user.id.toString() !== id) {
         return sendError(res, 403,
            "Non autorisé",
            "Unauthorized",
            null
         );
      }

      firstname = firstname?.trim();
      lastname = lastname?.trim();

      // validate input using Zod
      try {
         updateUserSchema.parse({ firstname, lastname });
      } catch (err) {
         const firstError = err.errors?.[0]?.message || 'Invalid input';
         return sendError(res, 400, firstError, firstError, null);
      }
      const user = {
         firstname: firstname,
         lastname: lastname
      }
      const result = await updateUser(id, user);
      if (result.affectedRows === 0) {
         return sendError(res, 400,
            "Erreur lors de la mise à jour de l'utilisateur",
            "Error updating user",
            null
         );
      }
      return sendSuccess(res, 200,
         "Profile mis à jour avec succès",
         "Profile updated successfully",
         null
      );
      
   } catch (error) {
      console.error("Error updating user:", error);
      return sendError(res, 500,
         "Erreur lors de la mise à jour de l'utilisateur",
         "Error updating user",
         error.message
      );
   }
}

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
      let { email, new_password } = req.body;
      email = email?.trim();
      new_password = new_password?.trim();

      // check if user is updating their own password
      if (req.user.email !== email) {
         return sendError(res, 403,
            "Non autorisé",
            "Unauthorized",
            null
         );
      }

      // Validate input
      if (!new_password) return sendError(res, 400,
         "Nouveau mot de passe requis",
         "New password required",
         null
      );

      try {
        userPasswordSchema.parse({ password: new_password });
      } catch (err) {
         const firstError = err.errors?.[0]?.message || 'Invalid input';
         return sendError(res, 400, firstError, firstError, null);
      }

      // Hash and update password
      const password_hash = await hashPassword(new_password);
      const result = await updateUserPassword(email, password_hash);
      if (result.affectedRows === 0) return sendError(res, 400,
         "Erreur lors de la mise à jour du mot de passe",
         "Error updating user password",
         null
      );

      return sendSuccess(res, 200,
         "Mot de passe mis à jour avec succès",
         "User password updated successfully",
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
      let {email} = req.body;
      email = email?.trim();
      if (!email) {
         return sendError(res, 400,
            "Email requis",
            "Email required",
            null
         );
      }

      // validate email is a valid email
      try {
         checkEmail(email);
      } catch (error) {
         return sendError(res, 400,
            error.fr,
            error.en,
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

const resetPasswordController = async (req, res) => {
   try {
      let { token, new_password } = req.body;
      token = token?.trim();
      new_password = new_password?.trim();
      if (!token || !new_password) {
         return sendError(res, 400,
            "Nouveau mot de passe requis",
            "New password is required",
            null
         );
      }

      try {
         userPasswordSchema.parse({ password: new_password });
      } catch (err) {
         const firstError = err.errors?.[0]?.message || 'Invalid input';
         return sendError(res, 400, firstError, firstError, null);
      }

      // verify token without calling the model for faster response
      try {
         await verifyForgotPasswordToken(token);
      } catch (error) {
         return sendError(res, 400,
            "Lien invalide",
            "Invalid link",
            null
         );
      }

      const password_hash = await hashPassword(new_password);

      const result = await resetUserPassword(token, password_hash);

      return sendSuccess(res, 200,
         "Mot de passe réinitialisé avec succès",
         "Password reset successfully",
         { email: result.user_email }
      );

   } catch (error) {
      console.error("Error resetting user password:", error);
      return sendError(res, 500,
         "Erreur lors de la réinitialisation du mot de passe",
         "Error resetting user password",
         null
      );
   }
}

const changeUserRoleController = async (req, res) => {
   try {
      let {new_role_id} = req.body;
      let { id } = req.params;
      id = Number(id);
      new_role_id = Number(new_role_id);
      if (!id || isNaN(id) || !new_role_id || isNaN(new_role_id)) {
         return sendError(res, 400,
            "Utilisateur et nouveau rôle sont requis",
            "User and new role are required",
            null
         );
      }

      const allowedRoles = [1, 2];
      if (!allowedRoles.includes(new_role_id)) {
         return sendError(res, 400,
            "Rôle invalide",
            "Invalid role",
            null
         );
      }

      const result = await changeUserRole(id, new_role_id);
      if (result.affectedRows === 0) {
         return sendError(res, 400,
            "Erreur lors du changement de rôle de l'utilisateur",
            "Error changing user role",
            null
         );
      }
      return sendSuccess(res, 200,
         "Rôle de l'utilisateur changé avec succès",
         "User role changed successfully",
         null
      );
   } catch (error) {
      console.error("Error changing user role:", error);
      return sendError(res, 500,
         "Erreur lors du changement de rôle de l'utilisateur",
         "Error changing user role",
         error.message
      );
   }
}

const logoutUserController = async (req, res) => {
   try {
      // clear the httpOnly cookie
      res.clearCookie('authToken', {
         httpOnly: true,
         secure: process.env.NODE_ENV === 'production',
         sameSite: 'strict',
         path: '/'
      });

      return sendSuccess(res, 200,
         "Déconnexion réussie",
         "Logout successful",
         null
      );
   } catch (error) {
      console.error("Error logging out user:", error);
      return sendError(res, 500,
         "Erreur lors de la déconnexion",
         "Error logging out",
         error.message
      );
   }
}

const getWaitingInvitesController = async (req, res) => {
   try {
      const result = await getWaitingInvites();
      return sendSuccess(res, 200,
         "Invitations en attente récupérées avec succès",
         "Waiting invites retrieved successfully",
         result
      );
   }
   catch (error) {
      console.error("Error getting waiting invites:", error);
      return sendError(res, 500,
         "Erreur lors de la récupération des invitations en attente",
         "Error getting waiting invites",
         error.message
      );
   }
}

export {
   inviteUserController,
   registerUserController,
   deleteUserController,
   updateUserController,
   updateUserPasswordController,
   forgotPasswordController,
   resetPasswordController,
   getAllUsersController,
   changeUserRoleController,
   loginUserController,
   logoutUserController,
   getWaitingInvitesController
};