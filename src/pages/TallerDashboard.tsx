import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import {
  getBienesByTaller,
  getZonasUnicasByTaller,
  getTotalBienesByTaller,
} from "@/data/bienesData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { PageHeader } from "@/components/AppLayout";
import { ArrowLeft } from "lucide-react";

// ─── Tipos de contenido ───────────────────────────────────────
const TIPO_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  PDF:         { label: "PDF",         bg: "rgba(4,57,65,0.08)",   color: "#045f6c" },
  VIDEO:       { label: "Video",       bg: "rgba(2,212,126,0.1)",  color: "#00c16e" },
  INTERACTIVO: { label: "Interactivo", bg: "rgba(6,182,212,0.1)",  color: "#0891b2" },
  QUIZ:        { label: "Quiz",        bg: "rgba(234,179,8,0.12)", color: "#ca8a04" },
  "EN VIVO":   { label: "EN VIVO",     bg: "rgba(239,68,68,0.12)", color: "#ef4444" },
};

const M1_BADGES: Record<string, { label: string; bg: string; color: string }> = {
  s1: { label: "Arquitectura", bg: "rgba(59,130,246,0.1)",  color: "#3b82f6" },
  s2: { label: "Arquitectura", bg: "rgba(59,130,246,0.1)",  color: "#3b82f6" },
  s3: { label: "Técnico",      bg: "rgba(249,115,22,0.1)",  color: "#f97316" },
  s4: { label: "Seguridad",    bg: "rgba(239,68,68,0.1)",   color: "#ef4444" },
  s5: { label: "Pedagógico",   bg: "rgba(139,92,246,0.1)",  color: "#8b5cf6" },
  s6: { label: "Pedagógico",   bg: "rgba(139,92,246,0.1)",  color: "#8b5cf6" },
  s7: { label: "Evaluación",   bg: "rgba(234,179,8,0.12)",  color: "#ca8a04" },
};

// ─── Datos estáticos ──────────────────────────────────────────
const INVENTORY_ZONES = [
  { icon: "🔬", name: "Zona de Investigación, Gestión y Diseño", desc: "Cámaras, grabadoras, equipos de documentación y gestión de proyectos", count: 52 },
  { icon: "⚙️", name: "Área de Mecánica", desc: "Elevadores hidráulicos, compresoras, bancos de trabajo y equipos de servicio", count: 11 },
  { icon: "🧰", name: "Depósito / Almacén", desc: "Gatos hidráulicos, juego de llaves, extractores, herramientas de mano y kits", count: 76 },
  { icon: "🖥️", name: "Área de Simulación", desc: "Módulos educativos: suspensión/frenos ABS, transmisión, sistema eléctrico y motor V8", count: 14 },
];

const REPO_CARDS = [
  { icon: "📋", title: "Fichas Técnicas",          desc: "Procedimientos paso a paso, normas de seguridad y protocolos de trabajo para cada actividad del taller.", count: "+45 fichas disponibles" },
  { icon: "🎬", title: "Videotutoriales",           desc: "Demostraciones en video de procedimientos técnicos filmados en el propio taller de GRAMA.", count: "+32 videos" },
  { icon: "📐", title: "Guías de Evaluación",       desc: "Rúbricas, listas de cotejo y formatos de evaluación por competencias alineados al currículo nacional.", count: "+28 instrumentos" },
  { icon: "🧪", title: "Proyectos Prácticos",       desc: "Proyectos integrados por bimestre con materiales, tiempos estimados y criterios de logro.", count: "16 proyectos" },
  { icon: "📊", title: "Sesiones de Aprendizaje",   desc: "Planificaciones editables con situaciones significativas, estrategias y recursos integrados.", count: "+60 sesiones" },
  { icon: "🔬", title: "Material de Estudiante",    desc: "Hojas de trabajo, cuadernillos y materiales imprimibles listos para usar en aula-taller.", count: "+80 materiales" },
];

