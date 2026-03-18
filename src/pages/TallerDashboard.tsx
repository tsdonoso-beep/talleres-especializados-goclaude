import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { getTotalBienesByTaller } from "@/data/bienesData";
import { buildModulosForTaller, getLiveSessionsForTaller } from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ── Íconos ──
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

// ── Card de sección ──
function SecCard({
  icon, etiqueta, nombre, descripcion, cta, onClick,
}: {
  icon: React.ReactNode; etiqueta: string; nombre: string;
  descripcion: string; cta: string; onClick: () => void;
}) {
  return (
    <button className="grama-card p-5 cursor-pointer text-left flex flex-col gap-2 w-full" onClick={onClick}>
      <div className="w-[34px] h-[34px] rounded-ds-md bg-secondary/[0.07] flex items-center justify-center text-secondary flex-shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[0.63rem] font-bold tracking-widest uppercase text-secondary/40 mb-0.5">{etiqueta}</div>
        <div className="text-[0.86rem] font-bold text-secondary leading-tight">{nombre}</div>
      </div>
      <div className="text-[0.73rem] text-secondary/50 leading-relaxed flex-1">{descripcion}</div>
      <div className="text-[0.7rem] font-bold text-secondary/30 mt-0.5">{cta} →</div>
    </button>
  );
}

