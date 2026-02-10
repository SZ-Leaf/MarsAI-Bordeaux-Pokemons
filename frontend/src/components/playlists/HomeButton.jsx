import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

export default function HomeButton({ onToggle }) {
  return (
    <>
      <Tooltip target="#home-btn" position="bottom" />
      <Button
        id="home-btn"
        icon="pi pi-home"
        rounded
        outlined
        focusRing={false}
        data-pr-tooltip="Accueil"
        style={{ color: "#9e9e9e", borderColor: "#9e9e9e", border: "none" }}
        aria-label="Accueil"
        onClick={onToggle}
      />
    </>
  );
}
