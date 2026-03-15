import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface AccionRow {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  top?: boolean;
  onClick?: () => void;
}

// ─── Íconos SVG inline ────────────────────────────────────────────────────────
const IconGrid = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="2" width="9" height="9" rx="2" stroke="#02d47e" strokeWidth="1.8"/>
    <rect x="13" y="2" width="9" height="9" rx="2" stroke="#02d47e" strokeWidth="1.8"/>
    <rect x="2" y="13" width="9" height="9" rx="2" stroke="#02d47e" strokeWidth="1.8"/>
    <rect x="13" y="13" width="9" height="9" rx="2" stroke="#02d47e" strokeWidth="1.8"/>
  </svg>
);

const IconVideo = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="5" width="20" height="14" rx="3" stroke="#045f6c" strokeWidth="1.8"/>
    <path d="M10 9.5l5 2.5-5 2.5V9.5z" fill="#045f6c"/>
  </svg>
);

const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" stroke="#5b21b6" strokeWidth="1.8"/>
    <path d="M8 8h8M8 12h8M8 16h5" stroke="#5b21b6" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7L12 3z" stroke="#991b1b" strokeWidth="1.8" strokeLinejoin="round"/>
    <path d="M9 12l2 2 4-4" stroke="#991b1b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconWrench = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a5 5 0 0 1-7 7l-6.5 6.5a2.1 2.1 0 0 1-3-3L9.7 9.7A5 5 0 0 1 17 3z" stroke="#c2410c" strokeWidth="1.8" strokeLinejoin="round"/>
  </svg>
);

const IconCard = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="#1d4ed8" strokeWidth="1.8"/>
    <path d="M7 8h10M7 12h7M7 16h5" stroke="#1d4ed8" strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="#8fa3a8" strokeWidth="1.5"/>
    <path d="M10 10L14 14" stroke="#8fa3a8" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

// ─── Sub-componente: fila de acción ──────────────────────────────────────────
function ActionRow({ icon, iconBg, title, desc, top, onClick }: AccionRow) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        background: top
          ? hovered ? "#d2ffe1" : "#e3f8fb"
          : hovered ? "#f0fdf8" : "#fff",
        border: `1.5px solid ${
          top
            ? hovered ? "rgba(2,212,126,0.5)" : "rgba(2,212,126,0.35)"
            : hovered ? "#02d47e" : "rgba(4,57,65,0.08)"
        }`,
        borderRadius: 14,
        padding: "15px 18px",
        cursor: "pointer",
        transition: "all 0.18s",
        transform: hovered ? "translateX(3px)" : "translateX(0)",
        textAlign: "left",
        fontFamily: "'Manrope', sans-serif",
      }}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, background: iconBg,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#043941", marginBottom: 2, lineHeight: 1.3 }}>
          {title}
        </div>
        <div style={{ fontSize: 11.5, color: "#4a5568", lineHeight: 1.5 }}>
          {desc}
        </div>
      </div>
      <span style={{
        fontSize: 20, color: top || hovered ? "#02d47e" : "#c9d8d8",
        fontWeight: 300, transition: "color 0.15s", lineHeight: 1, flexShrink: 0,
      }}>›</span>
    </button>
  );
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
interface RepositorioHomeProps {
  tallerNombre: string;
  tallerSlug: string;
  totalBienes: number;
  tallerAccent?: string;
  onBuscar: (query: string) => void;
  onVerTodo: () => void;
  onFiltrar: (tipo: string) => void;
}

export function RepositorioHome({
  tallerNombre,
  tallerSlug,
  totalBienes,
  onBuscar,
  onVerTodo,
  onFiltrar,
}: RepositorioHomeProps) {
  const [query, setQuery] = useState("");

  const handleBuscar = () => {
    if (query.trim()) onBuscar(query.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBuscar();
  };

  const placeholder = "Ej: pasteurizadora, balanza, torno…";

  const ACCIONES: AccionRow[] = [
    {
      icon: <IconGrid />, iconBg: "#d2ffe1",
      title: "Ver todo sobre un equipo",
      desc: "Videos · Manual · Mantenimiento · IPERC · Proveedor",
      top: true, onClick: onVerTodo,
    },
    {
      icon: <IconVideo />, iconBg: "#e3f8fb",
      title: "Ver videos de uso",
      desc: "Cómo operar el equipo, paso a paso en video",
      onClick: () => onFiltrar("VIDEO"),
    },
    {
      icon: <IconDoc />, iconBg: "#f5f3ff",
      title: "Manual de uso",
      desc: "Instrucciones para operar correctamente",
      onClick: () => onFiltrar("MANUAL"),
    },
    {
      icon: <IconShield />, iconBg: "#fef2f2",
      title: "Ficha IPERC",
      desc: "Riesgos, peligros y protocolos de seguridad",
      onClick: () => onFiltrar("IPERC"),
    },
    {
      icon: <IconWrench />, iconBg: "#fff7ed",
      title: "Manual de mantenimiento",
      desc: "Reparación, limpieza y mantenimiento preventivo",
      onClick: () => onFiltrar("MANTENIMIENTO"),
    },
    {
      icon: <IconCard />, iconBg: "#eff6ff",
      title: "Ficha de proveedor",
      desc: "Especificaciones técnicas, modelo y garantía",
      onClick: () => onFiltrar("PROVEEDOR"),
    },
  ];

  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", minHeight: "100%" }}>

      {/* ── HERO COMPACTO ──────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,4rem)",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Fondo decorativo */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: 720, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              {tallerNombre}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>›</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#02d47e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Repositorio
            </span>
          </div>

          {/* Título */}
          <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            ¿Qué equipo buscas <span style={{ color: "#02d47e" }}>hoy</span>?
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, marginBottom: "1.75rem" }}>
            Escribe el nombre del equipo o elige una acción rápida.
          </p>

          {/* Buscador */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "rgba(255,255,255,0.06)", border: "1.5px solid rgba(2,212,126,0.25)",
            borderRadius: 100, padding: "12px 18px",
            transition: "border-color 0.2s",
          }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#02d47e")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(2,212,126,0.25)")}
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
              <path d="M10 10L14 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#fff",
              }}
            />
            <button
              onClick={handleBuscar}
              style={{
                background: "#02d47e", border: "none", borderRadius: 100,
                padding: "8px 18px", fontFamily: "'Manrope', sans-serif",
                fontWeight: 700, fontSize: 12, color: "#043941",
                cursor: "pointer", transition: "opacity 0.15s", flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              Buscar
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2.5rem", paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { val: String(totalBienes), label: "Equipos" },
              { val: "6",  label: "Tipos de recurso" },
              { val: "3",  label: "Zonas" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCIONES ───────────────────────────────────────────── */}
      <div style={{ background: "#f7fdfb", padding: "clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,3.5rem)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase" as const, color: "#8fa3a8", marginBottom: 12,
          }}>
            ¿Qué necesitas hacer?
          </div>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {ACCIONES.map((accion) => (
              <ActionRow key={accion.title} {...accion} />
            ))}
          </div>

          <div style={{
            textAlign: "center" as const, marginTop: 32,
            fontSize: 11, color: "#c9d8d8", letterSpacing: "0.02em",
          }}>
            {totalBienes} equipos · {tallerNombre} · GRAMA 2026
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositorioHome;