// ── COMPONENTE PRINCIPAL ──
export default function TallerDashboard() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();

  const taller      = getTallerBySlug(slug ?? "");
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Link to="/" className="text-g-mint font-bold no-underline">← Volver al Hub</Link>
      </div>
    );
  }

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
    <main className="grama-page" style={{ background: "hsl(var(--g-pale))" }}>
      <div style={{ padding: "clamp(1.5rem,4vw,2.5rem)" }} className="flex flex-col gap-3">

        {/* ── HERO ── */}
        <section className="rounded-[18px] overflow-hidden relative" style={{ background: "#043941", display: "grid", gridTemplateColumns: "1fr 42%", alignItems: "stretch", minHeight: 340 }}>
          {/* Grid decorativo */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.04) 0,rgba(2,212,126,0.04) 1px,transparent 1px,transparent 50px),repeating-linear-gradient(-60deg,rgba(2,212,126,0.04) 0,rgba(2,212,126,0.04) 1px,transparent 1px,transparent 50px)" }} />

          <div className="relative z-[2]" style={{ padding: "clamp(2rem,5vw,2.75rem)" }}>
            {/* Breadcrumb + SidebarTrigger */}
            <div className="flex items-center gap-2 mb-4">
              <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
              <div className="inline-flex items-center gap-1.5 bg-g-mint/10 border border-g-mint/20 text-g-mint rounded-ds-pill px-3 py-1 text-[10px] font-bold tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: data.tallerAccent }} />
                Taller de Educación para el Trabajo
              </div>
            </div>

            {/* Título dinámico */}
            <h1 className="font-extrabold text-white mb-3" style={{ fontSize: "clamp(2rem,4vw,2.5rem)", lineHeight: 0.95, letterSpacing: "-0.03em" }}>
              {primeras && <>{primeras}<br /></>}
              {penultima && <><span className="text-g-mint">{penultima}</span><br /></>}
              <span style={{ color: data.tallerAccent }}>{ultima}</span>
            </h1>

            {/* Descripción */}
            <p className="text-sm text-white/55 leading-relaxed max-w-[440px] mb-4">
              {data.presentacion}
            </p>

            {/* Micro-datos */}
            <div className="flex gap-5 flex-wrap mb-7">
              {[
                { icon: "👥", label: "30 estudiantes" },
                { icon: "📦", label: `${totalBienes || data.inventoryZones.reduce((a, z) => a + z.count, 0)} bienes` },
                { icon: "🏗️", label: `${data.inventoryZones.length} zonas de trabajo` },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-1.5 text-[0.72rem] font-semibold text-white/45">
                  <span className="text-[13px]">{m.icon}</span>{m.label}
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => navigate(`/taller/${slug}/repositorio`)}
                className="grama-btn-primary text-[0.8rem] py-2.5 px-6 inline-flex items-center gap-1.5"
              >
                <IcoFile /> Explorar recursos
              </button>
              <button
                onClick={() => navigate(`/taller/${slug}/ruta`)}
                className="grama-btn-outline text-[0.8rem] py-2.5 px-6"
              >
                Iniciar ruta de certificación →
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 flex-wrap pt-6 mt-6 border-t border-white/[0.08]">
              {[
                { val: "+300", label: "Recursos disponibles" },
                { val: String(data.unidadesCompetencia.length), label: "Competencias técnicas" },
                { val: String(modulos.length), label: "Módulos formativos" },
              ].map(s => (
                <div key={s.label}>
                  <div className="grama-stat-val">{s.val}</div>
                  <div className="grama-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual derecho */}
          <div className="relative z-[2]">
            <div className="w-full h-full overflow-hidden" style={{ clipPath: "polygon(12% 0%,100% 0%,100% 100%,0% 100%)" }}>
              <img src={taller.imagen} alt={taller.nombre} className="w-full h-full object-cover" />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(4,57,65,0.5) 0%, rgba(4,57,65,0.1) 40%, transparent 100%)" }} />
            </div>
            <div className="absolute left-0 top-[35%] w-[3px] h-[65px] rounded-sm" style={{ background: `linear-gradient(to bottom,${data.tallerAccent},transparent)` }} />
          </div>
        </section>

        {/* ── DESCRIPCIÓN + 5 COMPETENCIAS ── */}
        <section className="bg-white rounded-ds-xl border border-secondary/[0.08]" style={{ padding: "1.75rem 2rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
          <div>
            <div className="text-[0.65rem] font-bold tracking-widest uppercase text-g-mint mb-2 flex items-center gap-1.5">
              <span className="w-5 h-0.5 bg-g-mint rounded-sm inline-block" />
              Sobre este taller
            </div>
            <h2 className="text-lg font-extrabold text-secondary leading-tight mb-3">
              Todo lo que necesitas para enseñar {taller.nombre.toLowerCase()}
            </h2>
            <p className="text-[0.85rem] text-secondary/65 leading-relaxed">
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

          <div>
            <div className="text-[0.68rem] font-bold tracking-widest uppercase text-secondary/40 mb-3">
              {data.unidadesCompetencia.length} competencias técnicas
            </div>
            <div className="flex flex-col gap-2">
              {data.unidadesCompetencia.map((uc, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-secondary/[0.03] rounded-ds-md border border-secondary/[0.07]">
                  <div className="w-[26px] h-[26px] rounded-[7px] flex-shrink-0 flex items-center justify-center text-[0.68rem] font-extrabold"
                    style={{ background: `${data.tallerAccent}18`, color: data.tallerAccent }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div className="text-[0.75rem] text-secondary/65 leading-snug pt-1">{uc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── EXPLORA LA PLATAFORMA ── */}
        <div className="text-[0.67rem] font-bold tracking-widest uppercase text-secondary/40 flex items-center gap-2 py-1">
          Explora la plataforma
          <span className="flex-1 h-px bg-secondary/10" />
        </div>

        <div className="grid grid-cols-4 gap-3">
          {secciones.map(s => (
            <SecCard key={s.nombre} {...s} />
          ))}
        </div>

        {/* ── TOUR 3D — solo automotriz ── */}
        {slug === "mecanica-automotriz" && (
          <>
            <div className="text-[0.67rem] font-bold tracking-widest uppercase text-secondary/40 flex items-center gap-2 py-1 mt-2">
              Conoce más sobre el taller
              <span className="flex-1 h-px bg-secondary/10" />
            </div>
            <div className="rounded-ds-xl overflow-hidden border-[1.5px] border-secondary/[0.08] bg-white">
              <iframe
                src="/tour-3d-automotriz-v2.html"
                title="Tour 3D — Mecánica Automotriz"
                className="w-full border-none block"
                style={{ height: "80vh" }}
                allow="accelerometer; gyroscope"
              />
            </div>
          </>
        )}

      </div>
    </main>
  );
}
