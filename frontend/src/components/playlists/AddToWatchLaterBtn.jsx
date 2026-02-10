import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function WatchLaterButton({ submissionId, active, onToggle }) {
  const btnId = `wl-btn-${submissionId}`;

  return (
    <>
      <Tooltip target={`#${btnId}`} position="bottom" />
      <Button
        id={btnId}
        icon="pi pi-history"
        rounded
        outlined
        focusRing={false}
        data-pr-tooltip={active ? "Retirer de la liste" : "A voir plus tard"}
        style={
          active
            ? { color: "#211ee9", borderColor: "#211ee9", border: "none" }
            : { color: "#9e9e9e", borderColor: "#9e9e9e", border: "none" }
        }
        aria-label="A voir plus tard"
        onClick={onToggle}
      />
    </>
  );
}
