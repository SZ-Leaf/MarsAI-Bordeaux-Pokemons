import { useEffect, useState } from "react";
import { apiCall } from "../../utils/api.js";
import "../styles/main.css";

export default function Sponsors() {
  const [sponsors, setSponsors] = useState([]);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const res = await apiCall("/api/sponsors");
        setSponsors(res.data.sponsors);
      } catch (error) {
        console.error("Erreur fetch sponsors :", error);
      }
    };
    fetchSponsors();
  }, []);

  if (!sponsors.length) return null;

  const half = Math.ceil(sponsors.length / 2);
  const firstRow = sponsors.slice(0, half);
  const secondRow = sponsors.slice(half);

  return (
    /* gap-2 rapproche les deux bannières verticalement */
    <div className="bg-gray-900 py-8 flex flex-col gap-2">

      {/* BANNIÈRE HAUT */}
      <div className="marquee-container">
        {[1, 2].map((i) => (
          <div key={`top-${i}`} className="marquee-content-left">
            {firstRow.map((sponsor) => (
              <a
                key={`${i}-${sponsor.id}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-8 transition-transform duration-300 hover:scale-110 hover:z-10"
              >
                <img
                  src={`http://localhost:3000${sponsor.cover}`}
                  alt={sponsor.name}
                  className="h-12 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        ))}
      </div>

      {/* BANNIÈRE BAS */}
      <div className="marquee-container">
        {[1, 2].map((i) => (
          <div key={`bottom-${i}`} className="marquee-content-right">
            {secondRow.map((sponsor) => (
              <a
                key={`${i}-${sponsor.id}`}
                href={sponsor.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mx-8 transition-transform duration-300 hover:scale-110 hover:z-10"
              >
                <img
                  src={`http://localhost:3000${sponsor.cover}`}
                  alt={sponsor.name}
                  className="h-12 w-auto object-contain"
                />
              </a>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
