import { useParams, useNavigate } from "react-router-dom";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { SidebarTrigger } from "@/components/ui/sidebar";

/* ── Acentos por taller ─────────────────────────────────────────────────── */
const ACCENT_MAP: Record<string, string> = {
  "mecanica-automotriz":       "#F97316",
  "industria-del-vestido":     "#F472B6",
  "cocina-y-reposteria":       "#FBBF24",
  "ebanisteria":               "#C8956C",
  "computacion-e-informatica": "#3B82F6",
  "electronica":               "#8B5CF6",
  "industrias-alimentarias":   "#FB923C",
  "electricidad":              "#F59E0B",
  "construcciones-metalicas":  "#94A3B8",
};

/* ── Decoración Tangram — sistema gráfico GRAMA ─────────────────────────── */
function TangramHero({ accent }: { accent: string }) {
  return (
    <svg
      aria-hidden="true"
      style={{
        position: "absolute",
        right: 40,
        top: 0,
        height: "100%",
        width: 200,
        opacity: 0.08,
        pointerEvents: "none",
      }}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="100,8 196,192 4,192" fill={accent} />
      <rect x="120" y="20" width="55" height="55" fill="#02d47e" transform="rotate(45 147 47)" rx="2" />
      <circle cx="35" cy="55" r="32" stroke="#02d47e" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

/* ── Página ─────────────────────────────────────────────────────────────── */
export default function FormacionTecnicaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate      = useNavigate();
  const taller        = getTallerBySlug(slug);
  const dashData      = getTallerDashboardData(slug);

  const accent = ACCENT_MAP[slug] ?? "#02d47e";

  if (!taller) {
    return (
      <div style={{ padding: "3rem", fontFamily: "Manrope, sans-serif", color: "#043941" }}>
        Taller no encontrado.
      </div>
    );
  }

  const bienes  = dashData?.inventoryZones?.reduce((s, z) => s + z.count, 0) ?? 0;
  const modulosCount = dashData?.unidadesCompetencia?.length ?? 6;
  const horas   = dashData?.horasFormacion ?? "1440";
  const egreso  = dashData?.nivelEgreso ?? "Auxiliar Técnico";
  const zonas   = dashData?.inventoryZones?.length ?? 4;

  const cards = [
    {
      num: "01", icon: "📄",
      label: "Programa formativo",
      title: "¿Qué aprenderán los estudiantes?",
      desc:  "Plan de estudios oficial con áreas temáticas, horas por módulo, metodología y criterios de evaluación según el CNB-MINEDU.",
      to:    `/taller/${slug}/formacion#programa`,
    },
    {
      num: "02", icon: "🎓",
      label: "Perfil de egreso",
      title: "Lo que certifica el estudiante al terminar",
      desc:  "Capacidades técnicas y transversales reconocidas por MINEDU. El egresado obtiene el nivel Auxiliar Técnico.",
      to:    `/taller/${slug}/formacion#egreso`,
    },
    {
      num: "03", icon: "⚙️",
      label: "Competencias",
      title: `${modulosCount} competencias técnicas del programa`,
      desc:  "Definidas por el CNB-MINEDU. Cada competencia agrupa capacidades, indicadores de logro y criterios de evaluación.",
      to:    `/taller/${slug}/formacion#competencias`,
    },
    {
      num: "04", icon: "🏭",
      label: "Zonas del taller",
      title: `${bienes} bienes en ${zonas} zonas especializadas`,
      desc:  "Espacios diferenciados por función: investigación, producción, almacén y simulación, con equipos categorizados.",
      to:    `/taller/${slug}/repositorio`,
    },
  ];

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", background: "#f7fafa", minHeight: "100vh" }}>

      {/* ── HERO #043941 ──────────────────────────────────────────────────── */}
      <div style={{
        background: "#043941",
        padding: "36px 48px 32px",
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}>
        <TangramHero accent={accent} />

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <SidebarTrigger style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
          <span style={{
            fontSize: 10, fontWeight: 600, letterSpacing: ".08em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.3)",
          }}>
            {taller.nombre.toUpperCase()}&nbsp;
            <span style={{ color: "rgba(255,255,255,0.55)" }}>› FORMACIÓN TÉCNICA MINEDU</span>
          </span>
        </div>

        {/* Tag pill */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 7,
          border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100,
          padding: "3px 14px", marginBottom: 14,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: ".09em",
            textTransform: "uppercase", color: "rgba(255,255,255,0.4)",
          }}>
            SECUNDARIA CON FORMACIÓN TÉCNICA · SFT
          </span>
        </div>

        {/* Título doble línea */}
        <h1 style={{
          fontSize: "clamp(26px, 2.8vw, 36px)", fontWeight: 800,
          color: "#fff", lineHeight: 1.05, letterSpacing: "-0.02em", marginBottom: 24,
        }}>
          Programa Formativo<br />
          <span style={{ color: accent }}>{taller.nombre}</span>
        </h1>

        {/* Stats */}
        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" }}>
          {[
            { val: String(bienes),    lbl: "Bienes del taller" },
            { val: String(modulosCount),   lbl: "Módulos" },
            { val: `${horas}h`,       lbl: "Formación" },
            { val: egreso,            lbl: "Nivel de egreso" },
          ].map((s) => (
            <div key={s.lbl}>
              <div style={{
                fontSize: s.val.length > 6 ? 16 : 24,
                fontWeight: 800, color: "#02d47e", lineHeight: 1,
              }}>
                {s.val}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 600, letterSpacing: ".09em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.32)", marginTop: 3,
              }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 4 CARDS ───────────────────────────────────────────────────────── */}
      <div style={{ padding: "28px 48px", display: "flex", flexDirection: "column", gap: 12 }}>
        {cards.map((c) => (
          <div
            key={c.num}
            onClick={() => navigate(c.to)}
            style={{
              background: "#fff",
              border: `1.5px solid rgba(2,212,126,0.15)`,
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              cursor: "pointer",
              width: "100%",
              boxSizing: "border-box",
              transition: "border-color .18s, box-shadow .18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = "0 4px 24px rgba(4,57,65,0.10)";
              const arr = e.currentTarget.querySelector<HTMLElement>("[data-arrow]");
              if (arr) arr.style.color = accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(2,212,126,0.15)";
              e.currentTarget.style.boxShadow = "none";
              const arr = e.currentTarget.querySelector<HTMLElement>("[data-arrow]");
              if (arr) arr.style.color = "#cbd5e0";
            }}
          >
            {/* Ícono — fondo y borde con acento del taller */}
            <div style={{
              width: 42, height: 42, borderRadius: 10,
              background: `${accent}16`,
              border: `1.5px solid ${accent}35`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, flexShrink: 0,
            }}>
              {c.icon}
            </div>

            {/* Contenido */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 10, fontWeight: 700, letterSpacing: ".09em",
                textTransform: "uppercase", color: "#02d47e", marginBottom: 3,
              }}>
                {c.num} · {c.label}
              </div>
              <div style={{
                fontSize: 15, fontWeight: 800, color: "#043941",
                marginBottom: 4, lineHeight: 1.25,
              }}>
                {c.title}
              </div>
              <div style={{ fontSize: 12, fontWeight: 400, color: "#718096", lineHeight: 1.65 }}>
                {c.desc}
              </div>
            </div>

            {/* Flecha */}
            <div
              data-arrow=""
              style={{ fontSize: 22, color: "#cbd5e0", flexShrink: 0, transition: "color .18s" }}
            >
              ›
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 48px 36px" }}>
        <div style={{
          background: "#043941",
          border: "1px solid rgba(2,212,126,0.15)",
          borderRadius: 12,
          padding: "20px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
              ¿Listo para iniciar la formación?
            </div>
            <div style={{ fontSize: 11, fontWeight: 400, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
              Accede a la ruta de aprendizaje con sesiones en vivo y recursos por módulo
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/ruta`)}
            style={{
              background: "#02d47e",
              color: "#043941",
              border: "none",
              borderRadius: 100,
              padding: "10px 24px",
              fontFamily: "Manrope, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: ".01em",
              transition: "background .18s, transform .18s, box-shadow .18s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#00c16e";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(2,212,126,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#02d47e";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Ir a la Ruta de Aprendizaje →
          </button>
        </div>
      </div>

    </div>
  );
}
