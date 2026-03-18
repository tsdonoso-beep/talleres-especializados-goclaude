import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { getTotalBienesByTaller } from "@/data/bienesData";
import { buildModulosForTaller, getLiveSessionsForTaller } from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ── Íconos ────────────────────────────────────────────────────────────────────
const IcoDoc = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
  </svg>
);
const IcoGrid = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const IcoWave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IcoVideo = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
  </svg>
);
const IcoFile = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
  </svg>
);

// ── Card de sección ───────────────────────────────────────────────────────────
function SecCard({
  icon, etiqueta, nombre, descripcion, cta, onClick,
}: {
  icon: React.ReactNode; etiqueta: string; nombre: string;
  descripcion: string; cta: string; onClick: () => void;
}) {
  const base: React.CSSProperties = {
    background: "#fff", border: "1.5px solid rgba(4,57,65,0.08)",
    borderRadius: 14, padding: "1.25rem", cursor: "pointer",
    textAlign: "left", display: "flex", flexDirection: "column", gap: "0.55rem",
    transition: "border-color .2s, transform .2s, box-shadow .2s",
    fontFamily: "'Manrope', sans-serif", width: "100%",
  };
  return (
    <button style={base} onClick={onClick}
      onMouseEnter={e => { const el = e.currentTarget; el.style.borderColor = "#02d47e"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 6px 20px rgba(2,212,126,0.1)"; }}
      onMouseLeave={e => { const el = e.currentTarget; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(4,57,65,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "#043941", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "0.63rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(4,57,65,0.38)", marginBottom: 3 }}>{etiqueta}</div>
        <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#043941", lineHeight: 1.2 }}>{nombre}</div>
      </div>
      <div style={{ fontSize: "0.73rem", color: "rgba(4,57,65,0.48)", lineHeight: 1.55, flex: 1 }}>{descripcion}</div>
      <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(4,57,65,0.3)", marginTop: "0.15rem" }}>{cta} →</div>
    </button>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function TallerDashboard() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();

  const taller      = getTallerBySlug(slug ?? "");
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  // Título: primera(s) palabra(s) blanco, penúltima verde, última en acento del taller
  const palabras = taller.nombre.split(" ");
  const ultima   = palabras[palabras.length - 1];
  const penultima = palabras.length > 1 ? palabras[palabras.length - 2] : "";
  const primeras  = palabras.length > 2 ? palabras.slice(0, -2).join(" ") : "";

  const secciones = [
    {
      icon: <IcoDoc />, etiqueta: "Programa · Competencias", nombre: "Formación Técnica",
      descripcion: "Conoce el programa formativo, las unidades de competencia y el perfil de egreso del estudiante.",
      cta: "Ver programa", onClick: () => navigate(`/taller/${slug}/formacion`),
    },
    {
      icon: <IcoGrid />, etiqueta: "Repositorio", nombre: "Recursos del taller",
      descripcion: "Fichas técnicas, videos de uso, matrices IPERC y material para cada equipo del taller.",
      cta: "Explorar recursos", onClick: () => navigate(`/taller/${slug}/repositorio`),
    },
    {
      icon: <IcoWave />, etiqueta: `${modulos.length} módulos · Certificación`, nombre: "Ruta de Aprendizaje",
      descripcion: "Recorre los módulos y guía a tus estudiantes paso a paso hacia la certificación técnica.",
      cta: "Ver ruta", onClick: () => navigate(`/taller/${slug}/ruta`),
    },
    {
      icon: <IcoVideo />, etiqueta: "En vivo · Asínc.", nombre: "Sesiones",
      descripcion: "Gestiona sesiones en vivo, accede a grabaciones y videotutoriales por módulo.",
      cta: "Ver sesiones", onClick: () => navigate(`/taller/${slug}/sesiones`),
    },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif", background: "#e3f8fb" }}>
      <div style={{ padding: "clamp(1.5rem,4vw,2.5rem) clamp(1.5rem,4vw,2.5rem)", display: "flex", flexDirection: "column", gap: "0.75rem" }}>

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section style={{
          background: "#043941", borderRadius: 18,
          display: "grid", gridTemplateColumns: "1fr 42%", alignItems: "stretch",
          position: "relative", overflow: "hidden", minHeight: 340,
        }}>
          {/* Grid decorativo fondo */}
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.04) 0,rgba(2,212,126,0.04) 1px,transparent 1px,transparent 50px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.04) 0,rgba(2,212,126,0.04) 1px,transparent 1px,transparent 50px)" }} />

          <div style={{ position: "relative", zIndex: 2, padding: "clamp(2rem,5vw,2.75rem)" }}>
            {/* Breadcrumb + SidebarTrigger */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1rem" }}>
              <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(2,212,126,0.12)", border: "1px solid rgba(2,212,126,0.2)", color: "#02d47e", borderRadius: 100, padding: "4px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: data.tallerAccent, flexShrink: 0 }} />
                Taller de Educación para el Trabajo
              </div>
            </div>

            {/* Título dinámico */}
            <h1 style={{ fontSize: "clamp(2rem,4vw,2.5rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#fff", marginBottom: "0.9rem" }}>
              {primeras && <>{primeras}<br /></>}
              {penultima && <><span style={{ color: "#02d47e" }}>{penultima}</span><br /></>}
              <span style={{ color: data.tallerAccent }}>{ultima}</span>
            </h1>

            {/* Descripción */}
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 440, marginBottom: "1rem" }}>
              {data.presentacion}
            </p>

            {/* Micro-datos */}
            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap" as const, marginBottom: "1.75rem" }}>
              {[
                { icon: "👥", label: "30 estudiantes" },
                { icon: "📦", label: `${totalBienes || data.inventoryZones.reduce((a, z) => a + z.count, 0)} bienes` },
                { icon: "🏗️", label: `${data.inventoryZones.length} zonas de trabajo` },
              ].map(m => (
                <div key={m.label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>
                  <span style={{ fontSize: 13 }}>{m.icon}</span>{m.label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
              <button
                onClick={() => navigate(`/taller/${slug}/repositorio`)}
                style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.8rem", padding: "0.7rem 1.5rem", borderRadius: 100, border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <IcoFile /> Explorar recursos
              </button>
              <button
                onClick={() => navigate(`/taller/${slug}/ruta`)}
                style={{ background: "rgba(255,255,255,0.12)", color: "#fff", fontWeight: 600, fontSize: "0.8rem", padding: "0.7rem 1.5rem", borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.28)", cursor: "pointer", fontFamily: "'Manrope', sans-serif" }}
              >
                Iniciar ruta de certificación →
              </button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" as const, paddingTop: "1.5rem", marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { val: "+300", label: "Recursos disponibles" },
                { val: String(data.unidadesCompetencia.length), label: "Competencias técnicas" },
                { val: String(modulos.length), label: "Módulos formativos" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: "0.67rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual derecho — ocupa toda la altura */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ width: "100%", height: "100%", clipPath: "polygon(12% 0%,100% 0%,100% 100%,0% 100%)", overflow: "hidden" }}>
              <img src={taller.imagen} alt={taller.nombre} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(4,57,65,0.5) 0%, rgba(4,57,65,0.1) 40%, transparent 100%)", pointerEvents: "none" }} />
            </div>
            <div style={{ position: "absolute", left: 0, top: "35%", width: 3, height: 65, background: `linear-gradient(to bottom,${data.tallerAccent},transparent)`, borderRadius: 2 }} />
          </div>
        </section>

        {/* ── DESCRIPCIÓN + 5 COMPETENCIAS ─────────────────────────────────── */}
        <section style={{
          background: "#fff", borderRadius: 16, border: "1px solid rgba(4,57,65,0.08)",
          padding: "1.75rem 2rem",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start",
        }}>
          {/* Texto amigable */}
          <div>
            <div style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#02d47e", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 20, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
              Sobre este taller
            </div>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#043941", lineHeight: 1.2, marginBottom: "0.75rem" }}>
              Todo lo que necesitas para enseñar {taller.nombre.toLowerCase()}
            </h2>
            <p style={{ fontSize: "0.85rem", color: "rgba(4,57,65,0.65)", lineHeight: 1.75 }}>
              El taller está diseñado para que tus estudiantes aprendan haciendo. Con{" "}
              <strong>{totalBienes || data.inventoryZones.reduce((a, z) => a + z.count, 0)} bienes</strong> entre herramientas,
              equipamiento y simuladores distribuidos en{" "}
              <strong>{data.inventoryZones.length} zonas especializadas</strong>, cada clase se convierte en
              una experiencia práctica real.
              <br /><br />
              Aquí encontrarás todo para planificar, enseñar y evaluar: desde fichas técnicas de cada
              equipo hasta sesiones en vivo con especialistas. El objetivo es uno solo — que tus
              estudiantes lleguen a la{" "}
              <strong>certificación técnica</strong> con las habilidades que el sector demanda hoy.
            </p>
          </div>

          {/* 5 unidades de competencia reales */}
          <div>
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
        </section>

        {/* ── EXPLORA LA PLATAFORMA ─────────────────────────────────────────── */}
        <div style={{ fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(4,57,65,0.4)", display: "flex", alignItems: "center", gap: 8, padding: "0.25rem 0" }}>
          Explora la plataforma
          <span style={{ flex: 1, height: 1, background: "rgba(4,57,65,0.1)", display: "block" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.75rem" }}>
          {secciones.map(s => (
            <SecCard key={s.nombre} {...s} />
          ))}
        </div>

        {/* ── TOUR 3D — solo automotriz ────────────────────────────────────── */}
        {slug === "mecanica-automotriz" && (
          <>
            <div style={{ fontSize: "0.67rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "rgba(4,57,65,0.4)", display: "flex", alignItems: "center", gap: 8, padding: "0.25rem 0", marginTop: "0.5rem" }}>
              Conoce más sobre el taller
              <span style={{ flex: 1, height: 1, background: "rgba(4,57,65,0.1)", display: "block" }} />
            </div>
            <div style={{ borderRadius: 16, overflow: "hidden", border: "1.5px solid rgba(4,57,65,0.08)", background: "#fff" }}>
              <iframe
                src="/tour-3d-automotriz-v2.html"
                title="Tour 3D — Mecánica Automotriz"
                style={{ width: "100%", height: "80vh", border: "none", display: "block" }}
                allow="accelerometer; gyroscope"
              />
            </div>
          </>
        )}

      </div>
    </main>
  );
}
