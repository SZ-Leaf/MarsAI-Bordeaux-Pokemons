import { useState, useEffect, useCallback } from 'react';
import { getHomepageService, updateHomepageService } from '../../../../services/homepage.service';
import { INITIAL_DATA } from './adminCmsConfig';

// Durée d'affichage du feedback (succès / erreur) avant disparition automatique
const STATUS_CLEAR_DELAY = 3000;

export const useHomepageCms = () => {
  const [activeTab, setActiveTab] = useState('hero');

  // Données en cours d'édition
  const [data, setData] = useState(INITIAL_DATA);
  // Données de la dernière version sauvegardée
  const [originalData, setOriginalData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  // Charge les données depuis l'API au montage et synchronise
  // les données en cours d'édition et de la dernière version sauvegardée
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getHomepageService();
      setData(res.data);
      setOriginalData(res.data);
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Retourne un handler curryé pour mettre à jour la/les sections ciblées
  const updateSection = (section) => (val) =>
    setData((prev) => ({ ...prev, [section]: val }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await updateHomepageService(data);
      // Met à jour la dernière version sauvegardée pour que le prochain reset parte de cette version
      setOriginalData(data);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), STATUS_CLEAR_DELAY);
    }
  };

  // Annule les modifications non sauvegardées sans appel réseau
  const handleReset = () => {
    setData(originalData);
    setStatus(null);
  };

  return {
    activeTab,
    setActiveTab,
    data,
    loading,
    saving,
    status,
    updateSection,
    handleSave,
    handleReset,
  };
};

