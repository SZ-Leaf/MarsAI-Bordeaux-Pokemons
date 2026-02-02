const useDynamicList = (fieldName, updateField, initialItem, updateItemField = null) => {
  const add = (currentList) => {
    const newList = [...currentList, initialItem];
    updateField(fieldName, newList);
  };

  const remove = (currentList, index) => {
    const newList = currentList.filter((_, i) => i !== index);
    updateField(fieldName, newList);
  };

  const update = (currentList, index, field, value) => {
    // Utiliser updateItemField si disponible pour la validation en temps réel
    if (updateItemField) {
      updateItemField(index, field, value);
    } else {
      // Fallback vers l'ancienne méthode
      const newList = [...currentList];
      newList[index] = {
        ...newList[index],
        [field]: value
      };
      updateField(fieldName, newList);
    }
  };

  return { add, remove, update };
};

export default useDynamicList;
