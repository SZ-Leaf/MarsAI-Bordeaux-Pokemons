export default function JuryCover({
  jury,
  aspect = "aspect-[3/4]",
  showOverlay = true,
}) {
  const img = jury?.cover
    ? `/${String(jury.cover).replace(/^\/+/, "")}`
    : null;

  const name = `${jury?.firstname || ""} ${jury?.lastname || ""}`.trim();

  return (
    <div className={`card relative ${aspect}`}>
      {img && (
        <img
          src={img}
          alt={name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}

      {showOverlay && (
        <>
          <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-md px-4 py-7">
            <h3 className="truncate text-sm font-semibold text-white">
              {name || "—"}
            </h3>
            <p className="truncate text-xs text-white/80">
              {jury?.job || "Activité non renseignée"}
            </p>
          </div>

          <div className="pointer-events-none absolute bottom-full left-0 right-0 h-10 bg-gradient-to-t from-black/40 to-transparent" />
        </>
      )}
    </div>
  );
}