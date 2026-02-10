import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function RatingButton({ submissionId, active, onToggle }) {
  const btnId = `rate-btn-${submissionId}`;

  return (
    <>
      <Tooltip target={`#${btnId}`} position="bottom" />
      <Button
        id={btnId}
        icon="pi pi-star"
        rounded
        outlined
        focusRing={false}
        data-pr-tooltip={active ? "Modifier la note" : "Noter"}
        style={
          active
            ? { color: "#fbbf24", borderColor: "#fbbf24", border: "none" }
            : { color: "#9e9e9e", borderColor: "#9e9e9e", border: "none" }
        }
        aria-label="Noter"
        onClick={onToggle}
      />
    </>
  );
}
