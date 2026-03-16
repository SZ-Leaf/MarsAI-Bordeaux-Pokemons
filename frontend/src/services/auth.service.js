import { apiCall } from '../utils/api';
import { I18nError } from './error.service';
import { updateUserSchema, userPasswordSchema } from '@marsai/schemas';

export const getCurrentUserService = async () => {
   const res = await apiCall('/api/auth/me', {
    method: 'GET'
   });
   return res?.data?.user ?? res?.data ?? res;
};

export const getUsersService = async () => {
   const res = await apiCall('/api/auth/users', {
    method: 'GET'
   });
   return res;
};

export const loginService = async (email, password) => {
   email = email?.trim();
   password = password?.trim();
   if(!email || !password) {
      throw new I18nError({
         fr: 'Email et mot de passe sont requis',
         en: 'Email and password are required'
      });
   }
   const res = await apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
   });
   return res?.data ?? res;
};

export const registerService = async (firstname, lastname, password, token) => {
   firstname = firstname?.trim();
   lastname = lastname?.trim();
   password = password?.trim();
   if(!firstname || !lastname || !password || !token) {
      throw new I18nError({
         fr: 'Tous les champs sont requis',
         en: 'All fields are required'
      });
   }
   const res = await apiCall(`/api/auth/register?token=${token}`, {
    method: 'POST',
    body: JSON.stringify({ firstname, lastname, password })
   });
   return res;
};

export const logoutService = async () => {
   return apiCall('/api/auth/logout', {
    method: 'POST'
   });
};

export const updateUserService = async (id, {firstname, lastname}) => {
   if (!id) {
      throw new I18nError({
        fr: "Non autorisé",
        en: "Unauthorized"
      });
   }
   firstname = firstname?.trim();
   lastname = lastname?.trim();

   try {
      updateUserSchema.parse({
         firstname: firstname || undefined,
         lastname: lastname || undefined,
      });
   } catch (err) {
      const msg = err?.errors?.[0]?.message || {
         fr: 'Données utilisateur invalides',
         en: 'Invalid user data'
      };
      throw new I18nError(
         typeof msg === 'string'
           ? { fr: msg, en: msg }
           : msg
      );
   }

   const body = {};
   if (firstname) body.firstname = firstname;
   if (lastname) body.lastname = lastname;
   return apiCall(`/api/auth/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body)
   });
};

export const updateUserPasswordService = async (new_password) => {
   new_password = new_password?.trim();

   try {
      userPasswordSchema.parse({ password: new_password });
   } catch (err) {
      const msg = err?.errors?.[0]?.message || {
         fr: 'Nouveau mot de passe requis',
         en: 'New password is required'
      };
      throw new I18nError(
         typeof msg === 'string'
           ? { fr: msg, en: msg }
           : msg
      );
   }
   return apiCall(`/api/auth/password-update`, {
      method: 'PATCH',
      body: JSON.stringify({ new_password })
   });
};
