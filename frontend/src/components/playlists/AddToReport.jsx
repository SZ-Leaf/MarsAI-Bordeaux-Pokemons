import "../ui/icon-buttons.css";
import "../ui/tooltips.css";

export default function ReportButton({ submissionId, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        tooltip-container tooltip-bottom
        btn-icon
        ${active ? 'btn-icon-report' : 'btn-icon-default'}
      `}
      data-tooltip={active ? "Retirer des signalements" : "Ajouter aux signalements"}
      aria-label={active ? "Retirer des signalements" : "Ajouter aux signalements"}
    >
      <i className="pi pi-flag icon-md"></i>
    </button>
  );
}
