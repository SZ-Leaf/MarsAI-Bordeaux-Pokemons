import { useState } from 'react';

export const useEditableList = (fieldName, formData, updateField) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleAdd = () => {
    setEditingIndex(null);
    setIsModalOpen(true);
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setIsModalOpen(true);
  };

  const handleSave = (itemData, index) => {
    const currentItems = formData[fieldName] || [];
    const newItems = [...currentItems];
    if (index !== null) {
      newItems[index] = itemData;
    } else {
      newItems.push(itemData);
    }
    updateField(fieldName, newItems);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIndex !== null) {
      const currentItems = formData[fieldName] || [];
      const newItems = currentItems.filter((_, i) => i !== deleteIndex);
      updateField(fieldName, newItems);
    }
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeleteIndex(null);
  };

  return {
    isModalOpen,
    setIsModalOpen,
    editingIndex,
    isDeleteModalOpen,
    handleAdd,
    handleEdit,
    handleSave,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
    currentItems: formData[fieldName] || []
  };
};
