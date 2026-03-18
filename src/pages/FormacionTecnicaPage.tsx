import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function FormacionTecnicaPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const taller    = getTallerBySlug(slug ?? "");
  const data      = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#02d47e", fontWeight: 700 }}>Taller no encontrado</span>
      </div>
    );
  }

  const accent      = data.tallerAccent;
  const totalBienes = data.inventoryZones.reduce((s, z) => s + z.count, 0);
  const totalZonas  = data.inventoryZones.length;
  const totalUC     = data.unidadesCompetencia.length;

  const cards = [
    {
      num: "01", icon: "📄",
      label: "Programa formativo",
      title: "¿Qué aprenderán los estudiantes?",
      desc: "Plan de estudios oficial: áreas temáticas, horas por módulo, metodología y criterios de evaluación según el CNB-MINEDU.",
      to: `/taller/${slug}/formacion#programa`,
    },
    {
      num: "02", icon: "🎓",
      label: "Perfil de egreso",
      title: `Nivel de egreso: ${data.nivelEgreso}`,
      desc: data.perfilEgreso[0]?.text ?? "Capacidades técnicas y transversales reconocidas por MINEDU.",
      to: `/taller/${slug}/formacion#egreso`,
    },
    {
      num: "03", icon: "⚙️",
      label: "Competencias",
      title: `${totalUC} unidades de competencia`,
      desc: data.unidadesCompetencia[0] + (totalUC > 1 ? ` y ${totalUC - 1} más.` : "."),
      to: `/taller/${slug}/formacion#competencias`,
    },
    {
      num: "04", icon: "🏭",
      label: "Zonas del taller",
      title: `${totalBienes} bienes en ${totalZonas} zonas`,
      desc: data.inventoryZones.map((z) => z.name.split(":")[0].trim()).join(" · "),
      to: `/taller/${slug}/repositorio`,
    },
  ];

  /* ── Estilos compartidos — mismo patrón que Repositorio y Ruta ────────── */
  const heroStyle: React.CSSProperties = {
    background: "#043941",
    padding: "2rem 2rem 1.75rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.35rem",
    position: "relative",
    overflow: "hidden",
  };

  const breadcrumbStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.7rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.35)",
    marginBottom: "0.5rem",
  };

  const h1Style: React.CSSProperties = {
    fontSize: "clamp(2rem, 4vw, 2.8rem)",
    fontWeight: 800,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
    color: "#fff",
    margin: 0,
  };

  const descStyle: React.CSSProperties = {
    fontSize: "0.875rem",
    fontWeight: 400,
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.65,
    maxWidth: 560,
    margin: "0.5rem 0 1.25rem",
  };

  const statsRowStyle: React.CSSProperties = {
    display: "flex",
    gap: "2.5rem",
    flexWrap: "wrap",
    marginTop: "0.25rem",
  };

  const statValStyle: React.CSSProperties = {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#02d47e",
    lineHeight: 1,
    display: "block",
  };

  const statLblStyle: React.CSSProperties = {
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.09em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.32)",
    display: "block",
    marginTop: "0.2rem",
  };

  const bodyStyle: React.CSSProperties = {
    background: "#f0fafb",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    flex: 1,
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    border: "1.5px solid rgba(4,57,65,0.08)",
    borderRadius: 13,
    padding: "1rem 1.1rem",
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    cursor: "pointer",
    transition: "border-color .2s, transform .2s, box-shadow .2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", fontFamily: "Manrope, sans-serif" }}>

      {/* ── HERO — mismo patrón que Repositorio ───────────────────────────── */}
      <div style={heroStyle}>
        {/* Breadcrumb con SidebarTrigger */}
        <div style={breadcrumbStyle}>
          <SidebarTrigger style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
          <span>{taller.nombre.toUpperCase()}</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>› FORMACIÓN TÉCNICA MINEDU</span>
        </div>

        {/* Título doble línea — igual que Ruta y Repositorio */}
        <h1 style={h1Style}>
          Programa Formativo{" "}
          <span style={{ color: accent, display: "block" }}>{taller.nombre}</span>
        </h1>

        <p style={descStyle}>
          {data.presentacion}
        </p>

        {/* Stats en verde — mismo patrón que Ruta */}
        <div style={statsRowStyle}>
          {[
            { val: String(totalBienes),        lbl: "Bienes del taller" },
            { val: String(totalUC),             lbl: "Competencias" },
            { val: data.horasFormacion + "h",  lbl: "Horas de formación" },
            { val: data.nivelEgreso,            lbl: "Nivel de egreso" },
          ].map((s) => (
            <div key={s.lbl}>
              <span style={{ ...statValStyle, fontSize: s.val.length > 8 ? "1rem" : "1.6rem" }}>
                {s.val}
              </span>
              <span style={statLblStyle}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CUERPO — fondo ice claro igual que Repositorio ────────────────── */}
      <div style={bodyStyle}>

        {/* Label de sección — igual que Repositorio "¿QUÉ NECESITAS HACER?" */}
        <div style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#045f6c",
          marginBottom: "0.25rem",
        }}>
          — CONTENIDO DEL PROGRAMA —
        </div>

        {/* 4 cards — mismo estilo que ActionCard en Repositorio */}
        {cards.map((c) => (
          <div
            key={c.num}
            style={cardStyle}
            onClick={() => navigate(c.to)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = accent;
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(4,57,65,0.10)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(4,57,65,0.08)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.transform = "none";
            }}
          >
            {/* Ícono con acento del taller */}
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${accent}16`,
              border: `1.5px solid ${accent}30`,
              display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18, flexShrink: 0,
            }}>
              {c.icon}
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.09em",
                textTransform: "uppercase", color: "#02d47e", marginBottom: 2,
              }}>
                {c.num} · {c.label}
              </div>
              <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#043941", marginBottom: 2, lineHeight: 1.25 }}>
                {c.title}
              </div>
              <div style={{
                fontSize: "0.8rem", color: "rgba(4,57,65,0.55)", lineHeight: 1.55,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}>
                {c.desc}
              </div>
            </div>

            {/* Flecha */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(4,57,65,0.3)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </div>
        ))}

        {/* CTA final — mismo estilo que en Repositorio */}
        <div
          style={{
            marginTop: "0.5rem",
            background: "#043941",
            borderRadius: 13,
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>
              ¿Listo para iniciar la formación?
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
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
              padding: "0.6rem 1.5rem",
              fontFamily: "Manrope, sans-serif",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              letterSpacing: "0.01em",
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
