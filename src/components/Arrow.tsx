export function Arrow({ external = false }: { external?: boolean }) {
  return (
    <svg className={external ? "arr ext" : "arr"} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={external ? "M5 11L11 5M6 5h5v5" : "M2 8h11M9 4l4 4-4 4"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
