import { useState, useEffect, useCallback } from 'react';
import { getHomepageService, updateHomepageService } from '../../../../services/homepage.service';
import { INITIAL_DATA } from './adminCmsConfig';

const STATUS_CLEAR_DELAY = 3000;

export const useHomepageCms = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [data, setData] = useState(INITIAL_DATA);
  const [originalData, setOriginalData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

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

  const updateSection = (section) => (val) =>
    setData((prev) => ({ ...prev, [section]: val }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await updateHomepageService(data);
      setOriginalData(data);
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), STATUS_CLEAR_DELAY);
    }
  };

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