const SESIONES = [
  { status: "active",    badge: "🔴 En vivo", badgeBg: "rgba(239,68,68,0.15)", badgeBorder: "rgba(239,68,68,0.3)",   badgeColor: "#f87171", title: "Diagnóstico OBD2 en tiempo real", desc: "Demostración práctica de lectura de códigos de falla con escáner profesional. Incluye resolución de dudas.", tags: ["Hoy 6:00 PM","Nivel Básico","+42 inscritos"] },
  { status: "scheduled", badge: "🟡 Próxima",  badgeBg: "rgba(249,115,22,0.15)", badgeBorder: "rgba(249,115,22,0.3)", badgeColor: "#fdba74", title: "Sistemas de frenos ABS: teoría y práctica", desc: "Exploraremos el funcionamiento del sistema ABS y su mantenimiento correctivo con vehículos del taller.", tags: ["Jue 26 — 7:00 PM","Nivel Intermedio"] },
  { status: "scheduled", badge: "🟡 Próxima",  badgeBg: "rgba(249,115,22,0.15)", badgeBorder: "rgba(249,115,22,0.3)", badgeColor: "#fdba74", title: "Vehículos eléctricos: introducción docente", desc: "Sesión especial para docentes sobre cómo incorporar el tema de vehículos eléctricos en el currículo.", tags: ["Sáb 28 — 10:00 AM","Docentes"] },
  { status: "recorded",  badge: "⚪ Grabada",  badgeBg: "rgba(100,116,139,0.15)", badgeBorder: "rgba(100,116,139,0.3)", badgeColor: "#94a3b8", title: "Mantenimiento preventivo del motor", desc: "Sesión grabada: procedimientos completos de mantenimiento de los 10,000 km. Disponible en el repositorio.", tags: ["Grabada","1h 20min","+180 vistas"] },
];

