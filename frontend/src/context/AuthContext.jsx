import { useState } from "react";
import { loginService, registerService } from "../services/auth.service";


const authProvider = ({children}) => {

   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState(null);

   useEffect(() => {
      const fetchCurrentUser = async () => {
         try {
            const response = await getCurrentUserService();
            setUser(response);
         } catch (error) {
            setError(error);
         }
      }
      fetchCurrentUser();
   })

   const login = async ({email, password}) => {
      try {
         const response = await loginService(email, password);
         return response;
      } catch (error) {
         if(error instanceof I18nError) {
            throw error;
         }
         throw new I18nError({
            fr: 'Erreur lors de la connexion',
            en: 'Error during login'
         });
      }
   }

   const register = async ({firstname, lastname, password}) => {
      try {
         const response = await registerService(firstname, lastname, password);
         return response;
      } catch (error) {
         if(error instanceof I18nError) {
            throw error;
         }
      }
      throw new I18nError({
         fr: 'Erreur lors de l\'inscription',
         en: 'Error during registration'
      });
   }

   const updateUser = async ({id, firstname, lastname}) => {
      try {
         const response = await updateUserService(id, {firstname, lastname});
         return response;
      } catch (error) {
         if(error instanceof I18nError) {
            throw error;
         }
      }
      throw new I18nError({
         fr: 'Erreur lors de la mise à jour de l\'utilisateur',
         en: 'Error updating user'
      });
   }

   const updateUserPassword = async ({new_password}) => {
      try {
         const response = await updateUserPasswordService(new_password);
         return response;
      } catch (error) {
         if(error instanceof I18nError) {
            throw error;
         }
      }
      throw new I18nError({
         fr: 'Erreur lors de la mise à jour du mot de passe',
         en: 'Error updating user password'
      });
   }

}