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

  const customStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      borderColor: state.isFocused ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)",
      borderWidth: "2px",
      borderRadius: "0.5rem",
      padding: "2px",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
      "&:hover": {
        borderColor: "rgba(255, 255, 255, 0.2)"
      }
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#111827", // gray-900
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "0.5rem",
      padding: "4px"
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected 
        ? "rgba(59, 130, 246, 0.5)" 
        : state.isFocused 
          ? "rgba(255, 255, 255, 0.1)" 
          : "transparent",
      color: "white",
      cursor: "pointer",
      "&:active": {
        backgroundColor: "rgba(59, 130, 246, 0.7)"
      }
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "rgba(59, 130, 246, 0.2)",
      borderRadius: "9999px",
      padding: "2px 8px"
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#00b8da", // cyan
      fontWeight: "500"
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#00b8da",
      "&:hover": {
        backgroundColor: "transparent",
        color: "white"
      }
    }),
    input: (base) => ({
      ...base,
      color: "white"
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.4)"
    }),
    singleValue: (base) => ({
      ...base,
      color: "white"
    })
  };

  return (
    <div>
      <AsyncCreatableSelect
        isMulti
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={loadOptions}
        styles={customStyles}
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

      {msg && <p className="text-white text-xs mt-2">{msg}</p>}
    </div>
  );
}
