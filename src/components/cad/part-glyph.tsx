import type { PartKind } from "@/lib/cad/types";

export function PartGlyph({ kind, className }: { kind: PartKind; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <rect width="48" height="48" rx="8" fill="currentColor" opacity="0.06" />
      {glyph(kind)}
    </svg>
  );
}

function glyph(kind: PartKind) {
  const stroke = "currentColor";
  switch (kind) {
    case "hex-bolt":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <polygon points="24,8 32,12 32,20 24,24 16,20 16,12" />
          <rect x="21" y="23" width="6" height="16" rx="1" />
        </g>
      );
    case "hex-nut":
      return <polygon points="24,10 34,16 34,28 24,34 14,28 14,16" fill="none" stroke={stroke} strokeWidth="1.6" />;
    case "washer":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <ellipse cx="24" cy="24" rx="14" ry="8" />
          <ellipse cx="24" cy="24" rx="6" ry="3.4" />
        </g>
      );
    case "standoff":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <rect x="18" y="14" width="12" height="20" />
          <path d="M24 8v6M24 34v6" />
        </g>
      );
    case "shaft":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <rect x="8" y="20" width="32" height="8" rx="4" />
        </g>
      );
    case "block":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <path d="M10 18 L24 12 L38 18 L38 32 L24 38 L10 32 Z" />
          <path d="M24 12 V38" />
        </g>
      );
    case "plate":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <rect x="8" y="16" width="32" height="16" rx="2" />
          <circle cx="14" cy="24" r="2" />
          <circle cx="34" cy="24" r="2" />
        </g>
      );
    case "pipe":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <ellipse cx="14" cy="24" rx="5" ry="8" />
          <path d="M14 16 H34 M14 32 H34" />
          <ellipse cx="34" cy="24" rx="5" ry="8" />
        </g>
      );
    case "hex-bar":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <polygon points="16,18 24,14 32,18 32,30 24,34 16,30" />
        </g>
      );
    case "angle-bar":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <path d="M14 12 V36 H36" />
          <path d="M18 12 V32 H36" />
        </g>
      );
    case "l-bracket":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <path d="M12 14 H30 V20 H20 V36 H12 Z" />
        </g>
      );
    case "flange":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <circle cx="24" cy="24" r="13" />
          <circle cx="24" cy="24" r="5" />
          <circle cx="24" cy="12.5" r="1.4" fill={stroke} />
          <circle cx="24" cy="35.5" r="1.4" fill={stroke} />
          <circle cx="12.5" cy="24" r="1.4" fill={stroke} />
          <circle cx="35.5" cy="24" r="1.4" fill={stroke} />
        </g>
      );
    case "spur-gear":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <circle cx="24" cy="24" r="7" />
          <path d="M24 10 v4 M24 34 v4 M10 24 h4 M34 24 h4 M13.5 13.5 l3 3 M31.5 31.5 l3 3 M13.5 34.5 l3-3 M31.5 16.5 l3-3" />
        </g>
      );
    case "bearing":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <circle cx="24" cy="24" r="12" />
          <circle cx="24" cy="24" r="5" />
          <circle cx="24" cy="15" r="2" />
          <circle cx="32" cy="24" r="2" />
          <circle cx="24" cy="33" r="2" />
          <circle cx="16" cy="24" r="2" />
        </g>
      );
    case "pulley":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <ellipse cx="24" cy="18" rx="12" ry="6" />
          <path d="M12 18 V30" />
          <path d="M36 18 V30" />
          <ellipse cx="24" cy="30" rx="12" ry="6" />
        </g>
      );
    case "coupling":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <rect x="10" y="18" width="12" height="12" rx="2" />
          <rect x="26" y="18" width="12" height="12" rx="2" />
          <path d="M22 24 H26" />
        </g>
      );
    case "spring":
      return (
        <g fill="none" stroke={stroke} strokeWidth="1.6">
          <path d="M16 12 c8 0 8 6 0 6 s-8 6 0 6 8 6 0 6 8 6 0 6" />
        </g>
      );
    default:
      return <rect x="14" y="14" width="20" height="20" fill="none" stroke={stroke} strokeWidth="1.6" />;
  }
}
