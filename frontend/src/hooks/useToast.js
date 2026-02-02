import { useState, useCallback } from 'react';

export const useToast = () => {
    const [toasts, setToasts] = useState([]);

    // Supprime un toast de la liste
    const removeToast = useCallback((id) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    // Ajoute un toast et le supprime automatiquement après la durée spécifiée
    const addToast = useCallback((message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random(); // ID unique
        const newToast = { id, message, type, duration };

        setToasts((prevToasts) => [...prevToasts, newToast]);

        // Suppression auto après X millisecondes
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }

        return id;
    }, [removeToast]);

    // Affiche un toast de succès
    const success = useCallback((message, duration = 3000) => {
        return addToast(message, 'success', duration);
    }, [addToast]);

    // Affiche un toast d'erreur
    const error = useCallback((message, duration = 4000) => {
        return addToast(message, 'error', duration);
    }, [addToast]);

    // Affiche un toast d'avertissement
    const warning = useCallback((message, duration = 3500) => {
        return addToast(message, 'warning', duration);
    }, [addToast]);

    // Affiche un toast d'information
    const info = useCallback((message, duration = 3000) => {
        return addToast(message, 'info', duration);
    }, [addToast]);

    // Efface tous les toasts d'un coup
    const clearAll = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        addToast,
        removeToast,
        success,
        error,
        warning,
        info,
        clearAll,
    };
};

export default useToast;
