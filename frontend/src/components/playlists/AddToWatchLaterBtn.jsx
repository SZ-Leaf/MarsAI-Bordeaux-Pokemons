import "../ui/icon-buttons.css";
import "../ui/tooltips.css";

export default function WatchLaterButton({ submissionId, active, onToggle }) {
  return (
    <button
      onClick={onToggle(submissionId)}
      className={`
        tooltip-container tooltip-bottom
        btn-icon
        ${active ? 'btn-icon-watch-later' : 'btn-icon-default'}
      `}
      data-tooltip={active ? "Retirer de la liste" : "À voir plus tard"}
      aria-label={active ? "Retirer de la liste" : "À voir plus tard"}
    >
      <i className="pi pi-history icon-md"></i>
    </button>
  );
}
