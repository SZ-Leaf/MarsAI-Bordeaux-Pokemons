import { useState, useEffect, useCallback } from "react";
import { getPopularTags, searchTags } from "../services/tag.service";

export const useTags = () => {
  const [popularTags, setPopularTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadPopularTags = useCallback(async (limit = 6) => {
    setLoading(true);
    setError("");
    try {
      const response = await getPopularTags(limit);
      setPopularTags(response.data || []);
    } catch (e) {
      setError(e?.message || "Erreur chargement tags populaires");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPopularTags(6);
  }, [loadPopularTags]);

  const handleSearchTags = async (search, limit = 10) => {
    try {
      const response = await searchTags(search, limit);
      return (response.data || []).map((t) => ({ value: t.id, label: t.title }));
    } catch {
      return [];
    }
  };

  return {
    popularTags,
    loading,
    error,
    loadPopularTags,
    searchTags: handleSearchTags,
  };
};
