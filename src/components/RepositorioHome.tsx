import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ─── Tipos ──
interface AccionRow {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  desc: string;
  top?: boolean;
  onClick?: () => void;
}

// ─── Íconos SVG inline ──
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

// ─── Sub-componente: fila de acción ──
function ActionRow({ icon, iconBg, title, desc, top, onClick }: AccionRow) {
  return (
    <button
      onClick={onClick}
      className="grama-card flex items-center gap-3.5 w-full text-left p-4 cursor-pointer"
      style={{
        background: top ? "hsl(var(--g-pale))" : undefined,
        borderColor: top ? "rgba(2,212,126,0.35)" : undefined,
      }}
    >
      <div className="w-[38px] h-[38px] rounded-ds-md flex items-center justify-center flex-shrink-0" style={{ background: iconBg }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-secondary mb-0.5 leading-snug">{title}</div>
        <div className="text-[11.5px] text-muted-foreground leading-relaxed">{desc}</div>
      </div>
      <span className="text-xl leading-none flex-shrink-0 transition-colors"
        style={{ color: top ? "#02d47e" : "hsl(var(--dk-border))" }}>›</span>
    </button>
  );
}

// ─── COMPONENTE PRINCIPAL ──
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
    { icon: <IconGrid />, iconBg: "var(--success-bg)", title: "Ver todo sobre un equipo", desc: "Videos · Manual · Mantenimiento · IPERC · Proveedor", top: true, onClick: onVerTodo },
    { icon: <IconVideo />, iconBg: "hsl(var(--g-pale))", title: "Ver videos de uso", desc: "Cómo operar el equipo, paso a paso en video", onClick: () => onFiltrar("VIDEO") },
    { icon: <IconDoc />, iconBg: "hsl(var(--tag-3d-bg))", title: "Manual de uso", desc: "Instrucciones para operar correctamente", onClick: () => onFiltrar("MANUAL") },
    { icon: <IconShield />, iconBg: "var(--danger-bg)", title: "Ficha IPERC", desc: "Riesgos, peligros y protocolos de seguridad", onClick: () => onFiltrar("IPERC") },
    { icon: <IconWrench />, iconBg: "var(--warning-bg)", title: "Manual de mantenimiento", desc: "Reparación, limpieza y mantenimiento preventivo", onClick: () => onFiltrar("MANTENIMIENTO") },
    { icon: <IconCard />, iconBg: "var(--info-bg)", title: "Ficha de proveedor", desc: "Especificaciones técnicas, modelo y garantía", onClick: () => onFiltrar("PROVEEDOR") },
  ];

  return (
    <div className="font-brand min-h-full">

      {/* ── HERO COMPACTO ── */}
      <section className="grama-hero" style={{ padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,4rem)" }}>

        <div className="max-w-[720px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-2">
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <span className="grama-breadcrumb grama-breadcrumb-muted" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              {tallerNombre}
            </span>
            <span className="text-white/20 text-[0.7rem]">›</span>
            <span className="grama-breadcrumb grama-breadcrumb-active" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              Repositorio
            </span>
          </div>

          {/* Título */}
          <h1 className="font-extrabold text-white leading-[1.05] mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", letterSpacing: "-0.03em" }}>
            ¿Qué equipo buscas <span className="text-g-mint">hoy</span>?
          </h1>
          <p className="text-[0.9rem] text-white/55 leading-relaxed max-w-[480px] mb-7">
            Escribe el nombre del equipo o elige una acción rápida.
          </p>

          {/* Buscador */}
          <div className="flex items-center gap-2.5 bg-white/[0.06] border-[1.5px] border-g-mint/25 rounded-ds-pill px-5 py-3 transition-colors focus-within:border-g-mint">
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
              className="flex-1 bg-transparent border-none outline-none font-brand text-sm text-white placeholder:text-white/30"
            />
            <button onClick={handleBuscar}
              className="grama-btn-primary text-xs py-2 px-5 flex-shrink-0 hover:opacity-85 transition-opacity">
              Buscar
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-10 pt-6 mt-6 border-t border-white/[0.07]">
            {[
              { val: String(totalBienes), label: "Equipos" },
              { val: "6",  label: "Tipos de recurso" },
              { val: "3",  label: "Zonas" },
            ].map(s => (
              <div key={s.label}>
                <div className="grama-stat-val">{s.val}</div>
                <div className="grama-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACCIONES ── */}
      <div style={{ background: "#f7fdfb", padding: "clamp(2rem,4vw,3rem) clamp(1.5rem,5vw,4rem) clamp(2.5rem,5vw,3.5rem)" }}>
        <div className="max-w-[720px] mx-auto">
          <div className="text-[10px] font-bold tracking-widest uppercase text-secondary/40 mb-3">
            ¿Qué necesitas hacer?
          </div>

          <div className="flex flex-col gap-2">
            {ACCIONES.map((accion) => (
              <ActionRow key={accion.title} {...accion} />
            ))}
          </div>

          <div className="text-center mt-8 text-[11px] text-secondary/25 tracking-wide">
            {totalBienes} equipos · {tallerNombre} · GRAMA 2026
          </div>
        </div>
      </div>
    </div>
  );
}

export default RepositorioHome;
