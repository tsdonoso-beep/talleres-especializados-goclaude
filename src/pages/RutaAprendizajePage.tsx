import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

const TIPO_BADGE: Record<string, { label: string; bg: string; color: string }> = {
  PDF:         { label: "PDF",         bg: "rgba(4,57,65,0.07)",    color: "#045f6c" },
  VIDEO:       { label: "Video",       bg: "rgba(2,212,126,0.1)",   color: "#00c16e" },
  INTERACTIVO: { label: "Interactivo", bg: "rgba(6,182,212,0.1)",   color: "#0891b2" },
  QUIZ:        { label: "Quiz",        bg: "rgba(234,179,8,0.12)",  color: "#ca8a04" },
  "EN VIVO":   { label: "EN VIVO",     bg: "rgba(239,68,68,0.1)",   color: "#ef4444" },
};

export default function RutaAprendizajePage() {
  const { slug }  = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const taller    = getTallerBySlug(slug ?? "");
  const data      = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const modulos   = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Link to="/" className="text-g-mint font-bold no-underline">← Volver al Hub</Link>
      </div>
    );
  }

  const sesionesVivo = modulos.reduce((acc, m) => {
    const vivo = (m.contenidos ?? []).filter(c => c.tipo === "EN VIVO").length;
    const vivoSub = (m.subSecciones ?? []).flatMap(s => s.contenidos).filter(c => c.tipo === "EN VIVO").length;
    return acc + vivo + vivoSub;
  }, 0);

  return (
    <main className="grama-page-white">

      {/* ── HERO ── */}
      <section className="grama-hero" style={{ padding: "2.5rem clamp(1.5rem,4vw,2.5rem) 2rem", display: "grid", gridTemplateColumns: "1fr 150px", gap: "2rem", alignItems: "center" }}>

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} className="grama-breadcrumb grama-breadcrumb-muted no-underline">
              {taller.nombre}
            </Link>
            <span className="text-white/20 text-[0.68rem]">›</span>
            <span className="grama-breadcrumb grama-breadcrumb-active">
              Ruta de Aprendizaje
            </span>
          </div>

          {/* Título */}
          <h1 className="font-extrabold leading-[0.97] tracking-tight text-white mb-3" style={{ fontSize: "clamp(1.9rem,3.5vw,2.4rem)", letterSpacing: "-0.03em" }}>
            Tu camino hacia<br />
            <span className="text-g-mint">la certificación</span>
          </h1>

          <p className="text-[0.86rem] text-white/[0.52] leading-[1.72] max-w-[480px] mb-6">
            Un recorrido progresivo de {modulos.length} módulos que te lleva desde el reconocimiento del taller hasta el proyecto final integrador. Cada módulo combina teoría, práctica y evaluación.
          </p>

          {/* Stats */}
          <div className="flex gap-8 flex-wrap pt-5 border-t border-white/[0.07]">
            {[
              { val: String(modulos.length), label: "Módulos" },
              { val: String(sesionesVivo),   label: "Sesiones en vivo" },
              { val: "🎓",                   label: "Certificación" },
            ].map(s => (
              <div key={s.label}>
                <div className="grama-stat-val">{s.val}</div>
                <div className="grama-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Anillo de avance */}
        <div className="flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="70" cy="70" r="58" fill="none" stroke="#02d47e" strokeWidth="8"
              strokeLinecap="round" strokeDasharray="364" strokeDashoffset="364"
              transform="rotate(-90 70 70)" style={{ opacity: 0.4 }} />
          </svg>
          <div className="absolute text-center">
            <div className="text-2xl font-extrabold text-white leading-none">0%</div>
            <div className="grama-stat-label mt-0.5">Avance</div>
          </div>
        </div>
      </section>

      {/* ── CONTENIDO ── */}
      <div style={{ padding: "2rem clamp(1.5rem,4vw,2.5rem)" }} className="flex flex-col gap-5 bg-white">

        {/* Encabezado */}
        <div className="text-center py-1">
          <div className="grama-section-tag mb-2">Detalle de la ruta</div>
          <h2 className="text-2xl font-extrabold text-secondary tracking-tight">
            Qué aprenderás en <span className="text-g-mint">cada módulo</span>
          </h2>
        </div>

        {/* ── LISTA DE MÓDULOS ── */}
        <div className="flex flex-col gap-2">
          {modulos.map((modulo) => {
            const esFinal = modulo.orden === modulos.length;
            const tipos = new Set<string>();
            (modulo.contenidos ?? []).forEach(c => tipos.add(c.tipo));
            (modulo.subSecciones ?? []).forEach(s => s.contenidos.forEach(c => tipos.add(c.tipo)));

            return (
              <div
                key={modulo.id}
                onClick={() => navigate(`/taller/${slug}/modulo/${modulo.orden}`)}
                className="grama-card cursor-pointer"
                style={{
                  background: esFinal ? "linear-gradient(135deg,rgba(2,212,126,0.04),#fff)" : undefined,
                  borderColor: esFinal ? "rgba(2,212,126,0.22)" : undefined,
                }}
              >
                <div className="grid items-center gap-4" style={{ gridTemplateColumns: "52px 1fr auto auto", padding: "0.95rem 1.25rem" }}>
                  {/* Número */}
                  <div className="w-10 h-10 rounded-ds-md flex-shrink-0 flex items-center justify-center text-[0.85rem] font-extrabold"
                    style={{
                      background: esFinal ? "rgba(2,212,126,0.12)" : `${data.tallerAccent}18`,
                      color: esFinal ? "#02d47e" : data.tallerAccent,
                    }}>
                    {String(modulo.orden).padStart(2, "0")}
                  </div>

                  {/* Info */}
                  <div>
                    <div className="text-[0.9rem] font-bold text-secondary leading-tight mb-0.5 flex items-center gap-2">
                      {modulo.icon} {modulo.nombre}
                      {esFinal && (
                        <span className="text-[0.6rem] font-bold px-2 py-0.5 rounded-ds-pill bg-g-mint/10 text-g-mint">
                          Certifica
                        </span>
                      )}
                    </div>
                    <div className="text-[0.73rem] text-secondary/50 leading-snug">{modulo.descripcion}</div>
                  </div>

                  {/* Badges de recursos */}
                  <div className="flex gap-1.5 flex-wrap justify-end flex-shrink-0">
                    {Array.from(tipos).map(tipo => {
                      const badge = TIPO_BADGE[tipo];
                      if (!badge) return null;
                      return (
                        <span key={tipo} className="text-[0.61rem] font-bold px-2 py-0.5 rounded-ds-pill whitespace-nowrap"
                          style={{ background: badge.bg, color: badge.color }}>
                          {badge.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Botón */}
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/taller/${slug}/modulo/${modulo.orden}`); }}
                    className="grama-btn-primary text-[0.7rem] py-1.5 px-4 whitespace-nowrap flex-shrink-0"
                    style={{
                      background: esFinal ? "#02d47e" : "#043941",
                      color: esFinal ? "#043941" : "#fff",
                    }}
                  >
                    Ir →
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA CERTIFICACIÓN ── */}
        <div className="grama-cta-bar">
          <div className="flex gap-3 items-center">
            <span className="text-2xl">🎓</span>
            <div>
              <div className="text-[0.95rem] font-bold text-white mb-0.5">Certificación por módulo</div>
              <div className="text-[0.77rem] text-white/50">
                Al completar cada módulo recibes un certificado. Completa los {modulos.length} para obtener la certificación final.
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/modulo/1`)}
            className="grama-btn-primary text-[0.82rem] py-3 px-7 whitespace-nowrap"
          >
            Iniciar Módulo 01 →
          </button>
        </div>

      </div>
    </main>
  );
}
