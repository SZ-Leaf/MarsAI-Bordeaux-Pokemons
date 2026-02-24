import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router";
import { confirmReservation } from "../services/event.service";

function getMessage(err) {
  const m = err?.message;
  if (typeof m === "string") return m;
  if (m && typeof m === "object" && (m.fr || m.en)) return m.fr || m.en;
  return "Une erreur est survenue lors de la confirmation de votre réservation.";
}

const NO_TOKEN_STATE = { status: "error", message: "Lien invalide ou expiré." };
const LOADING_STATE = { status: "loading", message: "" };

export default function ReservationConfirm() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const successRef = useRef(false);

  const [state, setState] = useState(() =>
    token ? LOADING_STATE : NO_TOKEN_STATE
  );

  useEffect(() => {
    if (!token) return;
    confirmReservation(token)
      .then(() => {
        successRef.current = true;
        setState({
          status: "success",
          message:
            "Votre réservation est confirmée. Merci et à très bientôt sur MarsAI !",
        });
      })
      .catch((err) => {
        if (successRef.current) return;
        setState({ status: "error", message: getMessage(err) });
      });
  }, [token]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {state.status === "loading" && (
          <p style={{ color: "var(--color-white)", opacity: 0.9 }}>
            Confirmation de votre réservation en cours...
          </p>
        )}
        {state.status === "success" && (
          <>
            <p
              style={{
                color: "var(--color-green)",
                fontSize: "1.125rem",
                marginBottom: "1.5rem",
              }}
            >
              {state.message}
            </p>
            <Link
              to="/events"
              style={{
                color: "var(--color-blue)",
                textDecoration: "underline",
              }}
            >
              Retour aux événements
            </Link>
          </>
        )}
        {state.status === "error" && (
          <>
            <p
              style={{
                color: "var(--color-red)",
                fontSize: "1.125rem",
                marginBottom: "1.5rem",
              }}
            >
              {state.message}
            </p>
            <Link
              to="/events"
              style={{
                color: "var(--color-blue)",
                textDecoration: "underline",
              }}
            >
              Retour aux événements
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

