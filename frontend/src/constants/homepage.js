import { Play, Users, Award, Target, Zap, Rocket } from 'lucide-react';

// --- Page Data ---

export const getFEATURES = (language) => [
   { title: language === 'fr' ? "1 MINUTE" : "1 MINUTE",
      description: language === 'fr' ? "FORMAT ULTRA-COURT POUR UN IMPACT MAXIMUM." : "MAXIMUM IMPACT WITH ULTRA-SHORT FORMAT.",
      className: "card-purple" 
   },
   { title: language === 'fr' ? "GRATUITÉ" : "FREE",
      description: language === 'fr' ? "CONFÉRENCES ET WORKSHOPS ACCESSIBLES." : "ACCESSIBLE CONFERENCES AND WORKSHOPS.", className: "card-green"
   },
   { title: language === 'fr' ? "POUR TOUS" : "FOR ALL",
      description: language === 'fr' ? "PROFESSIONNELS, ÉTUDIANTS ET CURIEUX." : "PROFESSIONALS, STUDENTS AND CURIOUS.", className: "card-pink"
   },
   { title: language === 'fr' ? "EXPERTISE" : "EXPERTISE",
      description: language === 'fr' ? "LEADERS MONDIAUX DE L'IA GÉNÉRATIVE." : "GLOBAL LEADERS OF GENERATIVE AI.",
      className: "card-blue"
   }
];
 
export const getFILMS = (language) => [
   { title: language === 'fr' ? "PROTOCOL ALPHA" : "PROTOCOL ALPHA", director: language === 'fr' ? "DIR. STARK" : "DIR. STARK",
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop" },
   { title: language === 'fr' ? "NEURAL DREAM" : "NEURAL DREAM", director: language === 'fr' ? "DIR. VANCE" : "DIR. VANCE", image: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop" },
   { title: language === 'fr' ? "CYBER MARSEILLE" : "CYBER MARSEILLE", director: language === 'fr' ? "DIR. LUPIN" : "DIR. LUPIN", image: "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?q=80&w=1000&auto=format&fit=crop" }
];
 
export const getSTATS = (language) => [
   { title: language === 'fr' ? "2 MOIS" : "2 MONTHS", subtitle: language === 'fr' ? "DE PRÉPARATION" : "PREPARATION", color: "text-purple-500", borderClass: "border-purple" },
   { title: language === 'fr' ? "50 FILMS" : "50 FILMS", subtitle: language === 'fr' ? "EN SÉLECTION" : "IN SELECTION", color: "text-emerald-400", borderClass: "border-emerald" },
   { title: language === 'fr' ? "WEB 3.0" : "WEB 3.0", subtitle: language === 'fr' ? "EXPÉRIENCE" : "EXPERIENCE", color: "text-pink-500", borderClass: "border-pink" },
   { title: language === 'fr' ? "J4" : "J4", subtitle: language === 'fr' ? "MARSEILLE" : "MARSEILLE", color: "text-cyan-400", borderClass: "border-cyan" }
];
 
export const getCONFERENCES = (language) => [
   { title: language === 'fr' ? "PROJECTIONS" : "PROJECTIONS", description: language === 'fr' ? "Diffusion sur écran géant en présence des réalisateurs." : "Diffusion on giant screen in presence of directors.", icon: Play },
   { title: language === 'fr' ? "WORKSHOPS" : "WORKSHOPS", description: language === 'fr' ? "Sessions pratiques pour maîtriser les outils IA." : "Practical sessions to master AI tools.", icon: Users },
   { title: language === 'fr' ? "AWARDS" : "AWARDS", description: language === 'fr' ? "Cérémonie de clôture récompensant l'audace." : "Closing ceremony rewarding audacity.", icon: Award }
];
 
export const getOBJECTIVES = (language) => [
   {
     title: language === 'fr' ? "L'HUMAIN AU CENTRE" : "L'HUMAIN AU CENTRE",
     description: language === 'fr' ? "METTRE L'HUMAIN AU CŒUR DE LA CRÉATION POUR NE PAS PERDRE L'ÉMOTION." : "PUT THE HUMAN AT THE HEART OF CREATION TO NOT LOSE THE EMOTION.",
     icon: Target,
     color: "text-emerald-400",
     bgColor: "bg-emerald-400/10",
     borderClass: "border-emerald"
   },
   {
     title: language === 'fr' ? "CHALLENGE CRÉATIF" : "CREATIVE CHALLENGE",
     description: language === 'fr' ? "CHALLENGER LA CRÉATIVITÉ GRÂCE À UN FORMAT ULTRA-COURT DE 60S." : "CHALLENGE CREATIVITY WITH AN ULTRA-SHORT FORMAT OF 60S.",
     icon: Zap,
     color: "text-blue-400",
     bgColor: "bg-blue-400/10",
     borderClass: "border-blue"
   },
   {
     title: language === 'fr' ? "FUTURS SOUHAITABLES" : "DESIRABLE FUTURES",
     description: language === 'fr' ? "EXPLORER LES FUTURS DÉSIRABLES VIA LES TECHNOLOGIES ÉMERGENTES." : "EXPLORE DESIRABLE FUTURES VIA EMERGING TECHNOLOGIES.",
     icon: Rocket,
     color: "text-purple-400",
     bgColor: "bg-purple-400/10",
     borderClass: "border-purple"
   }
];