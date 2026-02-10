import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function ReportButton({ submissionId, active, onToggle }) {
  const btnId = `rep-btn-${submissionId}`;

  return (
    <>
      <Tooltip target={`#${btnId}`} position="bottom" />
      <Button
        id={btnId}
        icon="pi pi-times"
        rounded
        outlined
        focusRing={false}
        data-pr-tooltip={active ? "Retirer des signalements" : "Ajouter aux signalements"}
        style={
          active
            ? { color: "#e91e63", borderColor: "#e91e63", border: "none" }
            : { color: "#9e9e9e", borderColor: "#9e9e9e", border: "none" }
        }
        aria-label="Signaler"
        onClick={onToggle}
      />
    </>
  );
}
