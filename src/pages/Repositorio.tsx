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

// ── Tipos de recurso con color ────────────────────────────────────────────────
const RESOURCE_DOTS: Record<string, { color: string; label: string }> = {
  video:        { color: "#00c16e", label: "Video" },
  manual:       { color: "#045f6c", label: "Manual" },
  iperc:        { color: "#ef4444", label: "IPERC" },
  mantenimiento:{ color: "#f97316", label: "Mantenimiento" },
  proveedor:    { color: "#8b5cf6", label: "Proveedor" },
};

// ── Acción rápida ─────────────────────────────────────────────────────────────
function ActionCard({
  icon, name, desc, featured = false, tags, onClick,
}: {
  icon: React.ReactNode; name: string; desc?: string;
  featured?: boolean; tags?: { label: string; bg: string; color: string }[];
  onClick: () => void;
}) {
  const base: React.CSSProperties = {
    background: featured ? "#e3f8fb" : "#fff",
    border: `1.5px solid ${featured ? "rgba(2,212,126,0.25)" : "rgba(4,57,65,0.08)"}`,
    borderRadius: 13, padding: "1rem 1.1rem", cursor: "pointer",
    display: "flex", flexDirection: featured ? "row" : "column",
    alignItems: featured ? "center" : "flex-start",
    gap: featured ? "1rem" : "0.5rem",
    transition: "border-color .2s, transform .2s, box-shadow .2s",
    textAlign: "left", width: "100%", fontFamily: "'Manrope', sans-serif",
    gridColumn: featured ? "span 2" : undefined,
  };
  return (
    <button style={base} onClick={onClick}
      onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#02d47e"; el.style.transform = "translateY(-2px)"; el.style.boxShadow = "0 4px 16px rgba(2,212,126,0.1)"; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = featured ? "rgba(2,212,126,0.25)" : "rgba(4,57,65,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
    >
      {icon}
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#043941", lineHeight: 1.2, marginBottom: tags ? "0.4rem" : 0 }}>{name}</div>
        {desc && <div style={{ fontSize: "0.73rem", color: "rgba(4,57,65,0.5)", lineHeight: 1.4 }}>{desc}</div>}
        {tags && (
          <div style={{ display: "flex", gap: "0.3rem", flexWrap: "wrap" as const, marginTop: "0.25rem" }}>
            {tags.map(t => (
              <span key={t.label} style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 7px", borderRadius: 100, background: t.bg, color: t.color }}>{t.label}</span>
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

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
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
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  const handleSearch = () => {
    if (query.trim()) navigate(`/taller/${slug}/repositorio?q=${encodeURIComponent(query)}`);
  };

  // Equipos destacados — primeros 7 bienes únicos
  const equiposDestacados = bienes.slice(0, 7);

  const acciones = [
    {
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(2,212,126,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(2,212,126,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#00c16e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
        </div>
      ),
      name: "Videos de uso", desc: "Operación paso a paso en video",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=video`),
    },
    {
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(4,57,65,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#045f6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        </div>
      ),
      name: "Manual de uso", desc: "Instrucciones de operación correcta",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=manual`),
    },
    {
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3L4 7v5c0 5 4 9 8 10 4-1 8-5 8-10V7L12 3z"/></svg>
        </div>
      ),
      name: "Ficha IPERC", desc: "Riesgos, peligros y seguridad",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=iperc`),
    },
    {
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(249,115,22,0.09)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>
        </div>
      ),
      name: "Manual de mantenimiento", desc: "Reparación y limpieza preventiva",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=mantenimiento`),
    },
    {
      icon: (
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(4,57,65,0.07)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#043941" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>
        </div>
      ),
      name: "Ficha de proveedor", desc: "Especificaciones, modelo y garantía",
      onClick: () => navigate(`/taller/${slug}/repositorio?tipo=proveedor`),
    },
  ];

  const SectionLabel = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(4,57,65,0.45)", marginBottom: "0.75rem" }}>
      {children}
    </div>
  );

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif", background: "#fff" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "2.25rem clamp(1.5rem,4vw,2.5rem) 2rem",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.035) 0,rgba(2,212,126,0.035) 1px,transparent 1px,transparent 55px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.035) 0,rgba(2,212,126,0.035) 1px,transparent 1px,transparent 55px)" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" as const, textDecoration: "none" }}>{taller.nombre}</Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem" }}>›</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#02d47e", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Repositorio del Taller</span>
          </div>

          {/* Título + Buscador en 2 columnas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h1 style={{ fontSize: "clamp(1.9rem,3vw,2.5rem)", fontWeight: 800, lineHeight: 1, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.5rem" }}>
                ¿Qué equipo<br />buscas <span style={{ color: "#02d47e" }}>hoy?</span>
              </h1>
              <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Encuentra fichas, videos, manuales e IPERC de cada equipo del taller.
              </p>
            </div>
            <div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSearch()}
                  placeholder="Ej. elevador hidráulico, escáner OBD2..."
                  style={{ flex: 1, background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "0.75rem 1.25rem", fontSize: "0.88rem", color: "#fff", fontFamily: "'Manrope', sans-serif", outline: "none" }}
                />
                <button
                  onClick={handleSearch}
                  style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.85rem", padding: "0.75rem 1.5rem", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", whiteSpace: "nowrap" as const }}
                >
                  Buscar
                </button>
              </div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)", marginTop: "0.6rem", paddingLeft: "0.25rem" }}>
                Prueba: "frenos", "suspensión", "motor"
              </div>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" as const, paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { val: String(totalBienes || bienes.length), label: "Bienes totales" },
              { val: "6",                                   label: "Tipos de recurso" },
              { val: String(data.inventoryZones.length),    label: "Zonas del taller" },
              { val: "+300",                                label: "Recursos disponibles" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ───────────────────────────────────────────────────── */}
      <div style={{ padding: "2rem clamp(1.5rem,4vw,2.5rem)", display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>

        {/* 2 columnas: acciones | zonas */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1.25rem", alignItems: "start" }}>

          {/* Acciones rápidas */}
          <div>
            <SectionLabel>¿Qué necesitas hacer?</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
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
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
              {data.inventoryZones.map((zone, i) => (
                <div
                  key={i}
                  onClick={() => navigate(`/taller/${slug}/repositorio?zona=${encodeURIComponent(zone.name)}`)}
                  style={{ background: "#fff", border: "1.5px solid rgba(4,57,65,0.08)", borderRadius: 13, padding: "1rem 1.25rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.9rem", transition: "border-color .2s, transform .2s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#02d47e"; el.style.transform = "translateX(4px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 11, background: `${data.tallerAccent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
                    {zone.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#043941", marginBottom: 2 }}>{zone.name}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(4,57,65,0.48)", lineHeight: 1.35 }}>{zone.desc}</div>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#d2ffe1", color: "#043941", fontSize: "0.68rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100, flexShrink: 0, whiteSpace: "nowrap" as const }}>
                    {zone.count} bienes
                  </div>
                  <span style={{ color: "rgba(4,57,65,0.25)", fontSize: "0.85rem", marginLeft: "0.25rem", flexShrink: 0 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* ── CTA CATÁLOGO COMPLETO ── */}
        <div style={{ background: "linear-gradient(135deg,#043941,#045f6c)", borderRadius: 16, padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" as const }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>📦</span>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 2 }}>Catálogo completo del taller</div>
              <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.48)" }}>
                Accede a los {totalBienes || bienes.length} bienes con filtros por zona, tipo de recurso y nombre del equipo.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/repositorio`)}
            style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.82rem", padding: "0.8rem 1.75rem", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", whiteSpace: "nowrap" as const }}
          >
            Ver catálogo completo →
          </button>
        </div>

      </div>
    </main>
  );
}
