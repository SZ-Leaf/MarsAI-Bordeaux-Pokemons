import { useLanguage } from "../context/LanguageContext";

export const usePlaylists = () => {
  const { language } = useLanguage();
  return [
    {
      key: "all",
      title: language === "fr" ? "Toutes" : "All",
      icon: "pi pi-list",
      description: language === "fr" ? "Toutes les vidéos" : "All videos",
      borderClass: "border-gray-500/40",
      accentClass: "text-gray-300",
      accentBarClass: "bg-gray-500/60",
      glowClass: "shadow-gray-500/20",
      hoverClass: "hover:border-gray-700/70 hover:bg-gray-500/10",
    },
    {
      key: "favorites",
      title: language === "fr" ? "Mes favoris" : "My favorites",
      icon: "pi pi-heart-fill",
      description: language === "fr" ? "Vidéos que vous avez ajoutées à vos favoris" : "Videos that you have added to your favorites",
      borderClass: "border-green-500/40",
      accentClass: "text-green-300",
      accentBarClass: "bg-green-500/60",
      glowClass: "shadow-green-500/20",
      hoverClass: "hover:border-green-700/70 hover:bg-green-500/10",
    },
    {
      key: "watch_later",
      title: language === "fr" ? "À voir plus tard" : "Watch later",
      icon: "pi pi-clock",
      description: language === "fr" ? "Vidéos sauvegardées pour visionner plus tard" : "Videos saved to watch later",
      borderClass: "border-blue-500/40",
      accentClass: "text-blue-300",
      accentBarClass: "bg-blue-500/60",
      glowClass: "shadow-blue-500/20",
      hoverClass: "hover:border-blue-700/70 hover:bg-blue-500/10",
    },
    {
      key: "report",
      title: language === "fr" ? "Signalées" : "Reported",
      icon: "pi pi-flag",
      description: language === "fr" ? "Contenus que vous avez signalés" : "Contents that you have reported",
      borderClass: "border-red-500/40",
      accentClass: "text-red-300",
      accentBarClass: "bg-red-500/60",
      glowClass: "shadow-red-500/20",
      hoverClass: "hover:border-red-700/70 hover:bg-red-500/10",
    },
  ];
};
