import { useCallback, useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL;

export function useSubmissionRatingStatus(submissionId) {
  const [hasRating, setHasRating] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchRatingStatus = useCallback(async () => {
    if (!submissionId) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/selector/rating/status/${submissionId}`, {
        credentials: "include",
      });
      
      if (response.ok) {
        const json = await response.json();
        const data = json?.data ?? json;
        // Si l'utilisateur a mis une note ou un commentaire, hasRating = true
        setHasRating(data?.has_rating || data?.has_comment || false);
      } else {
        setHasRating(false);
      }
    } catch (error) {
      console.error("Error fetching rating status:", error);
      setHasRating(false);
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    fetchRatingStatus();
  }, [fetchRatingStatus]);

  const markAsRated = useCallback(() => {
    setHasRating(true);
  }, []);

  return { hasRating, loading, refetch: fetchRatingStatus, markAsRated };
}