// ─── Helpers visuales ─────────────────────────────────────────
const SectionTag = ({ label, dark = false }: { label: string; dark?: boolean }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#02d47e", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: "1rem" }}>
    <span style={{ width: 28, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
    {label}
    <span style={{ width: 28, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
  </div>
);

const SectionHeader = ({ tag, title, accent, dark = false }: { tag: string; title: string; accent: string; dark?: boolean }) => (
  <div style={{ marginBottom: "3.5rem" }}>
    <div style={{ display: "block" }}><SectionTag label={tag} dark={dark} /></div>
    <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: dark ? "#fff" : "#043941", marginTop: "0.75rem", lineHeight: 1.1 }}>
      {title} <span style={{ color: "#02d47e" }}>{accent}</span>
    </h2>
  </div>
);

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────
const TallerDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [openIdx, setOpenIdx] = useState<number>(0);

  const taller      = getTallerBySlug(slug ?? "");
  const bienes      = useMemo(() => getBienesByTaller(slug ?? ""), [slug]);
  const zonasUnicas = useMemo(() => getZonasUnicasByTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#e3f8fb", borderRadius: 20, padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>🔧</p>
            <h2 style={{ fontWeight: 800, color: "#043941", marginBottom: 12 }}>Taller no encontrado</h2>
            <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <Link to="/" style={{ color: "rgba(255,255,255,0.5)", display: "flex", alignItems: "center" }}>
          <ArrowLeft style={{ width: 18, height: 18 }} />
        </Link>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{taller.nombre}</span>
        <span style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.35)" }}>T{taller.numero}</span>
      </PageHeader>

      <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif" }}>

        {/* ── HERO ─────────────────────────────────────────────── */}
        <section style={{
          background: "linear-gradient(135deg,#043941 0%,#052e35 50%,#061f25 100%)",
          padding: "clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem) clamp(3rem,6vw,5rem)",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Fondo decorativo */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.03) 0px,rgba(2,212,126,0.03) 1px,transparent 1px,transparent 60px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.03) 0px,rgba(2,212,126,0.03) 1px,transparent 1px,transparent 60px)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, background: "rgba(2,212,126,0.07)", borderRadius: 12, transform: "rotate(45deg)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: "30%", right: "40%", width: 60, height: 60, background: "#f97316", borderRadius: "50%", opacity: 0.12, pointerEvents: "none" }} />

          {/* Contenido */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(2,212,126,0.1)", border: "1px solid rgba(2,212,126,0.25)", color: "#02d47e", borderRadius: 100, padding: "0.35rem 1rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "1.5rem" }}>
              <span style={{ width: 6, height: 6, background: "#F97316", borderRadius: "50%", flexShrink: 0 }} />
              Taller de Educación para el Trabajo
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem,4.5vw,4.2rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#fff", marginBottom: "1.5rem" }}>
              Mecánica<br/>
              <span style={{ color: "#02d47e" }}>Automotriz</span><br/>
              <span style={{ color: "#F97316" }}>en Acción</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 440, marginBottom: "2.5rem" }}>
              {taller.descripcion}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const, marginBottom: "3rem" }}>
              <Link to={`/taller/${slug}/repositorio`} style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                🔧 Explorar recursos
              </Link>
              <Link to={`/taller/${slug}/catalogo`} style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                Ver programa →
              </Link>
            </div>
            <div style={{ display: "flex", gap: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[{ val: "+300", label: "Recursos disponibles" }, { val: "6", label: "Módulos formativos" }, { val: "4", label: "Sesiones en vivo" }].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                    <span style={{ color: "#02d47e" }}>{s.val}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, letterSpacing: "0.04em", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 520, height: 480 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,#0a4a56 0%,#043941 60%,#021e22 100%)", clipPath: "polygon(12% 0%,100% 0%,100% 100%,0% 88%)", display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: 12 }}>
                <span style={{ fontSize: "5rem", opacity: 0.35 }}>🔧</span>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Foto del taller en acción</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, justifyContent: "center", padding: "0 2rem" }}>
                  {zonasUnicas.map(z => (
                    <span key={z} style={{ background: "rgba(2,212,126,0.12)", color: "#02d47e", fontSize: "0.68rem", fontWeight: 600, padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(2,212,126,0.2)" }}>{z}</span>
                  ))}
                </div>
              </div>
              <div style={{ position: "absolute", left: 0, top: "40%", width: 4, height: 120, background: "linear-gradient(to bottom,#F97316,transparent)", borderRadius: 2 }} />
            </div>
          </div>
        </section>

        {/* ── NAV BAR IN-PAGE ──────────────────────────────────── */}
        <nav style={{
          background: "linear-gradient(135deg, #052e35 0%, #043941 100%)",
          borderBottom: "1px solid rgba(2,212,126,0.15)",
          padding: "0 clamp(1.5rem,5vw,4rem)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}>
          <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
            {[
              { label: "📦 Repositorio", target: "repositorio" },
              { label: "🗺️ Ruta de Aprendizaje", target: "ruta" },
              { label: "🔴 Sesiones en Vivo", target: "sesiones" },
            ].map(item => (
              <button
                key={item.target}
                onClick={() => document.getElementById(item.target)?.scrollIntoView({ behavior: "smooth", block: "start" })}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.65)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  padding: "1rem 1.5rem",
                  cursor: "pointer",
                  borderBottom: "2px solid transparent",
                  transition: "all 0.2s",
                  letterSpacing: "0.01em",
                  fontFamily: "'Manrope', sans-serif",
                }}
                onMouseEnter={e => { const el = e.currentTarget; el.style.color = "#02d47e"; el.style.borderBottomColor = "#02d47e"; }}
                onMouseLeave={e => { const el = e.currentTarget; el.style.color = "rgba(255,255,255,0.65)"; el.style.borderBottomColor = "transparent"; }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── PRESENTACIÓN ─────────────────────────────────────── */}
        <section style={{ background: "#fff", padding: "clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem)", textAlign: "center" as const, borderBottom: "1px solid rgba(4,57,65,0.07)" }}>
          <SectionTag label="Sobre este espacio" />
          <p style={{ fontSize: "clamp(1.1rem,2.2vw,1.4rem)", fontWeight: 400, lineHeight: 1.8, color: "#043941", maxWidth: 760, margin: "0 auto" }}>
            Este es tu espacio como docente: un entorno diseñado para que puedas{" "}
            <strong style={{ fontWeight: 700, color: "#02d47e" }}>planificar, enseñar y evaluar</strong>{" "}
            con todos los recursos del taller automotriz al alcance. Desde fichas técnicas hasta proyectos — todo en un solo lugar.
          </p>
        </section>

        {/* ── PROGRAMA FORMATIVO ───────────────────────────────── */}
        <section id="programa" style={{ background: "#e3f8fb", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag="Formación Técnica MINEDU" title="Programa" accent="Formativo" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "3rem", alignItems: "start" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>
              <p style={{ color: "#043941", opacity: 0.7, lineHeight: 1.75, fontSize: "0.95rem" }}>
                Programa del <strong>Ministerio de Educación del Perú</strong> dentro del modelo{" "}
                <em>Secundaria con Formación Técnica (SFT)</em>. Forma al estudiante como{" "}
                <strong>Auxiliar Técnico</strong> en Mecánica Automotriz con <strong>1,440 horas</strong> de formación.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                {[
                  { val: String(totalBienes || bienes.length), label: "Bienes del taller" },
                  { val: "Aux.", label: "Nivel Técnico" },
                  { val: "6",   label: "Módulos" },
                ].map(m => (
                  <div key={m.label} style={{ background: "#043941", borderRadius: 14, padding: "1.5rem", textAlign: "center" as const }}>
                    <div style={{ fontSize: m.val.length > 3 ? "1.2rem" : "2rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em" }}>{m.val}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", border: "1px solid rgba(4,57,65,0.08)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#02d47e", marginBottom: "0.75rem" }}>Perfil de egreso</div>
                {[
                  { icon: "🔧", text: "Mantenimiento preventivo y reparación de motores, frenos, dirección y suspensión" },
                  { icon: "💻", text: "Uso de IA generativa, trabajo colaborativo en plataformas digitales y documentación técnica" },
                  { icon: "🚀", text: "Design Thinking y gestión de microempresas automotrices con metodologías ágiles" },
                ].map(item => (
                  <div key={item.icon} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: "0.6rem" }}>
                    <span style={{ color: "#F97316", flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(4,57,65,0.7)", lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
              {INVENTORY_ZONES.map(zone => (
                <div key={zone.name}
                  style={{ background: "#fff", border: "1px solid rgba(4,57,65,0.08)", borderRadius: 12, padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", gap: "1.25rem", transition: "all .25s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#02d47e"; el.style.transform = "translateX(6px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "rgba(249,115,22,0.12)", display: "grid", placeItems: "center", fontSize: "1.25rem", flexShrink: 0 }}>{zone.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#043941" }}>{zone.name}</h4>
                    <p style={{ fontSize: "0.8rem", color: "rgba(4,57,65,0.5)", marginTop: 2 }}>{zone.desc}</p>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#d2ffe1", color: "#043941", fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: 100, whiteSpace: "nowrap" as const }}>{zone.count} bienes</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REPOSITORIO ──────────────────────────────────────── */}
        <section id="repositorio" style={{ background: "#043941", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, background: "rgba(2,212,126,0.05)", borderRadius: "50%", pointerEvents: "none" }} />
          <SectionHeader tag="Recursos" title="Repositorio" accent="de Materiales" dark />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {REPO_CARDS.map(card => (
              <Link key={card.title} to={`/taller/${slug}/repositorio`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(2,212,126,0.1)", borderRadius: 16, padding: "2rem", transition: "all .3s", textDecoration: "none", display: "block", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.borderColor = "rgba(2,212,126,0.25)"; el.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.borderColor = "rgba(2,212,126,0.1)"; el.style.transform = "translateY(0)"; }}
              >
                <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{card.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>{card.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{card.desc}</p>
                <div style={{ fontSize: "0.72rem", color: "#02d47e", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{card.count}</div>
              </Link>
            ))}
          </div>
          <div style={{ marginTop: "3rem" }}>
            <div style={{ background: "linear-gradient(135deg,rgba(2,212,126,0.1),rgba(4,95,108,0.3))", border: "1px solid rgba(2,212,126,0.2)", borderRadius: 20, padding: "3rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" as const }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#fff", maxWidth: 400 }}>Todo el repositorio, <span style={{ color: "#02d47e" }}>en tus manos</span></h3>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", maxWidth: 400, marginTop: "0.5rem" }}>Accede al catálogo completo de recursos del taller. Filtra por unidad, grado, competencia o tipo de recurso.</p>
              </div>
              <Link to={`/taller/${slug}/repositorio`} style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" as const }}>Ir al repositorio →</Link>
            </div>
          </div>
        </section>

        {/* ── RUTA DE APRENDIZAJE ──────────────────────────────── */}
        <section id="ruta" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag={`${modulos.length} módulos · 4 sesiones en vivo`} title="Tu Ruta de" accent="Aprendizaje" />
          <div style={{ maxWidth: 900, margin: "0 auto 2rem", display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
            {modulos.map((modulo, idx) => {
              const isFinal  = modulo.orden === 6;
              const isActive = openIdx === idx;
              const hasLive  = modulo.contenidos.some(c => c.tipo === "EN VIVO") || modulo.subSecciones?.some(s => s.contenidos.some(c => c.tipo === "EN VIVO"));
              return (
                <div key={modulo.id} style={{ background: isFinal ? "linear-gradient(135deg,rgba(2,212,126,0.02),#fff)" : "#fff", border: `1.5px solid ${isActive ? "#02d47e" : isFinal ? "rgba(2,212,126,0.3)" : "rgba(4,57,65,0.1)"}`, borderRadius: 14, overflow: "hidden", boxShadow: isActive ? "0 4px 24px rgba(2,212,126,0.12)" : "none", transition: "border-color .25s,box-shadow .25s" }}>
                  <button onClick={() => setOpenIdx(isActive ? -1 : idx)} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "1.25rem", padding: "1.25rem 1.5rem", textAlign: "left" as const }}>
                    <span style={{ fontSize: "1.5rem", fontWeight: 800, minWidth: "2.5rem", flexShrink: 0, color: isActive ? "#F97316" : "rgba(4,57,65,0.2)", letterSpacing: "-0.04em" }}>{String(idx + 1).padStart(2, "0")}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "#043941" }}>{modulo.icon} {modulo.nombre}</span>
                        {isFinal && <span style={{ fontSize: "0.68rem", background: "rgba(2,212,126,0.15)", color: "#02d47e", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>🎓 Certifica</span>}
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "rgba(4,57,65,0.5)", marginTop: 3, lineHeight: 1.4 }}>{modulo.descripcion}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
                      {hasLive && <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(239,68,68,0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }}>🔴 En vivo</span>}
                      {modulo.subSecciones && <span style={{ fontSize: "0.65rem", fontWeight: 700, padding: "3px 10px", borderRadius: 100, background: "rgba(59,130,246,0.1)", color: "#3b82f6", border: "1px solid rgba(59,130,246,0.2)" }}>7 temas</span>}
                      <span style={{ fontSize: "1rem", color: isActive ? "#02d47e" : "rgba(4,57,65,0.3)", transform: isActive ? "rotate(180deg)" : "none", transition: "transform .3s", display: "inline-block" }}>▾</span>
                    </div>
                  </button>
                  {isActive && (
                    <div style={{ borderTop: "1px solid rgba(4,57,65,0.06)", padding: "0.5rem 1.5rem 1rem" }}>
                      {modulo.subSecciones
                        ? modulo.subSecciones.map((sub, si) => {
                            const b = M1_BADGES[`s${si + 1}`] ?? { label: "Tema", bg: "rgba(4,57,65,0.08)", color: "#043941" };
                            return <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(4,57,65,0.04)", fontSize: "0.82rem", color: "rgba(4,57,65,0.75)", fontWeight: 500 }}><span style={{ fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "2px 8px", borderRadius: 4, background: b.bg, color: b.color, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{b.label}</span><span>{sub.titulo}</span></div>;
                          })
                        : modulo.contenidos.map(c => {
                            const b = TIPO_BADGE[c.tipo] ?? TIPO_BADGE.PDF;
                            const isLive = c.tipo === "EN VIVO";
                            const dur = (c as any).duracion ?? ((c as any).estimatedMinutes ? `${(c as any).estimatedMinutes} min` : (c as any).durationMinutes ? `${(c as any).durationMinutes} min` : "");
                            return <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(4,57,65,0.04)", fontSize: "0.82rem", color: "rgba(4,57,65,0.75)", fontWeight: 500, background: isLive ? "rgba(239,68,68,0.03)" : "transparent" }}><span style={{ fontSize: "0.62rem", fontWeight: 700, textTransform: "uppercase" as const, padding: "2px 8px", borderRadius: 4, background: b.bg, color: b.color, whiteSpace: "nowrap" as const, flexShrink: 0 }}>{b.label}{dur ? ` · ${dur}` : ""}</span><span>{c.titulo}</span></div>;
                          })}
                      <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid rgba(4,57,65,0.06)" }}>
                        <Link to={`/taller/${slug}/modulo/${modulo.orden}`} style={{ fontSize: "0.82rem", fontWeight: 700, color: "#02d47e", textDecoration: "none" }}>Ir al Módulo {modulo.orden} →</Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ maxWidth: 900, margin: "0 auto", background: "linear-gradient(135deg,#043941,#045f6c)", borderRadius: 16, padding: "1.75rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem" }}>🎓</span>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>Certificación por módulo</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Se otorga un certificado al finalizar satisfactoriamente cada módulo desde el Módulo 1.</div>
              </div>
            </div>
            <Link to={`/taller/${slug}/modulo/1`} style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.85rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" as const }}>Iniciar Módulo 1 →</Link>
          </div>
        </section>

        {/* ── CURIOSIDADES ─────────────────────────────────────── */}
        <section style={{ background: "#e3f8fb", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag="Aprende más" title="¿Sabías" accent="esto?" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "3rem", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1rem" }}>
              {[
                { icon: "⚡", title: "El futuro es eléctrico", text: "Para 2035, más del 40% de los vehículos nuevos en Latinoamérica serán eléctricos o híbridos. ¿Está tu taller preparado?" },
                { icon: "🛠️", title: "Más de 30,000 piezas", text: "Un automóvil moderno tiene más de 30,000 piezas individuales. La mecánica automotriz es una de las especialidades técnicas más complejas." },
                { icon: "📡", title: "Diagnóstico digital", text: "Los autos modernos tienen más de 100 sensores. El diagnóstico computarizado es la habilidad más demandada del sector." },
              ].map(c => (
                <div key={c.icon}
                  style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", border: "1px solid rgba(4,57,65,0.06)", display: "flex", alignItems: "flex-start", gap: "1rem", transition: "all .25s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#02d47e"; el.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.06)"; el.style.transform = "translateY(0)"; }}
                >
                  <span style={{ fontSize: "1.5rem", flexShrink: 0, marginTop: 2 }}>{c.icon}</span>
                  <div>
                    <h4 style={{ fontWeight: 700, fontSize: "0.9rem", color: "#043941", marginBottom: 4 }}>{c.title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "rgba(4,57,65,0.55)", lineHeight: 1.5 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: "#043941", borderRadius: 20, padding: "2.5rem", textAlign: "center" as const }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎯</div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>Mini Quiz Automotriz</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "2rem" }}>Pon a prueba tus conocimientos con nuestro quiz de curiosidades. ¡Ideal para motivar a tus estudiantes al inicio de clase!</p>
              <Link to={`/taller/${slug}/modulo/1`} style={{ background: "#F97316", color: "#fff", fontWeight: 700, fontSize: "0.85rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>🚀 Iniciar Quiz</Link>
            </div>
          </div>
        </section>

        {/* ── SESIONES EN VIVO ─────────────────────────────────── */}
        <section id="sesiones" style={{ background: "#043941", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag="En tiempo real" title="Sesiones en" accent="Vivo" dark />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {SESIONES.map(s => (
              <div key={s.title}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(2,212,126,0.1)", borderRadius: 16, padding: "2rem", transition: "all .3s" }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.07)"; el.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(255,255,255,0.04)"; el.style.transform = "translateY(0)"; }}
              >
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: s.badgeBg, border: `1px solid ${s.badgeBorder}`, color: s.badgeColor, fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.08em", padding: "4px 10px", borderRadius: 100, marginBottom: "1rem" }}>{s.badge}</div>
                <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#fff", marginBottom: "0.5rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "1.5rem" }}>{s.desc}</p>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" as const }}>
                  {s.tags.map(tag => <span key={tag} style={{ fontSize: "0.72rem", fontWeight: 600, color: "#02d47e", background: "rgba(2,212,126,0.1)", padding: "3px 10px", borderRadius: 100 }}>{tag}</span>)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "3rem", background: "linear-gradient(135deg,rgba(2,212,126,0.08),rgba(4,95,108,0.3))", border: "1px solid rgba(2,212,126,0.15)", borderRadius: 16, padding: "2rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1.5rem" }}>
            <div>
              <strong style={{ color: "#fff", display: "block", fontSize: "1.1rem", marginBottom: 4 }}>¿Quieres recibir recordatorios de sesiones?</strong>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.88rem" }}>Inscríbete al calendario y recibe notificaciones antes de cada transmisión en vivo.</p>
            </div>
            <button style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, border: "none", cursor: "pointer", whiteSpace: "nowrap" as const }}>📅 Ver calendario completo</button>
          </div>
        </section>

        {/* ── RECORRIDO VIRTUAL ────────────────────────────────── */}
        <section id="recorrido" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag="El taller" title="Conoce nuestro" accent="Espacio" />
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <div style={{ background: "linear-gradient(135deg,#043941,#045f6c)", borderRadius: 20, height: 380, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "1rem", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,rgba(2,212,126,0.03) 0px,rgba(2,212,126,0.03) 1px,transparent 1px,transparent 30px)", pointerEvents: "none" }} />
              <span style={{ fontSize: "4rem" }}>🏭</span>
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>Recorrido Virtual 360°</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" as const, justifyContent: "center" }}>
                {["Zona Investigación", "Zona Innovación", "Zona Almacén", "Seguridad"].map(chip => (
                  <span key={chip} style={{ background: "rgba(2,212,126,0.15)", color: "#02d47e", fontSize: "0.7rem", fontWeight: 600, padding: "4px 12px", borderRadius: 100, border: "1px solid rgba(2,212,126,0.2)" }}>{chip}</span>
                ))}
              </div>
              <button style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.75rem 1.75rem", borderRadius: 100, border: "none", cursor: "pointer", marginTop: "0.5rem", position: "relative", zIndex: 1 }}>▶ Iniciar recorrido</button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────── */}
        <footer style={{ background: "#02262d", padding: "3rem clamp(1.5rem,5vw,4rem) 2rem", borderTop: "1px solid rgba(2,212,126,0.1)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "1rem" }}>
                <div style={{ width: 36, height: 36, background: "#02d47e", borderRadius: 8, display: "grid", placeItems: "center", fontSize: "1.1rem", fontWeight: 800, color: "#043941" }}>G</div>
                <div>
                  <span style={{ color: "#02d47e", fontWeight: 800, fontSize: "1.1rem" }}>GRAMA</span>
                  <sub style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.6rem", fontWeight: 400, display: "block", textTransform: "uppercase" as const, letterSpacing: "0.1em" }}>Proyectos Educativos</sub>
                </div>
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.85rem", lineHeight: 1.7, maxWidth: 300 }}>Plataforma educativa para docentes de Educación para el Trabajo. Conectamos saberes y promovemos transformaciones.</p>
            </div>
            {[
              { title: "Taller", links: ["Programa formativo", "Repositorio", "Ruta de aprendizaje", "Sesiones en vivo", "Recorrido virtual"] },
              { title: "GRAMA",  links: ["Otros talleres", "Sobre nosotros", "Contacto", "Política de privacidad"] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ color: "#02d47e", fontSize: "0.72rem", textTransform: "uppercase" as const, letterSpacing: "0.12em", fontWeight: 700, marginBottom: "1rem" }}>{col.title}</h4>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" as const, gap: "0.6rem" }}>
                  {col.links.map(l => <li key={l}><a href="#" style={{ color: "rgba(255,255,255,0.45)", textDecoration: "none", fontSize: "0.85rem" }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(255,255,255,0.06)", marginBottom: "1.5rem" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" as const, gap: "1rem" }}>
            <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.78rem" }}>© 2025 GRAMA Proyectos Educativos. Todos los derechos reservados.</p>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.78rem" }}>Taller de {taller.nombre}</p>
          </div>
        </footer>

      </main>
    </>
  );
};

export default TallerDashboard;
