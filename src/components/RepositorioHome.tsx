import { useState } from "react";

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
    <div style={{
      fontFamily: "'Manrope', sans-serif",
      background: "#f7fdfb",
      minHeight: "100%",
      display: "flex",
    }}>
      {/* ── Columna izquierda: contenido ────────────────────── */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        overflow: "auto",
      }}>
        <div style={{
          maxWidth: 580,
          width: "100%",
          padding: "48px 36px 48px 44px",
        }}>
          {/* Label superior */}
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
            textTransform: "uppercase" as const, color: "#02d47e", marginBottom: 8,
          }}>
            Repositorio · {tallerNombre}
          </div>

          {/* Título */}
          <h1 style={{
            fontSize: 30, fontWeight: 800, color: "#043941",
            lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: 10,
          }}>
            ¿Qué equipo<br />
            buscas <span style={{ color: "#02d47e" }}>hoy</span>?
          </h1>

          {/* Subtítulo */}
          <p style={{
            fontSize: 14, color: "#4a5568", lineHeight: 1.6, marginBottom: 32,
          }}>
            Escribe el nombre del equipo o elige una acción rápida.
          </p>

          {/* Buscador */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: "#fff", border: "2px solid rgba(2,212,126,0.3)",
            borderRadius: 100, padding: "12px 18px", marginBottom: 36,
            transition: "border-color 0.2s",
          }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "#02d47e")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(2,212,126,0.3)")}
          >
            <IconSearch />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              style={{
                flex: 1, background: "none", border: "none", outline: "none",
                fontFamily: "'Manrope', sans-serif", fontSize: 14, color: "#043941",
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

          {/* Label acciones */}
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase" as const, color: "#8fa3a8", marginBottom: 12,
          }}>
            ¿Qué necesitas hacer?
          </div>

          {/* Lista de acciones */}
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
            {ACCIONES.map((accion) => (
              <ActionRow key={accion.title} {...accion} />
            ))}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: "center" as const, marginTop: 32,
            fontSize: 11, color: "#c9d8d8", letterSpacing: "0.02em",
          }}>
            {totalBienes} equipos · {tallerNombre} · GRAMA 2026
          </div>
        </div>
      </div>

      {/* ── Columna derecha: slide de imágenes ─────────────── */}
      {images.length > 0 && (
        <div style={{
          width: 280,
          flexShrink: 0,
          opacity: 0.55,
          padding: "16px 16px 16px 0",
        }}>
          <RepositorioImageSlide images={images} tallerNombre={tallerNombre} />
        </div>
      )}
    </div>
  );
}

export default RepositorioHome;
