import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TIPO_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  PDF:         { label: "PDF",         bg: "rgba(4,57,65,0.07)",    color: "#045f6c" },
  VIDEO:       { label: "Video",       bg: "rgba(2,212,126,0.1)",   color: "#00c16e" },
  INTERACTIVO: { label: "Interactivo", bg: "rgba(6,182,212,0.1)",   color: "#0891b2" },
  QUIZ:        { label: "Quiz",        bg: "rgba(234,179,8,0.12)",  color: "#ca8a04" },
  "EN VIVO":   { label: "EN VIVO",     bg: "rgba(239,68,68,0.1)",   color: "#ef4444" },
};

export default function RutaAprendizajePage() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const taller    = getTallerBySlug(slug ?? "");
  const data      = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const modulos   = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  const sesionesVivo = modulos.reduce((acc, m) => {
    const vivo = (m.contenidos ?? []).filter(c => c.tipo === "EN VIVO").length;
    const vivoSub = (m.subSecciones ?? []).flatMap(s => s.contenidos).filter(c => c.tipo === "EN VIVO").length;
    return acc + vivo + vivoSub;
  }, 0);

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif", background: "#fff" }}>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "2.5rem clamp(1.5rem,4vw,2.5rem) 2rem",
        display: "grid", gridTemplateColumns: "1fr 150px",
        gap: "2rem", alignItems: "center",
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
              Ruta de Aprendizaje
            </span>
          </div>

          {/* Título */}
          <h1 style={{ fontSize: "clamp(1.9rem,3.5vw,2.4rem)", fontWeight: 800, lineHeight: 0.97, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.85rem" }}>
            Tu camino hacia<br />
            <span style={{ color: "#02d47e" }}>la certificación</span>
          </h1>

          <p style={{ fontSize: "0.86rem", color: "rgba(255,255,255,0.52)", lineHeight: 1.72, maxWidth: 480, marginBottom: "1.6rem" }}>
            Un recorrido progresivo de {modulos.length} módulos que te lleva desde el reconocimiento del taller hasta el proyecto final integrador. Cada módulo combina teoría, práctica y evaluación.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" as const, paddingTop: "1.4rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { val: String(modulos.length), label: "Módulos" },
              { val: String(sesionesVivo),   label: "Sesiones en vivo" },
              { val: "🎓",                   label: "Certificación" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.45rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.66rem", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Anillo de avance */}
        <div style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="70" cy="70" r="58" fill="none" stroke="#02d47e" strokeWidth="8"
              strokeLinecap="round" strokeDasharray="364" strokeDashoffset="364"
              transform="rotate(-90 70 70)" style={{ opacity: 0.4 }} />
          </svg>
          <div style={{ position: "absolute", textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>0%</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 2 }}>Avance</div>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ───────────────────────────────────────────────────── */}
      <div style={{ padding: "2rem clamp(1.5rem,4vw,2.5rem)", display: "flex", flexDirection: "column" as const, gap: "1.25rem", background: "#fff" }}>

        {/* Encabezado */}
        <div style={{ textAlign: "center", padding: "0.25rem 0 0.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#02d47e", marginBottom: "0.5rem" }}>
            <span style={{ width: 20, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
            Detalle de la ruta
            <span style={{ width: 20, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em" }}>
            Qué aprenderás en <span style={{ color: "#02d47e" }}>cada módulo</span>
          </h2>
        </div>

        {/* ── LISTA DE MÓDULOS ── */}
        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.55rem" }}>
          {modulos.map((modulo) => {
            const esFinal = modulo.orden === modulos.length;

            // Recoger todos los tipos de contenido del módulo
            const tipos = new Set<string>();
            (modulo.contenidos ?? []).forEach(c => tipos.add(c.tipo));
            (modulo.subSecciones ?? []).forEach(s => s.contenidos.forEach(c => tipos.add(c.tipo)));

            return (
              <div
                key={modulo.id}
                onClick={() => navigate(`/taller/${slug}/modulo/${modulo.orden}`)}
                style={{
                  background: esFinal ? "linear-gradient(135deg,rgba(2,212,126,0.04),#fff)" : "#fff",
                  border: `1.5px solid ${esFinal ? "rgba(2,212,126,0.22)" : "rgba(4,57,65,0.08)"}`,
                  borderRadius: 13,
                  cursor: "pointer",
                  transition: "border-color .18s, box-shadow .18s",
                  overflow: "hidden",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(2,212,126,0.4)"; el.style.boxShadow = "0 3px 14px rgba(2,212,126,0.08)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = esFinal ? "rgba(2,212,126,0.22)" : "rgba(4,57,65,0.08)"; el.style.boxShadow = "none"; }}
              >
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "52px 1fr auto auto",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.95rem 1.25rem",
                }}>
                  {/* Número */}
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.85rem", fontWeight: 800,
                    background: esFinal ? "rgba(2,212,126,0.12)" : `${data.tallerAccent}18`,
                    color: esFinal ? "#02d47e" : data.tallerAccent,
                  }}>
                    {String(modulo.orden).padStart(2, "0")}
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#043941", lineHeight: 1.2, marginBottom: 3, display: "flex", alignItems: "center", gap: 7 }}>
                      {modulo.icon} {modulo.nombre}
                      {esFinal && (
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: "rgba(2,212,126,0.12)", color: "#02d47e" }}>
                          Certifica
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.73rem", color: "rgba(4,57,65,0.48)", lineHeight: 1.4 }}>{modulo.descripcion}</div>
                  </div>

                  {/* Badges de recursos */}
                  <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" as const, justifyContent: "flex-end", flexShrink: 0 }}>
                    {Array.from(tipos).map(tipo => {
                      const badge = TIPO_BADGE[tipo];
                      if (!badge) return null;
                      return (
                        <span key={tipo} style={{ fontSize: "0.61rem", fontWeight: 700, padding: "2px 8px", borderRadius: 100, background: badge.bg, color: badge.color, whiteSpace: "nowrap" as const }}>
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Botón */}
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/taller/${slug}/modulo/${modulo.orden}`); }}
                    style={{
                      background: esFinal ? "#02d47e" : "#043941",
                      color: esFinal ? "#043941" : "#fff",
                      fontSize: "0.7rem", fontWeight: 700,
                      padding: "0.42rem 0.9rem", borderRadius: 100,
                      border: "none", cursor: "pointer",
                      fontFamily: "'Manrope', sans-serif",
                      whiteSpace: "nowrap" as const, flexShrink: 0,
                      transition: "background .18s",
                    }}
                  >
                    Ir →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA CERTIFICACIÓN ── */}
        <div style={{
          background: "linear-gradient(135deg,#043941,#045f6c)",
          borderRadius: 16, padding: "1.5rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1.5rem", flexWrap: "wrap" as const,
        }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🎓</span>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff", marginBottom: 2 }}>Certificación por módulo</div>
              <div style={{ fontSize: "0.77rem", color: "rgba(255,255,255,0.48)" }}>
                Al completar cada módulo recibes un certificado. Completa los {modulos.length} para obtener la certificación final.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/modulo/1`)}
            style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.82rem", padding: "0.8rem 1.75rem", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", whiteSpace: "nowrap" as const }}
          >
            Iniciar Módulo 01 →
          </button>
        </div>

      </div>
    </main>
  );
}
