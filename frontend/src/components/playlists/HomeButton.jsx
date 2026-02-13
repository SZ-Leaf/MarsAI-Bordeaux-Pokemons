import "../ui/icon-buttons.css";
import "../ui/tooltips.css";

export default function HomeButton() {
  return (
    <button
      className="tooltip-container tooltip-bottom btn-icon btn-icon-home"
      data-tooltip="Accueil"
      aria-label="Accueil"
    >
      <i className="pi pi-home icon-md"></i>
    </button>
  );
}
