import { useState, useEffect } from 'react';

export const useSelector = () => {
    const [submissions, setSubmissions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupérer les soumissions
    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/submissions`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!response.ok) throw new Error('Erreur lors du chargement');

            const data = await response.json();

            setSubmissions(data.data.submissions || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Noter une soumission
    const rateSubmission = async (submissionId, rating, comment) => {
        try {
            // Préparer le body : ne pas envoyer rating s'il est à 0
            const body = {};
            
            if (rating > 0) {
                body.rating = rating;
            }
            
            if (comment && comment.trim()) {
                body.comment = comment.trim();
            }
            

            const response = await rateSubmissionService(submissionId, body);
            console.log(response);
        } catch (err) {
            throw err;
        }
    };

    // Ajouter à une playlist
    const addToPlaylist = async (submissionId, playlistType) => {
        try {
            const response = await fetch(
                `${process.env.API_URL}/api/selector/playlist/${playlistType}/${submissionId}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (!response.ok) throw new Error('Erreur lors de l\'ajout');
            return await response.json();
        } catch (err) {
            throw err;
        }
    };

    // Navigation
    const goToNext = () => {
        if (currentIndex < submissions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    return {
        submissions,
        currentSubmission: submissions[currentIndex],
        currentIndex,
        loading,
        error,
        goToNext,
        goToPrevious,
        rateSubmission,
        addToPlaylist,
        refetch: fetchSubmissions
    };
};