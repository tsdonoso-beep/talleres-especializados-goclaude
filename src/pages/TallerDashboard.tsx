import { useParams, Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, getZonasUnicasByTaller, getTotalBienesByTaller } from "@/data/bienesData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ─── Helpers de sección ───────────────────────────────────────────────────────
const SectionTag = ({ label }: { label: string }) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#02d47e", fontWeight: 600, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: "1rem" }}>
    <span style={{ width: 28, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
    {label}
    <span style={{ width: 28, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
  </div>
);

const SectionHeader = ({ tag, title, accent, dark = false }: { tag: string; title: string; accent: string; dark?: boolean }) => (
  <div style={{ marginBottom: "3.5rem" }}>
    <div style={{ display: "block" }}><SectionTag label={tag} /></div>
    <h2 style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 800, letterSpacing: "-0.03em", color: dark ? "#fff" : "#043941", marginTop: "0.75rem", lineHeight: 1.1 }}>
      {title} <span style={{ color: "#02d47e" }}>{accent}</span>
    </h2>
  </div>
);

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
const TallerDashboard = () => {
  const { slug } = useParams<{ slug: string }>();

  const taller      = getTallerBySlug(slug ?? "");
  const bienes      = useMemo(() => getBienesByTaller(slug ?? ""), [slug]);
  const zonasUnicas = useMemo(() => getZonasUnicasByTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <>
        <header className="h-12 flex items-center px-4 shrink-0">
          <SidebarTrigger />
        </header>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#e3f8fb", borderRadius: 20, padding: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>🏫</p>
            <h2 style={{ fontWeight: 800, color: "#043941", marginBottom: 12 }}>Taller no encontrado</h2>
            <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
          </div>
        </div>
      </>
    );
  }

  const nombrePartes = taller.nombre.split(" ");
  const nombreLinea1 = nombrePartes.slice(0, -1).join(" ") || taller.nombre;
  const nombreLinea2 = nombrePartes.length > 1 ? nombrePartes[nombrePartes.length - 1] : "";

  return (
    <>
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
          <div style={{ position: "absolute", top: "30%", right: "40%", width: 60, height: 60, background: data.tallerAccent, borderRadius: "50%", opacity: 0.12, pointerEvents: "none" }} />

          {/* Contenido izquierdo */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(2,212,126,0.1)", border: "1px solid rgba(2,212,126,0.25)", color: "#02d47e", borderRadius: 100, padding: "0.35rem 1rem", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, marginBottom: "1.5rem" }}>
              <span style={{ width: 6, height: 6, background: data.tallerAccent, borderRadius: "50%", flexShrink: 0 }} />
              Taller de Educación para el Trabajo
            </div>
            <h1 style={{ fontSize: "clamp(2.4rem,4.5vw,4.2rem)", fontWeight: 800, lineHeight: 0.95, letterSpacing: "-0.03em", color: "#fff", marginBottom: "1.5rem" }}>
              {nombreLinea1}<br />
              {nombreLinea2 && <><span style={{ color: "#02d47e" }}>{nombreLinea2}</span><br /></>}
              <span style={{ color: data.tallerAccent }}>{data.heroSubtitle}</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", lineHeight: 1.7, maxWidth: 440, marginBottom: "2.5rem" }}>
              {taller.descripcion}
            </p>
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" as const, marginBottom: "3rem" }}>
              <Link to={`/taller/${slug}/repositorio`} style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                {data.heroIcon} Explorar recursos
              </Link>
              <Link to={`/taller/${slug}/ruta`} style={{ color: "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, border: "1.5px solid rgba(255,255,255,0.2)", textDecoration: "none" }}>
                Ver programa →
              </Link>
            </div>
            <div style={{ display: "flex", gap: "2.5rem", paddingTop: "2.5rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              {[
                { val: "+300", label: "Recursos disponibles" },
                { val: String(modulos.length), label: "Módulos formativos" },
                { val: "4",   label: "Sesiones en vivo" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>
                    <span style={{ color: "#02d47e" }}>{s.val}</span>
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase" as const, letterSpacing: "0.04em", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual derecho */}
          <div style={{ position: "relative", zIndex: 2, display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
            <div style={{ position: "relative", width: "100%", maxWidth: 520, height: 480 }}>
              <img
                src={taller.imagen}
                alt={taller.nombre}
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", clipPath: "polygon(12% 0%,100% 0%,100% 100%,0% 88%)" }}
              />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg,rgba(4,57,65,0.55) 0%,rgba(4,57,65,0.3) 50%,rgba(2,30,34,0.6) 100%)", clipPath: "polygon(12% 0%,100% 0%,100% 100%,0% 88%)" }} />
              <div style={{ position: "absolute", left: 0, top: "40%", width: 4, height: 120, background: `linear-gradient(to bottom,${data.tallerAccent},transparent)`, borderRadius: 2 }} />
            </div>
          </div>
        </section>


        {/* ── PRESENTACIÓN ─────────────────────────────────────── */}
        <section style={{ background: "#fff", padding: "clamp(3.5rem,7vw,6rem) clamp(1.5rem,5vw,4rem)", textAlign: "center" as const, borderBottom: "1px solid rgba(4,57,65,0.07)" }}>
          <SectionTag label="Sobre este espacio" />
          <p style={{ fontSize: "clamp(1.1rem,2.2vw,1.4rem)", fontWeight: 400, lineHeight: 1.8, color: "#043941", maxWidth: 760, margin: "0 auto" }}>
            {data.presentacion.split(/(planificar, enseñar y evaluar|planificar|enseñar|evaluar)/).map((part, i) =>
              ["planificar, enseñar y evaluar", "planificar", "enseñar", "evaluar"].includes(part)
                ? <strong key={i} style={{ fontWeight: 700, color: "#02d47e" }}>{part}</strong>
                : <span key={i}>{part}</span>
            )}
          </p>
        </section>

        {/* ── PROGRAMA FORMATIVO ───────────────────────────────── */}
        <section id="programa" style={{ background: "#e3f8fb", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag="Formación Técnica MINEDU" title="Programa" accent="Formativo" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "3rem", alignItems: "start" }}>
            {/* Columna izquierda */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.5rem" }}>
              <p style={{ color: "#043941", opacity: 0.7, lineHeight: 1.75, fontSize: "0.95rem" }}>
                Programa del <strong>Ministerio de Educación del Perú</strong> dentro del modelo{" "}
                <em>Secundaria con Formación Técnica (SFT)</em>. Forma al estudiante como{" "}
                <strong>{data.nivelEgreso}</strong> en {taller.nombre} con <strong>{data.horasFormacion} horas</strong> de formación a lo largo de 5 grados.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                {[
                  { val: String(totalBienes || bienes.length), label: "Bienes del taller" },
                  { val: "Aux.", label: "Nivel Técnico" },
                  { val: String(modulos.length), label: "Módulos" },
                ].map(m => (
                  <div key={m.label} style={{ background: "#043941", borderRadius: 14, padding: "1.5rem", textAlign: "center" as const }}>
                    <div style={{ fontSize: m.val.length > 3 ? "1.2rem" : "2rem", fontWeight: 800, color: "#02d47e", letterSpacing: "-0.03em" }}>{m.val}</div>
                    <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginTop: 4 }}>{m.label}</div>
                  </div>
                ))}
              </div>
              {/* Perfil de egreso */}
              <div style={{ background: "#fff", borderRadius: 14, padding: "1.5rem", border: "1px solid rgba(4,57,65,0.08)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#02d47e", marginBottom: "0.75rem" }}>Perfil de egreso</div>
                {data.perfilEgreso.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", marginBottom: i < data.perfilEgreso.length - 1 ? "0.6rem" : 0 }}>
                    <span style={{ color: data.tallerAccent, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: "0.82rem", color: "rgba(4,57,65,0.7)", lineHeight: 1.5 }}>{item.text}</span>
                  </div>
                ))}
              </div>
              {/* Marco transversal común */}
              <div style={{ background: "linear-gradient(135deg,rgba(4,57,65,0.03),rgba(2,212,126,0.04))", borderRadius: 14, padding: "1.25rem 1.5rem", border: "1px solid rgba(2,212,126,0.15)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#045f6c", marginBottom: "0.6rem" }}>Marco transversal</div>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "0.4rem" }}>
                  {["5S en el taller", "IA Generativa", "Google Workspace", "Design Thinking", "Running Lean"].map(tag => (
                    <span key={tag} style={{ fontSize: "0.68rem", fontWeight: 600, color: "#045f6c", background: "rgba(4,95,108,0.08)", padding: "3px 10px", borderRadius: 100, border: "1px solid rgba(4,95,108,0.15)" }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
            {/* Columna derecha — Unidades de competencia + Inventory cards */}
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "1.25rem" }}>
              {/* Unidades de Competencia */}
              <div style={{ background: "#fff", borderRadius: 16, padding: "1.75rem", border: "1px solid rgba(4,57,65,0.08)" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.1em", color: "#02d47e", marginBottom: "1rem", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 20, height: 2, background: "#02d47e", borderRadius: 2, display: "inline-block" }} />
                  5 Unidades de Competencia
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.5rem" }}>
                  {data.unidadesCompetencia.map((uc, i) => (
                    <div key={i} style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start", padding: "0.6rem 0.75rem", borderRadius: 8, background: i === 0 ? `${data.tallerAccent}0d` : "rgba(4,57,65,0.03)", border: `1px solid ${i === 0 ? data.tallerAccent + "33" : "rgba(4,57,65,0.06)"}` }}>
                      <span style={{ fontWeight: 800, fontSize: "0.7rem", color: i === 0 ? data.tallerAccent : "rgba(4,57,65,0.3)", minWidth: 20, flexShrink: 0, marginTop: 1 }}>U{i + 1}</span>
                      <span style={{ fontSize: "0.82rem", color: "rgba(4,57,65,0.75)", lineHeight: 1.5 }}>{uc}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Inventory zones */}
              {data.inventoryZones.map(zone => (
                <div key={zone.name}
                  style={{ background: "#fff", border: "1px solid rgba(4,57,65,0.08)", borderRadius: 12, padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "1rem", transition: "all .25s" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#02d47e"; el.style.transform = "translateX(6px)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.transform = "translateX(0)"; }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: `${data.tallerAccent}1a`, display: "grid", placeItems: "center", fontSize: "1.1rem", flexShrink: 0 }}>{zone.icon}</div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontWeight: 700, fontSize: "0.85rem", color: "#043941" }}>{zone.name}</h4>
                    <p style={{ fontSize: "0.75rem", color: "rgba(4,57,65,0.5)", marginTop: 1 }}>{zone.desc}</p>
                  </div>
                  <div style={{ marginLeft: "auto", background: "#d2ffe1", color: "#043941", fontSize: "0.68rem", fontWeight: 700, padding: "3px 9px", borderRadius: 100, whiteSpace: "nowrap" as const }}>{zone.count} bienes</div>
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
            {[
              { icon: "📋", title: "Fichas Técnicas",         desc: "Procedimientos paso a paso, normas de seguridad y protocolos de trabajo para cada actividad del taller.", count: "+45 fichas" },
              { icon: "🎬", title: "Videotutoriales",          desc: "Demostraciones en video de procedimientos técnicos filmados en el propio taller de GRAMA.", count: "+32 videos" },
              { icon: "📐", title: "Guías de Evaluación",      desc: "Rúbricas, listas de cotejo y formatos de evaluación por competencias alineados al currículo nacional.", count: "+28 instrumentos" },
              { icon: "🧪", title: "Proyectos Prácticos",      desc: "Proyectos integrados por bimestre con materiales, tiempos estimados y criterios de logro.", count: "16 proyectos" },
              { icon: "📊", title: "Sesiones de Aprendizaje",  desc: "Planificaciones editables con situaciones significativas, estrategias y recursos integrados.", count: "+60 sesiones" },
              { icon: "📄", title: "Material de Estudiante",   desc: "Hojas de trabajo, cuadernillos y materiales imprimibles listos para usar en aula-taller.", count: "+80 materiales" },
            ].map(card => (
              <Link key={card.title} to={`/taller/${slug}/repositorio`}
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(2,212,126,0.1)", borderRadius: 16, padding: "2rem", transition: "all .3s", textDecoration: "none", display: "block" }}
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
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.9rem", maxWidth: 400, marginTop: "0.5rem" }}>Accede al catálogo completo de recursos. Filtra por unidad, grado, competencia o tipo de recurso.</p>
              </div>
              <Link to={`/taller/${slug}/repositorio`} style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", whiteSpace: "nowrap" as const }}>Ir al repositorio →</Link>
            </div>
          </div>
        </section>

        {/* ── RUTA DE APRENDIZAJE ──────────────────────────────── */}
        <section id="ruta" style={{ background: "#fff", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag={`${modulos.length} módulos · 4 sesiones en vivo`} title="Tu Ruta de" accent="Aprendizaje" />
          <p style={{ maxWidth: 700, margin: "0 auto 3rem", textAlign: "center" as const, color: "rgba(4,57,65,0.6)", fontSize: "1rem", lineHeight: 1.7 }}>
            Un recorrido progresivo que te lleva desde los fundamentos hasta la certificación. Cada módulo combina teoría, práctica y evaluación para una formación integral.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.25rem", maxWidth: 960, margin: "0 auto 3rem" }}>
            {modulos.map((modulo, idx) => {
              const isFinal = modulo.orden === 6;
              return (
                <Link key={modulo.id} to={`/taller/${slug}/modulo/${modulo.orden}`}
                  style={{ background: isFinal ? "linear-gradient(135deg,rgba(2,212,126,0.05),#fff)" : "#fff", border: `1.5px solid ${isFinal ? "rgba(2,212,126,0.3)" : "rgba(4,57,65,0.08)"}`, borderRadius: 16, padding: "1.75rem", textDecoration: "none", transition: "all .3s", display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#02d47e"; el.style.transform = "translateY(-4px)"; el.style.boxShadow = "0 8px 24px rgba(2,212,126,0.12)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = isFinal ? "rgba(2,212,126,0.3)" : "rgba(4,57,65,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "1.6rem", fontWeight: 800, color: "rgba(4,57,65,0.15)", letterSpacing: "-0.04em" }}>{String(idx + 1).padStart(2, "0")}</span>
                    {isFinal && <span style={{ fontSize: "0.65rem", background: "rgba(2,212,126,0.15)", color: "#02d47e", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>🎓 Certifica</span>}
                  </div>
                  <div style={{ fontSize: "1.5rem" }}>{modulo.icon}</div>
                  <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#043941", lineHeight: 1.3 }}>{modulo.nombre}</h3>
                  <p style={{ fontSize: "0.78rem", color: "rgba(4,57,65,0.5)", lineHeight: 1.5, flex: 1 }}>{modulo.descripcion}</p>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#02d47e", marginTop: "0.5rem" }}>Ver módulo →</span>
                </Link>
              );
            })}
          </div>
          <div style={{ maxWidth: 960, margin: "0 auto", background: "linear-gradient(135deg,#043941,#045f6c)", borderRadius: 16, padding: "1.75rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap" as const }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
              <span style={{ fontSize: "1.5rem" }}>🎓</span>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>Certificación por módulo</div>
                <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>Se otorga un certificado al finalizar satisfactoriamente cada módulo.</div>
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
              {data.curiosidades.map((c, i) => (
                <div key={i}
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
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>{data.quizTitle}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.88rem", lineHeight: 1.6, marginBottom: "2rem" }}>{data.quizDesc}</p>
              <Link to={`/taller/${slug}/modulo/1`} style={{ background: data.quizBtnBg, color: "#fff", fontWeight: 700, fontSize: "0.85rem", padding: "0.85rem 2rem", borderRadius: 100, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8 }}>
                🚀 Iniciar Quiz
              </Link>
            </div>
          </div>
        </section>

        {/* ── SESIONES EN VIVO ─────────────────────────────────── */}
        <section id="sesiones" style={{ background: "#043941", padding: "clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)" }}>
          <SectionHeader tag="En tiempo real" title="Sesiones en" accent="Vivo" dark />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {data.sesiones.map(s => (
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
          <div style={{ width: "100%", borderRadius: 20, overflow: "hidden", border: "1px solid rgba(4,57,65,0.1)", boxShadow: "0 8px 32px rgba(4,57,65,0.1)" }}>
            <iframe
              src="/tour-3d_automotriz.html"
              title="Tour 3D — Taller de Mecánica Automotriz"
              style={{ width: "100%", height: "80vh", minHeight: 600, border: "none", display: "block" }}
              allow="accelerometer; gyroscope"
            />
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
              { title: "Taller",  links: ["Programa formativo", "Repositorio", "Ruta de aprendizaje", "Sesiones en vivo", "Recorrido virtual"] },
              { title: "GRAMA",   links: ["Otros talleres", "Sobre nosotros", "Contacto", "Política de privacidad"] },
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
