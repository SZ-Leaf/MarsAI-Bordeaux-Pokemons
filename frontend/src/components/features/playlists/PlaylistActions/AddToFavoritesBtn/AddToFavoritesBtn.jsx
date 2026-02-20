import "../../../../../styles/main.css";

export default function FavoriteButton({ submissionId, active, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`
        tooltip-container tooltip-bottom
        btn-icon
        ${active ? 'btn-icon-favorite' : 'btn-icon-default'}
      `}
      data-tooltip={active ? "Retirer des favoris" : "Ajouter aux favoris"}
      aria-label={active ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <i className={`pi pi-heart${active ? '-fill' : ''} icon-md`}></i>
    </button>
  );
}
