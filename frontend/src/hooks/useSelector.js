import { useState, useEffect } from 'react';
import { API_URL } from '../utils/api';

export const useSelector = () => {
    const [submissions, setSubmissions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Récupérer les soumissions
    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/submissions`, {
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
            const response = await fetch(`${API_URL}/api/selector/rate/${submissionId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ rating, comment })
            });

            if (!response.ok) throw new Error('Erreur lors de la notation');
            return await response.json();
        } catch (err) {
            throw err;
        }
    };

    // Ajouter à une playlist
    const addToPlaylist = async (submissionId, playlistType) => {
        try {
            const response = await fetch(
                `${API_URL}/api/selector/playlist/${playlistType}/${submissionId}`,
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