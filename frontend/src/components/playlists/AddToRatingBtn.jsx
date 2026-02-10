import "../ui/tooltips.css";
import "../ui/icon-buttons.css";

export default function RatingButton({ submissionId, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        tooltip-container tooltip-bottom
        btn-icon
        ${active ? 'btn-icon-rating' : 'btn-icon-default'}
      `}
      data-tooltip={active ? "Modifier la note" : "Noter"}
      aria-label={active ? "Modifier la note" : "Noter"}
    >
      <i className="pi pi-star icon-md"></i>
    </button>
  );
}
