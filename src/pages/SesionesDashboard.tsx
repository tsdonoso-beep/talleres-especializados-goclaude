import { useParams, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SesionesDashboard() {
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

  const accent   = data.tallerAccent;
  const sesiones = data.sesiones;

  const activas   = sesiones.filter((s) => s.status === "active").length;
  const proximas  = sesiones.filter((s) => s.status === "scheduled").length;
  const grabadas  = sesiones.filter((s) => s.status === "recorded").length;
  const total     = sesiones.length;

  /* ── Estilos base — mismo patrón que Repositorio y Ruta ──────────────── */
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
    maxWidth: 540,
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
    alignItems: "flex-start",
    gap: "1rem",
    cursor: "pointer",
    transition: "border-color .2s, transform .2s, box-shadow .2s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", fontFamily: "Manrope, sans-serif" }}>

      {/* ── HERO — mismo patrón que Repositorio ───────────────────────────── */}
      <div style={heroStyle}>
        <div style={breadcrumbStyle}>
          <SidebarTrigger style={{ color: "rgba(255,255,255,0.35)", flexShrink: 0 }} />
          <span>{taller.nombre.toUpperCase()}</span>
          <span style={{ color: "rgba(255,255,255,0.55)" }}>› SESIONES</span>
        </div>

        <h1 style={h1Style}>
          Sesiones{" "}
          <span style={{ color: accent, display: "block" }}>en Vivo y Asíncronas</span>
        </h1>

        <p style={descStyle}>
          Accede a las sesiones en vivo, grabadas y asíncronas del taller. Únete en tiempo real o revisa el contenido cuando lo necesites.
        </p>

        <div style={statsRowStyle}>
          {[
            { val: String(activas),  lbl: "En vivo ahora" },
            { val: String(proximas), lbl: "Próximas sesiones" },
            { val: String(grabadas), lbl: "Sesiones grabadas" },
            { val: String(total),    lbl: "Total de sesiones" },
          ].map((s) => (
            <div key={s.lbl}>
              <span style={statValStyle}>{s.val}</span>
              <span style={statLblStyle}>{s.lbl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CUERPO ─────────────────────────────────────────────────────────── */}
      <div style={bodyStyle}>

        {/* Label de sección */}
        <div style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#045f6c",
          marginBottom: "0.25rem",
        }}>
          — SESIONES DISPONIBLES —
        </div>

        {/* Cards de sesiones — del tipo SesionCard */}
        {sesiones.map((s, i) => {
          const isActiva = s.status === "active";
          const isProxima = s.status === "scheduled";

          return (
            <div
              key={i}
              style={cardStyle}
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
              {/* Ícono estado */}
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: s.badgeBg,
                border: `1.5px solid ${s.badgeBorder}`,
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 16,
              }}>
                {isActiva ? "🔴" : isProxima ? "🟡" : "⚪"}
              </div>

              {/* Contenido */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* Badge estado */}
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  background: s.badgeBg,
                  border: `1px solid ${s.badgeBorder}`,
                  borderRadius: 100,
                  padding: "2px 10px",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: s.badgeColor,
                  marginBottom: 6,
                }}>
                  {s.badge}
                </div>

                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#043941", marginBottom: 3, lineHeight: 1.25 }}>
                  {s.title}
                </div>
                <div style={{
                  fontSize: "0.8rem", color: "rgba(4,57,65,0.55)", lineHeight: 1.55,
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const,
                  marginBottom: 8,
                }}>
                  {s.desc}
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        background: "rgba(4,57,65,0.06)",
                        color: "#045f6c",
                        borderRadius: 100,
                        padding: "2px 9px",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CTA según estado */}
              {isActiva && (
                <button
                  style={{
                    background: "#ef4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: 100,
                    padding: "0.45rem 1rem",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Unirse ahora
                </button>
              )}
              {isProxima && (
                <button
                  style={{
                    background: "transparent",
                    color: accent,
                    border: `1.5px solid ${accent}`,
                    borderRadius: 100,
                    padding: "0.45rem 1rem",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Agendar
                </button>
              )}
              {s.status === "recorded" && (
                <button
                  style={{
                    background: "rgba(4,57,65,0.06)",
                    color: "#045f6c",
                    border: "none",
                    borderRadius: 100,
                    padding: "0.45rem 1rem",
                    fontFamily: "Manrope, sans-serif",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  Ver grabación
                </button>
              )}
            </div>
          );
        })}

        {/* CTA final */}
        <div style={{
          marginTop: "0.5rem",
          background: "#043941",
          borderRadius: 13,
          padding: "1.25rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}>
          <div>
            <div style={{ fontSize: "0.95rem", fontWeight: 800, color: "#fff" }}>
              ¿Quieres ver la ruta completa de aprendizaje?
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
              Accede a todos los módulos, recursos y actividades del taller
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
            Ver Ruta de Aprendizaje →
          </button>
        </div>
      </div>

    </div>
  );
}
