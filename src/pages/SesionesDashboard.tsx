import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import {
  getLiveSessionsForTaller,
  getActiveLiveSession,
  getUpcomingLiveSession,
  buildModulosForTaller,
} from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

// ── Helpers ──
function formatFecha(date: Date): string {
  return date.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}
function formatHora(date: Date): string {
  return date.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });
}
function formatDuracion(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

const SectionTag = ({ label }: { label: string }) => (
  <div className="grama-section-tag">{label}</div>
);

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    active:    { label: "● En vivo",  bg: "rgba(239,68,68,0.15)",    color: "#f87171" },
    scheduled: { label: "◎ Próxima",  bg: "rgba(249,115,22,0.15)",   color: "#fdba74" },
    recorded:  { label: "◉ Grabada",  bg: "rgba(100,116,139,0.15)",  color: "#94a3b8" },
  };
  const s = map[status] ?? map.recorded;
  return (
    <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-ds-pill"
      style={{ background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

// ── COMPONENTE PRINCIPAL ──
export default function SesionesDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const taller    = getTallerBySlug(slug ?? "");
  const data      = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const modulos   = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const sesiones  = useMemo(() => getLiveSessionsForTaller(slug ?? ""), [slug]);
  const activaLive   = getActiveLiveSession(slug ?? "");
  const proximaLive  = getUpcomingLiveSession(slug ?? "");

  const videosAsincronos = useMemo(() => {
    return modulos.flatMap(m =>
      (m.contenidos ?? [])
        .filter(c => c.tipo === "VIDEO")
        .map(c => ({ ...c, moduloNombre: m.nombre, moduloOrden: m.orden }))
    );
  }, [modulos]);

  if (!taller) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Link to="/" className="text-g-mint font-bold no-underline">← Volver al Hub</Link>
      </div>
    );
  }

  const sesionesVivo     = sesiones.filter(s => s.status === "active" || s.status === "scheduled");
  const sesionesGrabadas = sesiones.filter(s => s.status === "recorded");

  return (
    <main className="grama-page" style={{ background: "#f7fdfb" }}>

      {/* ── HERO ── */}
      <section className="grama-hero" style={{ padding: "2.25rem clamp(1.5rem,4vw,2.5rem) 2rem" }}>
        <div className="absolute top-[-80px] right-[-80px] w-60 h-60 bg-destructive/[0.05] rounded-full pointer-events-none" />

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} className="grama-breadcrumb grama-breadcrumb-muted no-underline" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              {taller.nombre}
            </Link>
            <span className="text-white/20 text-[0.7rem]">›</span>
            <span className="grama-breadcrumb grama-breadcrumb-active" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              Sesiones
            </span>
          </div>

          <h1 className="font-extrabold text-white leading-[1.05] mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.03em" }}>
            Sesiones <span className="text-g-mint">en Vivo</span><br />
            <span className="text-white/55 text-[0.6em] font-medium">y asíncronas</span>
          </h1>

          {/* Stats */}
          <div className="flex gap-8 pt-6 border-t border-white/[0.07] flex-wrap">
            {[
              { val: activaLive ? "1" : "0", label: "En vivo ahora", accent: "#ef4444" },
              { val: String(sesionesVivo.length),     label: "Próximas sesiones",  accent: "#02d47e" },
              { val: String(sesionesGrabadas.length), label: "Sesiones grabadas",  accent: "rgba(255,255,255,0.6)" },
              { val: String(videosAsincronos.length), label: "Videos asincrónicos", accent: "rgba(255,255,255,0.6)" },
            ].map(s => (
              <div key={s.label}>
                <div className="grama-stat-val" style={{ fontSize: "1.5rem", color: s.accent }}>{s.val}</div>
                <div className="grama-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT: sesión activa ── */}
      {activaLive && (
        <div className="mx-6 mt-6 rounded-r-ds-md border border-destructive/25 border-l-4 border-l-destructive p-4 flex items-center gap-4 flex-wrap"
          style={{ background: "linear-gradient(90deg,rgba(239,68,68,0.12),rgba(239,68,68,0.06))" }}>
          <span className="text-xl">🔴</span>
          <div className="flex-1">
            <div className="text-[0.85rem] font-bold text-white">
              Sesión en vivo ahora: <span className="text-destructive/80">{activaLive.titulo}</span>
            </div>
            <div className="text-[0.75rem] text-white/50 mt-0.5">
              Módulo {activaLive.moduloId} · {formatDuracion(activaLive.durationMinutes)}
            </div>
          </div>
          <button onClick={() => navigate(`/taller/${slug}/modulo/${activaLive.moduloId}/live`)}
            className="bg-destructive text-white font-bold text-[0.8rem] py-2 px-5 rounded-ds-pill border-none cursor-pointer">
            Unirse →
          </button>
        </div>
      )}

      <div style={{ padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem)" }} className="flex flex-col gap-12">

        {/* ── 1. SESIONES EN VIVO ── */}
        <section>
          <SectionTag label="En tiempo real" />
          <h2 className="font-extrabold text-secondary tracking-tight mb-6" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
            Sesiones en <span className="text-g-mint">Vivo</span>
          </h2>

          {sesiones.length === 0 ? (
            <div className="bg-white border border-secondary/[0.08] rounded-[14px] p-10 text-center text-secondary/40">
              <div className="text-3xl mb-3">📅</div>
              <div className="text-[0.9rem]">No hay sesiones programadas aún.</div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {sesiones.map(sesion => {
                const modulo = modulos.find(m => String(m.orden) === String(sesion.moduloId));
                const esActiva = sesion.status === "active";
                return (
                  <div key={sesion.id} className="bg-white rounded-[14px] overflow-hidden transition-colors"
                    style={{
                      border: `1.5px solid ${esActiva ? "rgba(239,68,68,0.35)" : "rgba(4,57,65,0.08)"}`,
                      boxShadow: esActiva ? "0 4px 20px rgba(239,68,68,0.08)" : "none",
                    }}>
                    <div className="p-5 flex items-start gap-5">
                      {/* Ícono módulo */}
                      <div className="w-11 h-11 rounded-ds-lg flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: esActiva ? "rgba(239,68,68,0.08)" : `${data.tallerAccent}15` }}>
                        {modulo?.icon ?? "🎥"}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <StatusBadge status={sesion.status} />
                          {modulo && (
                            <span className="text-[0.68rem] bg-secondary/[0.06] text-secondary/50 px-2 py-0.5 rounded-ds-pill font-semibold">
                              {modulo.nombre}
                            </span>
                          )}
                        </div>
                        <div className="text-[0.95rem] font-bold text-secondary mb-1">{sesion.titulo}</div>
                        <div className="text-[0.78rem] text-secondary/50 flex gap-4 flex-wrap">
                          {sesion.scheduledAt && <span>📅 {formatFecha(sesion.scheduledAt)} · {formatHora(sesion.scheduledAt)}</span>}
                          <span>⏱ {formatDuracion(sesion.durationMinutes)}</span>
                          {sesion.participants > 0 && <span>👥 {sesion.participants} participantes</span>}
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="flex-shrink-0">
                        {sesion.status === "active" && (
                          <button onClick={() => navigate(`/taller/${slug}/modulo/${sesion.moduloId}/live`)}
                            className="bg-destructive text-white font-bold text-[0.8rem] py-2 px-5 rounded-ds-pill border-none cursor-pointer">
                            Unirse →
                          </button>
                        )}
                        {sesion.status === "scheduled" && (
                          <button onClick={() => navigate(`/taller/${slug}/modulo/${sesion.moduloId}/live`)}
                            className="bg-t1/10 text-t1 font-bold text-[0.8rem] py-2 px-5 rounded-ds-pill border border-t1/25 cursor-pointer">
                            Ver detalle →
                          </button>
                        )}
                        {sesion.status === "recorded" && sesion.vimeoId && (
                          <button onClick={() => navigate(`/taller/${slug}/modulo/${sesion.moduloId}/live`)}
                            className="bg-secondary/[0.06] text-secondary font-bold text-[0.8rem] py-2 px-5 rounded-ds-pill border border-secondary/[0.12] cursor-pointer">
                            Ver grabación →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Agenda */}
                    {sesion.agenda && sesion.agenda.length > 0 && (
                      <div className="border-t border-secondary/[0.06] px-5 py-3 bg-secondary/[0.02] flex gap-2 flex-wrap">
                        <span className="text-[0.68rem] font-bold text-secondary/40 uppercase tracking-widest self-center mr-1">Agenda:</span>
                        {sesion.agenda.map((item, i) => (
                          <span key={i} className="text-[0.72rem] bg-white border border-secondary/[0.08] text-secondary/60 px-2.5 py-0.5 rounded-ds-pill">
                            {item.tiempo} — {item.tema}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── 2. SESIONES ASÍNCRONAS ── */}
        <section>
          <SectionTag label="A tu ritmo" />
          <h2 className="font-extrabold text-secondary tracking-tight mb-2" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
            Sesiones <span className="text-g-mint">Asíncronas</span>
          </h2>
          <p className="text-[0.85rem] text-secondary/50 mb-6 max-w-[520px]">
            Videotutoriales y recursos disponibles en cualquier momento. Cada video corresponde a un módulo de la ruta de aprendizaje.
          </p>

          {videosAsincronos.length === 0 ? (
            <div className="bg-white border border-secondary/[0.08] rounded-[14px] p-10 text-center text-secondary/40">
              <div className="text-3xl mb-3">🎬</div>
              <div className="text-[0.9rem]">No hay videos asincrónicos disponibles aún.</div>
            </div>
          ) : (
            <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
              {videosAsincronos.map((video) => (
                <div
                  key={video.id}
                  onClick={() => navigate(`/taller/${slug}/modulo/${video.moduloOrden}`)}
                  className="grama-card p-4 cursor-pointer flex flex-col gap-2"
                >
                  {/* Thumbnail placeholder */}
                  <div className="bg-gradient-to-br from-dk-base to-dk-surface rounded-lg h-20 flex items-center justify-center relative overflow-hidden mb-1">
                    <div className="absolute inset-0" style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(2,212,126,0.04) 0,rgba(2,212,126,0.04) 1px,transparent 1px,transparent 20px)" }} />
                    <div className="w-8 h-8 rounded-full bg-g-mint/20 flex items-center justify-center relative">
                      <span className="text-[0.9rem] ml-0.5">▶</span>
                    </div>
                    {video.duracion && (
                      <span className="absolute bottom-1.5 right-2 text-[0.65rem] bg-black/50 text-white px-1.5 py-0.5 rounded font-semibold">
                        {video.duracion}
                      </span>
                    )}
                  </div>

                  {/* Module badge */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-ds-pill" style={{ background: `${data.tallerAccent}15`, color: data.tallerAccent }}>
                      Módulo {String(video.moduloOrden).padStart(2,"0")}
                    </span>
                    <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-ds-pill bg-g-mint/10 text-g-mint">
                      VIDEO
                    </span>
                  </div>

                  <div className="text-[0.85rem] font-bold text-secondary leading-snug">{video.titulo}</div>
                  <div className="text-[0.75rem] text-secondary/45 leading-snug">{video.descripcion}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CTA: Calendario ── */}
        <div className="grama-cta-bar">
          <div className="flex gap-3 items-center">
            <span className="text-2xl">📅</span>
            <div>
              <div className="text-[0.95rem] font-bold text-white">¿Quieres recibir recordatorios?</div>
              <div className="text-[0.78rem] text-white/50 mt-0.5">
                Inscríbete al calendario y recibe notificaciones antes de cada transmisión en vivo.
              </div>
            </div>
          </div>
          {proximaLive ? (
            <button onClick={() => navigate(`/taller/${slug}/modulo/${proximaLive.moduloId}/live`)}
              className="grama-btn-primary text-sm py-2.5 px-6 whitespace-nowrap">
              Ver próxima sesión →
            </button>
          ) : (
            <button className="grama-btn-primary text-sm py-2.5 px-6 whitespace-nowrap">
              Ver calendario completo →
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
