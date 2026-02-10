import { useMemo, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

export default function TagSelectCreatable({ 
  allTags, 
  value = [], 
  onChange, 
  onSearchTags,    // Fonction de recherche passée en prop
  onCreateTag      // Fonction de création passée en prop
}) {
  const [msg, setMsg] = useState("");

  const defaultOptions = useMemo(
    () => allTags.map((t) => ({ value: t.id, label: t.title })),
    [allTags]
  );

  const loadOptions = async (inputValue) => {
    if (!inputValue.trim()) return defaultOptions;
    return await onSearchTags(inputValue.trim());
  };

  const handleCreateTag = async (inputValue) => {
    const title = inputValue.trim();
    if (!title) return;

    setMsg("");
    const result = await onCreateTag(title);

    if (!result.success) {
      setMsg(result.message);

      // Si c'est un doublon, sélectionner le tag existant
      if (result.duplicate && result.data) {
        const next = [...value];
        if (!next.some((v) => v.value === result.data.id)) {
          next.push({ value: result.data.id, label: result.data.title });
        }
        onChange(next);
      }
      return;
    }

    // Succès - ajouter à la sélection
    const created = result.data;
    onChange([...value, { value: created.id, label: created.title }]);
    setMsg(result.message);
  };

  return (
    <div>
      <AsyncCreatableSelect
        isMulti
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        value={value}
        onChange={(newValue) => {
          setMsg("");
          onChange(newValue || []);
        }}
        onCreateOption={handleCreateTag}
        placeholder="Sélectionner ou créer un tag..."
        formatCreateLabel={(input) => `Ajouter "${input}"`}
        closeMenuOnSelect={true}
        isClearable
        noOptionsMessage={() => "Aucun résultat, vous pouvez ajouter ce tag."}
        openMenuOnFocus
        openMenuOnClick
      />

      {msg && <p style={{ marginTop: 8 }}>{msg}</p>}
    </div>
  );
}
