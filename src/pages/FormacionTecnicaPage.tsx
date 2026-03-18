import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTotalBienesByTaller } from "@/data/bienesData";

// ── Helpers visuales ──────────────────────────────────────────────────────────
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

// ── Marco transversal — datos fijos MINEDU ────────────────────────────────────
const MARCO_TRANSVERSAL = [
  { icon: "🤖", label: "IA Generativa",        desc: "Uso ético de herramientas de inteligencia artificial en el taller" },
  { icon: "🔵", label: "Google Workspace",      desc: "Documentación colaborativa, Drive, Classroom y Meet" },
  { icon: "🏭", label: "Metodología 5S",         desc: "Orden, limpieza y eficiencia en el espacio de trabajo técnico" },
  { icon: "💡", label: "Design Thinking",        desc: "Resolución creativa de problemas orientada al usuario" },
  { icon: "🚀", label: "Running Lean",           desc: "Emprendimiento ágil y validación de ideas con recursos mínimos" },
];

// ── Niveles de formación ───────────────────────────────────────────────────────
const METAS = [
  { val: "1,440", label: "Horas de formación" },
  { val: "5",     label: "Grados" },
  { val: "Aux.",  label: "Nivel técnico" },
];

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function FormacionTecnicaPage() {
  const { slug } = useParams<{ slug: string }>();
  const taller      = getTallerBySlug(slug ?? "");
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif", background: "#f7fdfb" }}>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Fondo decorativo */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, background: "rgba(2,212,126,0.06)", borderRadius: 12, transform: "rotate(45deg)", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none" }}>
              {taller.nombre}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>›</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#02d47e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Formación Técnica MINEDU
            </span>
          </div>

          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "rgba(2,212,126,0.1)", border: "1px solid rgba(2,212,126,0.2)", color: "#02d47e", borderRadius: 100, padding: "4px 12px", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "1rem" }}>
            <span style={{ width: 5, height: 5, background: data.tallerAccent, borderRadius: "50%" }} />
            Secundaria con Formación Técnica · SFT
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Programa <span style={{ color: "#02d47e" }}>Formativo</span><br />
            <span style={{ color: data.tallerAccent }}>{taller.nombre}</span>
          </h1>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 520, marginBottom: "1.75rem" }}>
            {data.presentacion}
          </p>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" as const }}>
            {[
              { val: String(totalBienes || "–"), label: "Bienes del taller" },
              { val: String(modulos.length),       label: "Módulos" },
              { val: data.horasFormacion,           label: "Horas formación" },
              { val: data.nivelEgreso,              label: "Nivel de egreso" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAV INTERNA ─────────────────────────────────────────────────────── */}
      <nav style={{
        background: "#fff", borderBottom: "1px solid rgba(4,57,65,0.08)",
        padding: "0 clamp(1.5rem,5vw,4rem)",
        display: "flex", gap: 4, overflowX: "auto" as const,
        position: "sticky", top: 0, zIndex: 30,
      }}>
        {[
          { label: "Programa formativo", href: `#programa` },
          { label: "Perfil de egreso",   href: `#perfil` },
          { label: "Competencias",        href: `#competencias` },
          { label: "Marco transversal",   href: `#marco` },
          { label: "Zonas del taller",    href: `#zonas` },
        ].map(item => (
          <a key={item.label} href={item.href} style={{
            fontSize: "0.8rem", fontWeight: 600, color: "rgba(4,57,65,0.5)",
            padding: "14px 12px", borderBottom: "2px solid transparent",
            textDecoration: "none", whiteSpace: "nowrap" as const,
            transition: "all 0.18s",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#02d47e"; (e.currentTarget as HTMLElement).style.borderBottomColor = "rgba(2,212,126,0.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(4,57,65,0.5)"; (e.currentTarget as HTMLElement).style.borderBottomColor = "transparent"; }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div style={{ padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem)", display: "flex", flexDirection: "column" as const, gap: "3rem" }}>

        {/* ── 1. PROGRAMA FORMATIVO ──────────────────────────────────────────── */}
        <section id="programa">
          <SectionTag label="Formación Técnica MINEDU" />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", marginBottom: "1.5rem" }}>
            Programa <span style={{ color: "#02d47e" }}>Formativo</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            {METAS.map(m => (
              <div key={m.label} style={{
                background: "#043941", borderRadius: 14, padding: "1.5rem 1.75rem",
                display: "flex", flexDirection: "column" as const, gap: 4,
              }}>
                <div style={{ fontSize: "2rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.04em", lineHeight: 1 }}>{m.val}</div>
                <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>{m.label}</div>
              </div>
            ))}
            {/* Card total bienes */}
            <div style={{ background: `${data.tallerAccent}18`, border: `1px solid ${data.tallerAccent}30`, borderRadius: 14, padding: "1.5rem 1.75rem", display: "flex", flexDirection: "column" as const, gap: 4 }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: data.tallerAccent, letterSpacing: "-0.04em", lineHeight: 1 }}>{totalBienes || "–"}</div>
              <div style={{ fontSize: "0.72rem", color: "rgba(4,57,65,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Bienes del taller</div>
            </div>
          </div>

          {/* Descripción del programa */}
          <div style={{ background: "#fff", border: "1px solid rgba(4,57,65,0.08)", borderRadius: 14, padding: "1.5rem 1.75rem" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#02d47e", marginBottom: "0.75rem" }}>Sobre el programa</div>
            <p style={{ fontSize: "0.9rem", color: "rgba(4,57,65,0.7)", lineHeight: 1.75 }}>
              Programa del <strong>Ministerio de Educación del Perú</strong> dentro del modelo{" "}
              <em>Secundaria con Formación Técnica (SFT)</em>. Forma al estudiante como{" "}
              <strong>{data.nivelEgreso}</strong> en {taller.nombre} con{" "}
              <strong>{data.horasFormacion} horas</strong> de formación a lo largo de 5 grados.
            </p>
            <div style={{ marginTop: "1.25rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(4,57,65,0.06)" }}>
              <Link to={`/taller/${slug}/catalogo`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "#02d47e", color: "#043941", fontWeight: 700,
                fontSize: "0.8rem", padding: "8px 18px", borderRadius: 100,
                textDecoration: "none",
              }}>
                Ver catálogo completo →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. PERFIL DE EGRESO ────────────────────────────────────────────── */}
        <section id="perfil">
          <SectionTag label="Perfil de egreso" />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", marginBottom: "1.5rem" }}>
            ¿Qué sabe hacer el <span style={{ color: "#02d47e" }}>egresado?</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
            {data.perfilEgreso.map((item, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid rgba(4,57,65,0.08)",
                borderRadius: 12, padding: "1.1rem 1.4rem",
                display: "flex", alignItems: "flex-start", gap: "1rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#02d47e"; (e.currentTarget as HTMLElement).style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(4,57,65,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
              >
                <span style={{ fontSize: "1.25rem", flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <p style={{ fontSize: "0.875rem", color: "rgba(4,57,65,0.7)", lineHeight: 1.65 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. UNIDADES DE COMPETENCIA ────────────────────────────────────── */}
        <section id="competencias">
          <SectionTag label="Competencias MINEDU" />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", marginBottom: "1.5rem" }}>
            Unidades de <span style={{ color: "#02d47e" }}>Competencia</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
            {data.unidadesCompetencia.map((uc, i) => (
              <div key={i} style={{
                background: "#fff", border: "1.5px solid rgba(4,57,65,0.08)",
                borderRadius: 12, padding: "1.1rem 1.4rem",
                display: "flex", alignItems: "center", gap: "1.25rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = data.tallerAccent; el.style.boxShadow = `0 4px 16px ${data.tallerAccent}18`; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.boxShadow = "none"; }}
              >
                {/* Número */}
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${data.tallerAccent}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.78rem", fontWeight: 800, color: data.tallerAccent,
                  flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p style={{ fontSize: "0.875rem", color: "#043941", fontWeight: 500, lineHeight: 1.5, flex: 1 }}>{uc}</p>
                <div style={{ fontSize: "0.65rem", background: "rgba(4,57,65,0.06)", color: "rgba(4,57,65,0.4)", padding: "2px 8px", borderRadius: 100, fontWeight: 700, flexShrink: 0 }}>
                  UC {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. MARCO TRANSVERSAL ──────────────────────────────────────────── */}
        <section id="marco" style={{ background: "#043941", borderRadius: 20, padding: "2.5rem", margin: "0 -0" }}>
          <div style={{ marginBottom: "1.5rem" }}>
            <SectionTag label="Competencias transversales" />
            <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#fff", letterSpacing: "-0.025em" }}>
              Marco <span style={{ color: "#02d47e" }}>Transversal</span>
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", marginTop: "0.5rem", maxWidth: 520 }}>
              Competencias que atraviesan todos los módulos del programa y preparan al estudiante para el mundo laboral del siglo XXI.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
            {MARCO_TRANSVERSAL.map((item) => (
              <div key={item.label} style={{
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(2,212,126,0.1)",
                borderRadius: 12, padding: "1.25rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.08)"; el.style.borderColor = "rgba(2,212,126,0.3)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.05)"; el.style.borderColor = "rgba(2,212,126,0.1)"; }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.6rem" }}>{item.icon}</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff", marginBottom: "0.4rem" }}>{item.label}</div>
                <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. ZONAS DEL TALLER ───────────────────────────────────────────── */}
        <section id="zonas">
          <SectionTag label="Infraestructura" />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", marginBottom: "1.5rem" }}>
            Zonas del <span style={{ color: "#02d47e" }}>Taller</span>
          </h2>

          <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
            {data.inventoryZones.map((zone, i) => (
              <div key={i} style={{
                background: "#fff", border: "1px solid rgba(4,57,65,0.08)",
                borderRadius: 12, padding: "1.25rem 1.5rem",
                display: "flex", alignItems: "center", gap: "1.25rem",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#02d47e"; (e.currentTarget as HTMLElement).style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(4,57,65,0.08)"; (e.currentTarget as HTMLElement).style.transform = "translateX(0)"; }}
              >
                <div style={{ width: 44, height: 44, borderRadius: 10, background: `${data.tallerAccent}15`, display: "grid", placeItems: "center", fontSize: "1.25rem", flexShrink: 0 }}>
                  {zone.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#043941" }}>{zone.name}</div>
                  <div style={{ fontSize: "0.8rem", color: "rgba(4,57,65,0.5)", marginTop: 2 }}>{zone.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", background: "#d2ffe1", color: "#043941", fontSize: "0.7rem", fontWeight: 700, padding: "4px 12px", borderRadius: 100, flexShrink: 0, whiteSpace: "nowrap" as const }}>
                  {zone.count} bienes
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA: ir al catálogo completo ─────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg,#043941,#045f6c)",
          borderRadius: 16, padding: "1.75rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1.5rem", flexWrap: "wrap" as const,
        }}>
          <div>
            <div style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>¿Listo para explorar el programa?</div>
            <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              Accede al catálogo completo de unidades didácticas, sesiones y recursos por módulo.
            </div>
          </div>
          <Link to={`/taller/${slug}/catalogo`} style={{
            background: "#02d47e", color: "#043941", fontWeight: 700,
            fontSize: "0.875rem", padding: "10px 22px", borderRadius: 100,
            textDecoration: "none", whiteSpace: "nowrap" as const,
          }}>
            Ver catálogo →
          </Link>
        </div>

      </div>
    </main>
  );
}
