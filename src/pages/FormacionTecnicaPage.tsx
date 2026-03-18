import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { getTotalBienesByTaller } from "@/data/bienesData";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function FormacionTecnicaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const taller = getTallerBySlug(slug);
  const data = useMemo(() => getTallerDashboardData(slug), [slug]);
  const modulos = useMemo(() => buildModulosForTaller(slug), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug), [slug]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  const bienes = totalBienes || data.inventoryZones.reduce((a, z) => a + z.count, 0);
  const zonas = data.inventoryZones.length;
  const nivelEgreso = data.nivelEgreso || "Auxiliar Técnico";
  const horasFormacion = data.horasFormacion || "1,440";

  interface SectionCard {
    num: string;
    icon: React.ReactNode;
    iconBg: string;
    label: string;
    title: string;
    desc: string;
    to: string;
  }

  const cards: SectionCard[] = [
    {
      num: "01",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#045f6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
      iconBg: "rgba(4,57,65,0.07)",
      label: "Programa formativo",
      title: "¿Qué aprenderán los estudiantes?",
      desc: "Plan de estudios oficial con áreas temáticas, horas por módulo, metodología y criterios de evaluación según el CNB-MINEDU.",
      to: `/taller/${slug}/formacion#programa`,
    },
    {
      num: "02",
      icon: <span style={{ fontSize: "1rem" }}>🎓</span>,
      iconBg: "rgba(2,212,126,0.08)",
      label: "Perfil de egreso",
      title: "Lo que certifica el estudiante al terminar",
      desc: "Capacidades técnicas y transversales reconocidas por MINEDU. El egresado obtiene el nivel Auxiliar Técnico.",
      to: `/taller/${slug}/formacion#egreso`,
    },
    {
      num: "03",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={data.tallerAccent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
        </svg>
      ),
      iconBg: `${data.tallerAccent}15`,
      label: "Competencias",
      title: `${data.unidadesCompetencia.length} competencias técnicas del programa`,
      desc: "Definidas por el CNB-MINEDU. Cada competencia agrupa capacidades, indicadores de logro y criterios de evaluación.",
      to: `/taller/${slug}/formacion#competencias`,
    },
    {
      num: "04",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
        </svg>
      ),
      iconBg: "rgba(249,115,22,0.08)",
      label: "Zonas del taller",
      title: `${bienes} bienes en ${zonas} zonas especializadas`,
      desc: "Espacios diferenciados por función: investigación, producción, almacén y simulación, con equipos y herramientas categorizados.",
      to: `/taller/${slug}/repositorio`,
    },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif", background: "#fff" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "2.5rem clamp(1.5rem,4vw,2.5rem) 2rem",
        position: "relative", overflow: "hidden",
      }}>
        {/* Fondo decorativo */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.035) 0,rgba(2,212,126,0.035) 1px,transparent 1px,transparent 55px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.035) 0,rgba(2,212,126,0.035) 1px,transparent 1px,transparent 55px)" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.1rem" }}>
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} style={{ fontSize: "0.68rem", fontWeight: 600, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase" as const, textDecoration: "none" }}>
              {taller.nombre}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.68rem" }}>›</span>
            <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#02d47e", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
              Formación Técnica MINEDU
            </span>
          </div>

          {/* Título */}
          <h1 style={{ fontSize: "clamp(1.9rem,3.5vw,2.4rem)", fontWeight: 800, lineHeight: 0.97, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.85rem" }}>
            Programa Formativo<br />
            <span style={{ color: data.tallerAccent }}>{taller.nombre}</span>
          </h1>

          <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.72, maxWidth: 520, marginBottom: "1.6rem" }}>
            Conoce el programa oficial con áreas temáticas, competencias y perfil de egreso según el CNB-MINEDU. Toda la estructura formativa para planificar tus sesiones.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" as const, paddingTop: "1.4rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { val: String(bienes), label: "Bienes del taller" },
              { val: String(modulos.length), label: "Módulos" },
              { val: horasFormacion + "h", label: "Formación" },
              { val: nivelEgreso, label: "Nivel de egreso" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ────────────────────────────────────────────────────── */}
      <div style={{ padding: "2rem clamp(1.5rem,4vw,2.5rem)", display: "flex", flexDirection: "column" as const, gap: "1.25rem", background: "#fff" }}>

        {/* Encabezado */}
        <div style={{ textAlign: "center", padding: "0.25rem 0 0.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#02d47e", marginBottom: "0.5rem" }}>
            <span style={{ width: 20, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
            Secciones del programa
            <span style={{ width: 20, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em" }}>
            Explora la <span style={{ color: "#02d47e" }}>formación técnica</span>
          </h2>
        </div>

        {/* ── LISTA DE SECCIONES ── */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.55rem" }}>
          {cards.map((c) => (
            <div
              key={c.num}
              onClick={() => navigate(c.to)}
              style={{
                background: "#fff",
                border: "1.5px solid rgba(4,57,65,0.08)",
                borderRadius: 13,
                cursor: "pointer",
                transition: "border-color .18s, box-shadow .18s",
                overflow: "hidden",
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(2,212,126,0.4)"; el.style.boxShadow = "0 3px 14px rgba(2,212,126,0.08)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.boxShadow = "none"; }}
            >
              <div style={{
                display: "grid",
                gridTemplateColumns: "52px 1fr auto",
                alignItems: "center",
                gap: "1rem",
                padding: "0.95rem 1.25rem",
              }}>
                {/* Icono */}
                <div style={{
                  width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: c.iconBg,
                }}>
                  {c.icon}
                </div>

                {/* Info */}
                <div>
                  <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "#02d47e", marginBottom: 3 }}>
                    {c.num} · {c.label}
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#043941", lineHeight: 1.2, marginBottom: 3 }}>
                    {c.title}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "rgba(4,57,65,0.48)", lineHeight: 1.4 }}>
                    {c.desc}
                  </div>
                </div>

                {/* Flecha */}
                <span style={{ color: "rgba(4,57,65,0.25)", fontSize: "1.1rem", flexShrink: 0 }}>›</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── COMPETENCIAS ── */}
        <div style={{ background: "#fff", borderRadius: 16, border: "1px solid rgba(4,57,65,0.08)", padding: "1.75rem 2rem" }}>
          <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(4,57,65,0.4)", marginBottom: "0.75rem" }}>
            {data.unidadesCompetencia.length} competencias técnicas
          </div>
          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
            {data.unidadesCompetencia.map((uc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "0.7rem 0.9rem", background: "rgba(4,57,65,0.03)", borderRadius: 10, border: "1px solid rgba(4,57,65,0.07)" }}>
                <div style={{ width: 26, height: 26, borderRadius: 7, flexShrink: 0, background: `${data.tallerAccent}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 800, color: data.tallerAccent }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div style={{ fontSize: "0.75rem", color: "rgba(4,57,65,0.65)", lineHeight: 1.45, paddingTop: 4 }}>{uc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          background: "linear-gradient(135deg,#043941,#045f6c)",
          borderRadius: 16, padding: "1.5rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1.5rem", flexWrap: "wrap" as const,
        }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🎓</span>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 2 }}>
                ¿Listo para iniciar la formación?
              </div>
              <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.48)" }}>
                Accede a la ruta de aprendizaje con sesiones en vivo y recursos por módulo
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/ruta`)}
            style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.82rem", padding: "0.8rem 1.75rem", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", whiteSpace: "nowrap" as const }}
          >
            Ir a la Ruta de Aprendizaje →
          </button>
        </div>
      </div>
    </main>
  );
}
