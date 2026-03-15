import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ─── Tipos de recurso por módulo (ilustrativos) ───────────────────────────────
const TIPO_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  PDF:          { label: "PDF",         bg: "rgba(4,57,65,0.08)",      color: "#045f6c" },
  VIDEO:        { label: "Video",       bg: "rgba(2,212,126,0.1)",     color: "#00c16e" },
  INTERACTIVO:  { label: "Interactivo", bg: "rgba(6,182,212,0.1)",     color: "#0891b2" },
  QUIZ:         { label: "Quiz",        bg: "rgba(234,179,8,0.12)",    color: "#ca8a04" },
  "EN VIVO":    { label: "EN VIVO",     bg: "rgba(239,68,68,0.12)",    color: "#ef4444" },
};

// ─── Helper: tag de sección ───────────────────────────────────────────────────
const SectionTag = ({ label }: { label: string }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 8,
    color: "#02d47e", fontWeight: 600, fontSize: "0.72rem",
    letterSpacing: "0.12em", textTransform: "uppercase" as const,
    marginBottom: "0.75rem",
  }}>
    <span style={{ width: 24, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
    {label}
    <span style={{ width: 24, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
  </div>
);

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function RutaAprendizajePage() {
  const { slug } = useParams<{ slug: string }>();
  const taller  = getTallerBySlug(slug ?? "");
  const modulos = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const data    = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  // Los módulos reales (6) + el ítem virtual "Progreso de la ruta"
  const etapas = [
    ...modulos.map(m => ({
      orden: m.orden,
      icon: m.icon,
      nombre: m.nombre,
      descripcion: m.descripcion,
      esCertificacion: m.orden === modulos.length,
      esProgreso: false,
    })),
    {
      orden: modulos.length + 1,
      icon: "📈",
      nombre: "Progreso de la ruta",
      descripcion: "Resumen de avance, logros obtenidos y próximas etapas.",
      esCertificacion: false,
      esProgreso: true,
    },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "clamp(2.5rem,6vw,4.5rem) clamp(1.5rem,5vw,4rem)",
        position: "relative", overflow: "hidden",
        display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center",
      }}>
        {/* Fondo decorativo */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px)", pointerEvents: "none" }} />

        {/* Contenido */}
        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.5rem" }}>
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              {taller.nombre}
            </span>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>›</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#02d47e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Ruta de Aprendizaje
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.8rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Tu camino hacia<br />
            <span style={{ color: "#02d47e" }}>la certificación</span>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480, marginBottom: "1.75rem" }}>
            Un recorrido progresivo de {etapas.length} etapas que te lleva desde el reconocimiento del taller hasta el proyecto final integrador. Cada etapa combina teoría, práctica y evaluación.
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            {[
              { val: String(etapas.length), label: "Etapas" },
              { val: String(modulos.length), label: "Módulos" },
              { val: "4",  label: "Sesiones en vivo" },
              { val: "🎓", label: "Certificación" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Anillo visual de progreso */}
        <div style={{ position: "relative", zIndex: 2, flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="70" cy="70" r="58" fill="none" stroke="#02d47e" strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray="364"
              strokeDashoffset="364"
              transform="rotate(-90 70 70)"
              style={{ opacity: 0.4 }}
            />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Avance</div>
            <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>0%</div>
            <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>por iniciar</div>
          </div>
        </div>
      </section>

      {/* ── PRESENTACIÓN DE ETAPAS ───────────────────────────── */}
      <section style={{ background: "#fff", padding: "clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem)" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <SectionTag label={`${etapas.length} etapas formativas`} />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Selecciona una <span style={{ color: "#02d47e" }}>etapa</span>
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(4,57,65,0.5)", marginTop: "0.5rem", maxWidth: 520, margin: "0.5rem auto 0" }}>
            Haz clic en cualquier etapa para acceder a sus recursos, videos y evaluaciones.
          </p>
        </div>

        {/* Grid de etapas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "1rem",
          maxWidth: 1100,
          margin: "0 auto 3rem",
        }}>
          {etapas.map((etapa) => (
            <EtapaCard
              key={etapa.orden}
              etapa={etapa}
              slug={slug ?? ""}
              acento={data.tallerAccent}
            />
          ))}
        </div>

        {/* CTA certificación */}
        <div style={{
          background: "linear-gradient(135deg,#043941,#045f6c)",
          borderRadius: 16,
          padding: "1.75rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1.5rem", flexWrap: "wrap" as const,
          maxWidth: 1100, margin: "0 auto",
        }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>🎓</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>Certificación por módulo</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                Al completar cada etapa recibes un certificado. Completa las {modulos.length} para obtener la certificación final.
              </div>
            </div>
          </div>
          <Link
            to={`/taller/${slug}/modulo/1`}
            style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" as const }}
          >
            Iniciar Etapa 01 →
          </Link>
        </div>
      </section>

      {/* ── DETALLE VISUAL POR ETAPA ─────────────────────────── */}
      <section style={{ background: "#e3f8fb", padding: "clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem)" }}>
        <div style={{ marginBottom: "2rem" }}>
          <SectionTag label="Detalle de la ruta" />
          <h2 style={{ fontSize: "clamp(1.3rem,2.5vw,1.8rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
            Qué aprenderás en <span style={{ color: "#02d47e" }}>cada etapa</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem", maxWidth: 860 }}>
          {modulos.map((modulo, idx) => (
            <EtapaRow
              key={modulo.id}
              modulo={modulo}
              idx={idx}
              slug={slug ?? ""}
              acento={data.tallerAccent}
            />
          ))}
        </div>
      </section>

    </main>
  );
}

// ─── Card de etapa (grid) ─────────────────────────────────────────────────────
function EtapaCard({ etapa, slug, acento }: { etapa: any; slug: string; acento: string }) {
  const isCert = etapa.esCertificacion;
  const isProgreso = etapa.esProgreso;

  const card = (
    <div
      style={{
        background: isCert ? "linear-gradient(135deg,rgba(2,212,126,0.05),#fff)" : "#fff",
        border: `1.5px solid ${isCert ? "rgba(2,212,126,0.25)" : "rgba(4,57,65,0.08)"}`,
        borderRadius: 14,
        padding: "1.5rem 1.25rem",
        display: "flex", flexDirection: "column" as const, gap: "0.6rem",
        cursor: isProgreso ? "default" : "pointer",
        transition: "all 0.25s",
        textDecoration: "none",
        position: "relative" as const,
        overflow: "hidden",
      }}
      onMouseEnter={e => {
        if (!isProgreso) {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = "#02d47e";
          el.style.transform = "translateY(-4px)";
          el.style.boxShadow = "0 8px 24px rgba(2,212,126,0.1)";
        }
      }}
      onMouseLeave={e => {
        if (!isProgreso) {
          const el = e.currentTarget as HTMLElement;
          el.style.borderColor = isCert ? "rgba(2,212,126,0.25)" : "rgba(4,57,65,0.08)";
          el.style.transform = "translateY(0)";
          el.style.boxShadow = "none";
        }
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "rgba(4,57,65,0.13)", letterSpacing: "-0.04em" }}>
          {String(etapa.orden).padStart(2, "0")}
        </span>
        {isCert && (
          <span style={{ fontSize: "0.62rem", background: "rgba(2,212,126,0.12)", color: "#02d47e", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
            Certifica
          </span>
        )}
        {isProgreso && (
          <span style={{ fontSize: "0.62rem", background: "rgba(4,57,65,0.07)", color: "rgba(4,57,65,0.4)", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
            Resumen
          </span>
        )}
      </div>
      <div style={{ fontSize: "1.4rem" }}>{etapa.icon}</div>
      <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#043941", lineHeight: 1.3 }}>{etapa.nombre}</div>
      <div style={{ fontSize: "0.75rem", color: "rgba(4,57,65,0.45)", lineHeight: 1.5, flex: 1 }}>{etapa.descripcion}</div>
      {!isProgreso && (
        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#02d47e", marginTop: "0.25rem" }}>
          Ver etapa →
        </span>
      )}
    </div>
  );

  if (isProgreso) return card;

  return (
    <Link to={`/taller/${slug}/modulo/${etapa.orden}`} style={{ textDecoration: "none" }}>
      {card}
    </Link>
  );
}

// ─── Fila de etapa (lista detalle) ───────────────────────────────────────────
function EtapaRow({ modulo, idx, slug, acento }: { modulo: any; idx: number; slug: string; acento: string }) {
  // Recursos ilustrativos por módulo
  const RECURSOS_SAMPLE = [
    [{ t: "PDF", l: "Guía de seguridad e-IPERC" }, { t: "VIDEO", l: "Recorrido virtual 360°" }, { t: "QUIZ", l: "Evaluación de reconocimiento" }],
    [{ t: "PDF", l: "Manual de documentación técnica" }, { t: "VIDEO", l: "Uso de equipos de investigación" }, { t: "EN VIVO", l: "Sesión práctica grabada" }],
    [{ t: "PDF", l: "Guía Design Thinking" }, { t: "VIDEO", l: "Taller de prototipado" }, { t: "QUIZ", l: "Evaluación de competencias" }],
    [{ t: "PDF", l: "Control de inventario MINEDU" }, { t: "VIDEO", l: "Gestión de bienes educativos" }, { t: "INTERACTIVO", l: "Simulador de almacén" }],
    [{ t: "PDF", l: "Planificación curricular EBR" }, { t: "VIDEO", l: "Diseño de sesión de aprendizaje" }, { t: "EN VIVO", l: "Mentoría con expertos" }],
    [{ t: "PDF", l: "Rúbrica proyecto integrador" }, { t: "VIDEO", l: "Ejemplos proyectos anteriores" }, { t: "QUIZ", l: "Autoevaluación final" }],
  ];

  const recursos = RECURSOS_SAMPLE[idx] ?? RECURSOS_SAMPLE[0];

  return (
    <div style={{
      background: "#fff",
      border: "1px solid rgba(4,57,65,0.08)",
      borderRadius: 14,
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(2,212,126,0.3)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(4,57,65,0.08)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem" }}>
        {/* Número */}
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${acento}15`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "0.75rem", fontWeight: 800, color: acento, flexShrink: 0,
        }}>
          {String(modulo.orden).padStart(2, "0")}
        </div>

        {/* Emoji + nombre */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flex: 1, minWidth: 0 }}>
          <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{modulo.icon}</span>
          <div>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#043941", lineHeight: 1.2 }}>{modulo.nombre}</div>
            <div style={{ fontSize: "0.75rem", color: "rgba(4,57,65,0.45)", marginTop: 2, lineHeight: 1.4 }}>{modulo.descripcion}</div>
          </div>
        </div>

        {/* Badges de recursos */}
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" as const, justifyContent: "flex-end", flexShrink: 0 }}>
          {recursos.map((r, i) => {
            const badge = TIPO_BADGE[r.t] ?? TIPO_BADGE["PDF"];
            return (
              <span key={i} style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 8px", borderRadius: 100, background: badge.bg, color: badge.color }}>
                {badge.label}
              </span>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to={`/taller/${slug}/modulo/${modulo.orden}`}
          style={{
            background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.78rem",
            padding: "6px 16px", borderRadius: 100, textDecoration: "none",
            whiteSpace: "nowrap" as const, flexShrink: 0,
          }}
        >
          Ir →
        </Link>
      </div>
    </div>
  );
}
