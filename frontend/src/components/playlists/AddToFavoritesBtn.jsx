import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function FavoriteButton({ submissionId, active, onToggle }) {
  const btnId = `fav-btn-${submissionId}`;

  return (
    <>
      <Tooltip target={`#${btnId}`} position="bottom" />
      <Button
        id={btnId}
        icon={active ? "pi pi-heart-fill" : "pi pi-heart"}
        rounded
        outlined
        focusRing={false}
        data-pr-tooltip={active ? "Retirer des favoris" : "Ajouter aux favoris"}
        style={
          active
            ? { color: "#e9e91e", borderColor: "#e9e91e", border: "none" }
            : { color: "#9e9e9e", borderColor: "#9e9e9e", border: "none" }
        }
        aria-label="Favori"
        onClick={onToggle}
      />
    </>
  );
}
