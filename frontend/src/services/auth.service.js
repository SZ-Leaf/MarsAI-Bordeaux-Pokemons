import { apiCall } from '../utils/api';
import { I18nError } from './error.service';

export const getCurrentUserService = async () => {
   return apiCall('/api/auth/me', {
    method: 'GET'
   });
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
   return apiCall('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
   });
};

export const registerService = async (firstname, lastname, password) => {
   firstname = firstname?.trim();
   lastname = lastname?.trim();
   password = password?.trim();
   if(!firstname || !lastname || !password) {
      throw new I18nError({
         fr: 'Tous les champs sont requis',
         en: 'All fields are required'
      });
   }
   return apiCall('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ firstname, lastname, password })
   });
};

export const logoutService = async () => {
   return apiCall('/api/auth/logout', {
    method: 'POST'
   });
};

export const updateUserService = async (id, {firstname, lastname}) => {
   id = id?.trim();
   if (!id) {
      throw new I18nError({
        fr: "Non autorisé",
        en: "Unauthorized"
      });
   }
   firstname = firstname?.trim();
   lastname = lastname?.trim();
   if (!firstname && !lastname) {
      throw new I18nError({
         fr: 'Au moins un champ (prénom ou nom) doit être fourni',
         en: 'At least one field (firstname or lastname) must be provided'
      });
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
   if(!new_password) {
      throw new I18nError({
         fr: 'Nouveau mot de passe requis',
         en: 'New password is required'
      });
   }
   return apiCall(`/api/auth/password-update`, {
      method: 'PATCH',
      body: JSON.stringify({ new_password })
   });
};