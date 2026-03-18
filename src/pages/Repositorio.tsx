import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import {
  getBienesByTaller,
  getZonasUnicasByTaller,
  getTotalBienesByTaller,
} from "@/data/bienesData";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ── Acción rápida ──
function ActionCard({
  icon, name, desc, featured = false, tags, onClick,
}: {
  icon: React.ReactNode; name: string; desc?: string;
  featured?: boolean; tags?: { label: string; bg: string; color: string }[];
  onClick: () => void;
}) {
  return (
    <button
      className="grama-card p-4 cursor-pointer text-left w-full"
      style={{
        background: featured ? "hsl(var(--g-pale))" : undefined,
        borderColor: featured ? "rgba(2,212,126,0.25)" : undefined,
        display: "flex",
        flexDirection: featured ? "row" : "column",
        alignItems: featured ? "center" : "flex-start",
        gap: featured ? "1rem" : "0.5rem",
        gridColumn: featured ? "span 2" : undefined,
      }}
      onClick={onClick}
    >
      {icon}
      <div className="flex-1">
        <div className="text-[0.88rem] font-bold text-secondary leading-tight" style={{ marginBottom: tags ? "0.4rem" : 0 }}>{name}</div>
        {desc && <div className="text-[0.73rem] text-secondary/50 leading-snug">{desc}</div>}
        {tags && (
          <div className="flex gap-1 flex-wrap mt-1">
            {tags.map(t => (
              <span key={t.label} className="text-[0.6rem] font-bold px-2 py-0.5 rounded-ds-pill" style={{ background: t.bg, color: t.color }}>{t.label}</span>
            ))}
          </div>
        )}
      </div>
      {featured && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#02d47e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      )}
    </button>
  );
}

// ── COMPONENTE PRINCIPAL ──
export default function Repositorio() {
  const { slug }   = useParams<{ slug: string }>();
  const navigate   = useNavigate();
  const [query, setQuery] = useState("");

  const taller      = getTallerBySlug(slug ?? "");
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const bienes      = useMemo(() => getBienesByTaller(slug ?? ""), [slug]);
  const zonasUnicas = useMemo(() => getZonasUnicasByTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Link to="/" className="text-g-mint font-bold no-underline">← Volver al Hub</Link>
      </div>
    );
  }

  const handleSearch = () => {
    if (query.trim()) navigate(`/taller/${slug}/repositorio?q=${encodeURIComponent(query)}`);
  };

  const equiposDestacados = bienes.slice(0, 7);

  const acciones = [
    {
      icon: (
        <div className="w-9 h-9 rounded-ds-md bg-g-mint/15 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#02d47e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
        </div>
      ),
      name: "Ver todo sobre un equipo",
      featured: true,
      tags: [
        { label: "Videos", bg: "rgba(2,212,126,0.12)", color: "#02d47e" },
        { label: "Manual", bg: "rgba(4,57,65,0.07)", color: "#045f6c" },
        { label: "Mantenimiento", bg: "rgba(249,115,22,0.1)", color: "#f97316" },
        { label: "IPERC", bg: "rgba(239,68,68,0.1)", color: "#ef4444" },
      ],
      onClick: () => navigate(`/taller/${slug}/catalogo`),
    },
    {
      icon: (
        <div className="w-9 h-9 rounded-ds-md bg-g-mint/10 flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c16e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </div>
      ),
      name: "Videos de uso", desc: "Operación paso a paso en video",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=video`),
    },
    {
      icon: (
        <div className="w-9 h-9 rounded-ds-md bg-secondary/[0.07] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#045f6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
      ),
      name: "Manual de uso", desc: "Instrucciones de operación correcta",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=manual`),
    },
    {
      icon: (
        <div className="w-9 h-9 rounded-ds-md bg-destructive/[0.08] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7L12 3z"/></svg>
        </div>
      ),
      name: "Ficha IPERC", desc: "Riesgos, peligros y seguridad",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=iperc`),
    },
    {
      icon: (
        <div className="w-9 h-9 rounded-ds-md bg-t1/[0.09] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        </div>
      ),
      name: "Manual de mantenimiento", desc: "Reparación y limpieza preventiva",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=mantenimiento`),
    },
    {
      icon: (
        <div className="w-9 h-9 rounded-ds-md bg-secondary/[0.07] flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#043941" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
        </div>
      ),
      name: "Ficha de proveedor", desc: "Especificaciones, modelo y garantía",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=proveedor`),
    },
  ];

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="text-[0.67rem] font-bold tracking-widest uppercase text-secondary/45 mb-3">
      {children}
    </div>
  );

  return (
    <main className="grama-page-white">

      {/* ── HERO ── */}
      <section className="grama-hero" style={{ padding: "2.25rem clamp(1.5rem,4vw,2.5rem) 2rem" }}>

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} className="grama-breadcrumb grama-breadcrumb-muted no-underline">{taller.nombre}</Link>
            <span className="text-white/20 text-[0.68rem]">›</span>
            <span className="grama-breadcrumb grama-breadcrumb-active">Repositorio del Taller</span>
          </div>

          {/* Título + Buscador en 2 columnas */}
          <div className="grid grid-cols-2 gap-8 items-center mb-6">
            <div>
              <h1 className="font-extrabold text-white leading-none mb-2" style={{ fontSize: "clamp(1.9rem,3vw,2.5rem)", letterSpacing: "-0.03em" }}>
                ¿Qué equipo<br />buscas <span className="text-g-mint">hoy?</span>
              </h1>
              <p className="text-[0.85rem] text-white/50 leading-relaxed">
                Encuentra fichas, videos, manuales e IPERC de cada equipo del taller.
              </p>
            </div>
            <div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Ej. elevador hidráulico, escáner OBD2..."
                  className="flex-1 bg-white/10 border-[1.5px] border-white/15 rounded-ds-pill py-3 px-5 text-[0.88rem] text-white font-brand outline-none placeholder:text-white/30 focus:border-g-mint/50"
                />
                <button onClick={handleSearch} className="grama-btn-primary text-[0.85rem] py-3 px-6 whitespace-nowrap">
                  Buscar
                </button>
              </div>
              <div className="text-[0.7rem] text-white/30 mt-2 pl-1">
                Prueba: "frenos", "suspensión", "motor"
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8 flex-wrap pt-5 border-t border-white/[0.07]">
            {[
              { val: String(totalBienes || bienes.length), label: "Bienes totales" },
              { val: "6",                                   label: "Tipos de recurso" },
              { val: String(data.inventoryZones.length),    label: "Zonas del taller" },
              { val: "+300",                                label: "Recursos disponibles" },
            ].map(s => (
              <div key={s.label}>
                <div className="grama-stat-val" style={{ fontSize: "1.4rem" }}>{s.val}</div>
                <div className="grama-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <div style={{ padding: "2rem clamp(1.5rem,4vw,2.5rem)" }} className="flex flex-col gap-6">

        {/* 2 columnas: acciones | zonas */}
        <div className="grid gap-5 items-start" style={{ gridTemplateColumns: "1.1fr 0.9fr" }}>

          {/* Acciones rápidas */}
          <div>
            <SectionLabel>¿Qué necesitas hacer?</SectionLabel>
            <div className="grid grid-cols-2 gap-2.5">
              {acciones.map((a, i) => (
                <div key={i} style={{ gridColumn: a.featured ? "span 2" : undefined }}>
                  <ActionCard {...a} />
                </div>
              ))}
            </div>
          </div>

          {/* Zonas del taller */}
          <div>
            <SectionLabel>Explorar por zona</SectionLabel>
            <div className="flex flex-col gap-2.5">
              {data.inventoryZones.map((zone, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/taller/${slug}/repositorio?zona=${encodeURIComponent(zone.name)}`)}
                  className="grama-card p-4 cursor-pointer flex items-center gap-3.5"
                >
                  <div className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${data.tallerAccent}15` }}>
                    {zone.icon}
                  </div>
                  <div className="flex-1">
                    <div className="text-[0.88rem] font-bold text-secondary mb-0.5">{zone.name}</div>
                    <div className="text-[0.72rem] text-secondary/50 leading-snug">{zone.desc}</div>
                  </div>
                  <div className="bg-g-light text-secondary text-[0.68rem] font-bold px-2.5 py-0.5 rounded-ds-pill flex-shrink-0 whitespace-nowrap">
                    {zone.count} bienes
                  </div>
                  <span className="text-secondary/25 text-[0.85rem] ml-1 flex-shrink-0">›</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── CTA CATÁLOGO COMPLETO ── */}
        <div className="grama-cta-bar">
          <div className="flex gap-3 items-center">
            <span className="text-2xl">📦</span>
            <div>
              <div className="text-[0.95rem] font-bold text-white mb-0.5">Catálogo completo del taller</div>
              <div className="text-[0.77rem] text-white/50">
                Accede a los {totalBienes || bienes.length} bienes con filtros por zona, tipo de recurso y nombre del equipo.
              </div>
            </div>
          </div>
          <button onClick={() => navigate(`/taller/${slug}/repositorio`)} className="grama-btn-primary text-[0.82rem] py-3 px-7 whitespace-nowrap">
            Ver catálogo completo →
          </button>
        </div>

      </div>
    </main>
  );
}
