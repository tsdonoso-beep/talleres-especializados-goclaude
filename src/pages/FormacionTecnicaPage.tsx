import { useParams, useNavigate } from "react-router-dom";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { SidebarTrigger } from "@/components/ui/sidebar";

const ACCENT_MAP: Record<string, string> = {
  "mecanica-automotriz":    "#F97316",
  "industria-del-vestido":  "#F472B6",
  "cocina-y-reposteria":    "#FBBF24",
  "ebanisteria":            "#C8956C",
  "computacion-e-informatica": "#3B82F6",
  "electronica":            "#8B5CF6",
  "industrias-alimentarias":"#FB923C",
  "electricidad":           "#F59E0B",
  "construcciones-metalicas":"#94A3B8",
};

const DARK_ACCENT = new Set([
  "cocina-y-reposteria",
  "electricidad",
]);

interface SectionCard {
  num:   string;
  icon:  string;
  iconBg:string;
  label: string;
  title: string;
  desc:  string;
  to:    string;
}

export default function FormacionTecnicaPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate       = useNavigate();
  const taller         = getTallerBySlug(slug);
  const dashData       = getTallerDashboardData(slug);

  const accent      = ACCENT_MAP[slug] ?? "#02d47e";
  const accentText  = DARK_ACCENT.has(slug) ? "#78350f" : "#ffffff";

  if (!taller) return (
    <div style={{ padding: "3rem", fontFamily: "Manrope, sans-serif", color: "#043941" }}>
      Taller no encontrado.
    </div>
  );

  const bienes   = dashData?.stats?.bienes   ?? 0;
  const modulos  = dashData?.stats?.modulos  ?? 6;
  const horas    = dashData?.stats?.horas    ?? 1440;
  const egreso   = dashData?.stats?.egreso   ?? "Auxiliar Técnico";

  const cards: SectionCard[] = [
    {
      num: "01", icon: "📄", iconBg: "#fff7ed",
      label: "Programa formativo",
      title: "¿Qué aprenderán los estudiantes?",
      desc:  "Plan de estudios oficial con áreas temáticas, horas por módulo, metodología y criterios de evaluación según el CNB-MINEDU.",
      to:    `/taller/${slug}/formacion#programa`,
    },
    {
      num: "02", icon: "🎓", iconBg: "#f0fdf4",
      label: "Perfil de egreso",
      title: "Lo que certifica el estudiante al terminar",
      desc:  "Capacidades técnicas y transversales reconocidas por MINEDU. El egresado obtiene el nivel Auxiliar Técnico.",
      to:    `/taller/${slug}/formacion#egreso`,
    },
    {
      num: "03", icon: "⚙️", iconBg: "#eff6ff",
      label: "Competencias",
      title: `${modulos} competencias técnicas del programa`,
      desc:  "Definidas por el CNB-MINEDU. Cada competencia agrupa capacidades, indicadores de logro y criterios de evaluación.",
      to:    `/taller/${slug}/formacion#competencias`,
    },
    {
      num: "04", icon: "🏭", iconBg: "#fdf4ff",
      label: "Zonas del taller",
      title: `${bienes} bienes en ${dashData?.stats?.zonas ?? 4} zonas especializadas`,
      desc:  "Espacios diferenciados por función: investigación, producción, almacén y simulación, con equipos y herramientas categorizados.",
      to:    `/taller/${slug}/repositorio`,
    },
  ];

  return (
    <div style={{ fontFamily: "Manrope, sans-serif", background: "#f7fafa", minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <div style={{ background: "#043941", padding: "36px 48px 32px", width: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <SidebarTrigger style={{ color: "rgba(255,255,255,0.4)" }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.3)" }}>
            {taller.nombre.toUpperCase()}&nbsp;
            <span style={{ color: "rgba(255,255,255,0.55)" }}>› FORMACIÓN TÉCNICA MINEDU</span>
          </span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 7, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 100, padding: "3px 12px", marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: accent, flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.4)" }}>
            SECUNDARIA CON FORMACIÓN TÉCNICA · SFT
          </span>
        </div>

        <h1 style={{ fontSize: "clamp(28px, 3vw, 36px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, marginBottom: 22 }}>
          Programa Formativo<br />
          <span style={{ color: accent }}>{taller.nombre}</span>
        </h1>

        <div style={{ display: "flex", gap: 36, flexWrap: "wrap" as const }}>
          {[
            { val: bienes,   lbl: "Bienes del taller" },
            { val: modulos,  lbl: "Módulos" },
            { val: `${horas}h`, lbl: "Formación" },
            { val: egreso,   lbl: "Nivel de egreso" },
          ].map((s) => (
            <div key={s.lbl}>
              <div style={{ fontSize: typeof s.val === "number" ? 26 : 18, fontWeight: 800, color: "#02d47e", lineHeight: 1 }}>
                {s.val}
              </div>
              <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: ".09em", textTransform: "uppercase" as const, color: "rgba(255,255,255,0.32)", marginTop: 3 }}>
                {s.lbl}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CARDS ────────────────────────────────────────────────────────── */}
      <div style={{ padding: "28px 48px", display: "flex", flexDirection: "column" as const, gap: 14 }}>
        {cards.map((c) => (
          <div
            key={c.num}
            onClick={() => navigate(c.to)}
            style={{
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              borderRadius: 12,
              padding: "20px 24px",
              display: "flex",
              alignItems: "center",
              gap: 20,
              cursor: "pointer",
              width: "100%",
              transition: "border-color .15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2e8f0")}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>
              {c.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".09em", textTransform: "uppercase" as const, color: "#02d47e", marginBottom: 3 }}>
                {c.num} · {c.label}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#043941", marginBottom: 4 }}>
                {c.title}
              </div>
              <div style={{ fontSize: 12, color: "#718096", lineHeight: 1.6 }}>
                {c.desc}
              </div>
            </div>

            <div style={{ fontSize: 20, color: "#e2e8f0", flexShrink: 0, transition: "color .15s" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = accent)}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#e2e8f0")}
            >
              ›
            </div>
          </div>
        ))}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <div style={{ padding: "0 48px 36px" }}>
        <div style={{ background: "#043941", borderRadius: 12, padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" as const }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
              ¿Listo para iniciar la formación?
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
              Accede a la ruta de aprendizaje con sesiones en vivo y recursos por módulo
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/ruta`)}
            style={{ background: "#02d47e", color: "#043941", border: "none", borderRadius: 100, padding: "10px 24px", fontFamily: "Manrope, sans-serif", fontSize: 13, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" as const }}
          >
            Ir a la Ruta de Aprendizaje →
          </button>
        </div>
      </div>

    </div>
  );
}
