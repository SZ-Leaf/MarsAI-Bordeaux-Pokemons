import { useState, useEffect, createContext, useMemo } from "react";
import {
   loginService,
   getCurrentUserService,
   updateUserService,
   logoutService,
} from "../services/auth.service";
import { I18nError, authError } from "../services/error.service";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {

   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [initialized, setInitialized] = useState(false);
   const [error, setError] = useState(null);

   const handleError = (messages) => {
      const err = authError(messages);
      setError(err);
      throw err;
   };

   useEffect(() => {
      const fetchCurrentUser = async () => {
         try {
            const user = await getCurrentUserService();
            setUser(user);
            setError(null);
         } catch (error) {
            if (error?.status === 401) {
              setUser(null);
              setError(null);
            } else {
               handleError({
                  fr: 'Erreur serveur',
                  en: 'Server error',
               });
            }
         } finally {
            setIsLoading(false);
            setInitialized(true);
         }
      }
      fetchCurrentUser();
   }, [])

   const login = async ({email, password}) => {
      setIsLoading(true);
      setError(null);
      try {
         const user = await loginService(email, password);
         setUser(user);
         return user;
      } catch (error) {
         if(error instanceof I18nError) { 
            setError(error);
            throw error;
         }
         handleError({
            fr: 'Erreur lors de la connexion',
            en: 'Error during login'
         });
      } finally {
         setIsLoading(false);
      }
   };

   const updateUser = async ({id, firstname, lastname}) => {
      setIsLoading(true);
      setError(null);
      try {
         const updatedUser = await updateUserService(id, {firstname, lastname});
         setUser(updatedUser);
         return updatedUser;
      } catch (error) {
         if(error instanceof I18nError) {
            setError(error);
            throw error;
         }
         handleError({
            fr: 'Erreur lors de la mise à jour de l\'utilisateur',
            en: 'Error updating user'
         });
      } finally {
         setIsLoading(false);
      }
   };

   const logout = async () => {
      setIsLoading(true);
      setError(null);
      try {
         await logoutService();
         setUser(null);
      } catch (error) {
         if(error instanceof I18nError) {
            setError(error);
            throw error;
         }
         handleError({
            fr: 'Erreur lors de la déconnexion',
            en: 'Error logging out'
         });
      } finally {
         setIsLoading(false);
      }
   };

   const refreshUser = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const user = await getCurrentUserService();
        setUser(user);
        return user;
      } catch (error) {
         if (error?.status === 401) {
            setUser(null);
            setError(null);
            return null;
         }
         handleError({
           fr: 'Erreur lors du rafraîchissement utilisateur',
           en: 'Error refreshing user',
         });
      } finally {
        setIsLoading(false);
      }
   };
    

   const value = useMemo(() => Object.freeze({
      user,
      isLoading,
      initialized,
      error,
      login,
      updateUser,
      logout,
      refreshUser,
      isAuthenticated: Boolean(user?.id)
   }), [user, isLoading, error, initialized]);

   return (
      <AuthContext.Provider value={value}>
         {children}
      </AuthContext.Provider>
   )

}