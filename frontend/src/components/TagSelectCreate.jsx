import { useMemo, useState } from "react";
import AsyncCreatableSelect from "react-select/async-creatable";

const API = import.meta.env.VITE_API_URL;

export default function TagSelectCreatable({ allTags, value, onChange, onTagCreated }) {
  const [msg, setMsg] = useState("");

  const defaultOptions = useMemo(
    () => allTags.map((t) => ({ value: t.id, label: t.title })),
    [allTags]
  );

  const loadOptions = async (inputValue) => {
    const search = inputValue.trim();

    if (!search) return defaultOptions;

    try {
      const res = await fetch(`${API}/api/tags?search=${encodeURIComponent(search)}&limit=10`);
      const json = await res.json();
      if (!res.ok) return [];

      return (json.data || []).map((t) => ({ value: t.id, label: t.title }));
    } catch {
      return [];
    }
  };


  const createTag = async (inputValue) => {
    const title = inputValue.trim();
    if (!title) return;

    setMsg("");
    try {

      const res = await fetch(`${API}/api/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });

      const json = await res.json();

      if (res.status === 409) {
        setMsg(json?.message?.fr || "Tag déjà existant");

        const existing = json.data; // on récupère la valeur déjà existante
        if (existing) {
          //si elle existe déjà en db, on l'affiche
          onTagCreated(existing);

          // le sélectionner sans doublon
          const next = [...(value || [])];
          if (!next.some((v) => v.value === existing.id)) {
            next.push({ value: existing.id, label: existing.title });
          }
          onChange(next);
        }

        return;
      }
      if (!res.ok) throw new Error(json?.message?.fr || "Erreur création tag");

      const created = json.data;
      onTagCreated(created); // pour mettre à jour allTags dans le parent

      // on l’ajoute directement à la sélection
      onChange([...(value || []), { value: created.id, label: created.title }]);

      setMsg("Tag créé !");
    } catch (e) {
      setMsg(e.message);
    }


  };

  return (
    <div>
      <AsyncCreatableSelect
        isMulti
        cacheOptions
        defaultOptions={[
          {
            label: "Suggestions",
            options: defaultOptions,
          },
        ]}
        loadOptions={loadOptions}
        value={value}
        onChange={(newValue) => {
          setMsg("");
          onChange(newValue || []);
        }}
        onCreateOption={createTag}
        placeholder="Sélectionne des tags…"
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
