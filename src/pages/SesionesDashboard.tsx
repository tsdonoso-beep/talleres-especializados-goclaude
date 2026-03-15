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

// ── Helper: formato de fecha ──────────────────────────────────────────────────
function formatFecha(date: Date): string {
  return date.toLocaleDateString("es-PE", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
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

// ── SectionTag ────────────────────────────────────────────────────────────────
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

// ── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; bg: string; color: string; dot: string }> = {
    active:    { label: "● En vivo",  bg: "rgba(239,68,68,0.15)",    color: "#f87171", dot: "#ef4444" },
    scheduled: { label: "◎ Próxima",  bg: "rgba(249,115,22,0.15)",   color: "#fdba74", dot: "#f97316" },
    recorded:  { label: "◉ Grabada",  bg: "rgba(100,116,139,0.15)",  color: "#94a3b8", dot: "#64748b" },
  };
  const s = map[status] ?? map.recorded;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color,
      fontSize: "0.68rem", fontWeight: 700,
      letterSpacing: "0.08em", textTransform: "uppercase" as const,
      padding: "3px 10px", borderRadius: 100,
    }}>
      {s.label}
    </span>
  );
}

// ── COMPONENTE PRINCIPAL ──────────────────────────────────────────────────────
export default function SesionesDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const taller    = getTallerBySlug(slug ?? "");
  const data      = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const modulos   = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const sesiones  = useMemo(() => getLiveSessionsForTaller(slug ?? ""), [slug]);
  const activaLive   = getActiveLiveSession(slug ?? "");
  const proximaLive  = getUpcomingLiveSession(slug ?? "");

  // Videos asincrónicos: todos los contenidos tipo VIDEO de todos los módulos
  const videosAsincronos = useMemo(() => {
    return modulos.flatMap(m =>
      (m.contenidos ?? [])
        .filter(c => c.tipo === "VIDEO")
        .map(c => ({ ...c, moduloNombre: m.nombre, moduloOrden: m.orden }))
    );
  }, [modulos]);

  if (!taller) {
    return (
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
      </div>
    );
  }

  const sesionesVivo     = sesiones.filter(s => s.status === "active" || s.status === "scheduled");
  const sesionesGrabadas = sesiones.filter(s => s.status === "recorded");

  return (
    <main style={{ flex: 1, overflowY: "auto", fontFamily: "'Manrope', sans-serif", background: "#f7fdfb" }}>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg,#043941 0%,#052e35 55%,#061f25 100%)",
        padding: "clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem)",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(60deg,rgba(2,212,126,0.025) 0,rgba(2,212,126,0.025) 1px,transparent 1px,transparent 60px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: -80, right: -80, width: 240, height: 240, background: "rgba(239,68,68,0.05)", borderRadius: "50%", pointerEvents: "none" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          {/* Breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "1.25rem" }}>
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" as const, textDecoration: "none" }}>
              {taller.nombre}
            </Link>
            <span style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>›</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#02d47e", letterSpacing: "0.08em", textTransform: "uppercase" as const }}>
              Sesiones
            </span>
          </div>

          <h1 style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Sesiones <span style={{ color: "#02d47e" }}>en Vivo</span><br />
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.6em", fontWeight: 500 }}>y asíncronas</span>
          </h1>

          {/* Stats */}
          <div style={{ display: "flex", gap: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.07)", flexWrap: "wrap" as const }}>
            {[
              { val: activaLive ? "1" : "0", label: "En vivo ahora", accent: "#ef4444" },
              { val: String(sesionesVivo.length),     label: "Próximas sesiones",  accent: "#02d47e" },
              { val: String(sesionesGrabadas.length), label: "Sesiones grabadas",  accent: "rgba(255,255,255,0.6)" },
              { val: String(videosAsincronos.length), label: "Videos asincrónicos", accent: "rgba(255,255,255,0.6)" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: "1.5rem", fontWeight: 800, color: s.accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.06em", marginTop: 3 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALERT: sesión activa ─────────────────────────────────────────── */}
      {activaLive && (
        <div style={{
          background: "linear-gradient(90deg,rgba(239,68,68,0.12),rgba(239,68,68,0.06))",
          border: "1px solid rgba(239,68,68,0.25)",
          borderLeft: "4px solid #ef4444",
          margin: "1.5rem clamp(1.5rem,5vw,4rem) 0",
          borderRadius: "0 10px 10px 0",
          padding: "1rem 1.25rem",
          display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" as const,
        }}>
          <span style={{ fontSize: "1.2rem" }}>🔴</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>
              Sesión en vivo ahora: <span style={{ color: "#f87171" }}>{activaLive.titulo}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
              Módulo {activaLive.moduloId} · {formatDuracion(activaLive.durationMinutes)}
            </div>
          </div>
          <button
            onClick={() => navigate(`/taller/${slug}/modulo/${activaLive.moduloId}/live`)}
            style={{ background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: "0.8rem", padding: "7px 18px", borderRadius: 100, border: "none", cursor: "pointer" }}
          >
            Unirse →
          </button>
        </div>
      )}

      <div style={{ padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem)", display: "flex", flexDirection: "column" as const, gap: "3rem" }}>

        {/* ── 1. SESIONES EN VIVO ─────────────────────────────────────────── */}
        <section>
          <SectionTag label="En tiempo real" />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", marginBottom: "1.5rem" }}>
            Sesiones en <span style={{ color: "#02d47e" }}>Vivo</span>
          </h2>

          {sesiones.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid rgba(4,57,65,0.08)", borderRadius: 14, padding: "2.5rem", textAlign: "center" as const, color: "rgba(4,57,65,0.4)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>📅</div>
              <div style={{ fontSize: "0.9rem" }}>No hay sesiones programadas aún.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "0.75rem" }}>
              {sesiones.map(sesion => {
                const modulo = modulos.find(m => String(m.orden) === String(sesion.moduloId));
                const esActiva = sesion.status === "active";
                return (
                  <div key={sesion.id} style={{
                    background: "#fff",
                    border: `1.5px solid ${esActiva ? "rgba(239,68,68,0.35)" : "rgba(4,57,65,0.08)"}`,
                    borderRadius: 14, overflow: "hidden",
                    boxShadow: esActiva ? "0 4px 20px rgba(239,68,68,0.08)" : "none",
                    transition: "border-color 0.2s",
                  }}>
                    <div style={{ padding: "1.25rem 1.5rem", display: "flex", alignItems: "flex-start", gap: "1.25rem" }}>

                      {/* Ícono módulo */}
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: esActiva ? "rgba(239,68,68,0.08)" : `${data.tallerAccent}15`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "1.25rem", flexShrink: 0,
                      }}>
                        {modulo?.icon ?? "🎥"}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
                          <StatusBadge status={sesion.status} />
                          {modulo && (
                            <span style={{ fontSize: "0.68rem", background: "rgba(4,57,65,0.06)", color: "rgba(4,57,65,0.5)", padding: "2px 8px", borderRadius: 100, fontWeight: 600 }}>
                              {modulo.nombre}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#043941", marginBottom: 3 }}>{sesion.titulo}</div>
                        <div style={{ fontSize: "0.78rem", color: "rgba(4,57,65,0.5)", display: "flex", gap: "1rem", flexWrap: "wrap" as const }}>
                          {sesion.scheduledAt && (
                            <span>📅 {formatFecha(sesion.scheduledAt)} · {formatHora(sesion.scheduledAt)}</span>
                          )}
                          <span>⏱ {formatDuracion(sesion.durationMinutes)}</span>
                          {sesion.participants > 0 && <span>👥 {sesion.participants} participantes</span>}
                        </div>
                      </div>

                      {/* CTA */}
                      <div style={{ flexShrink: 0 }}>
                        {sesion.status === "active" && (
                          <button
                            onClick={() => navigate(`/taller/${slug}/modulo/${sesion.moduloId}/live`)}
                            style={{ background: "#ef4444", color: "#fff", fontWeight: 700, fontSize: "0.8rem", padding: "8px 18px", borderRadius: 100, border: "none", cursor: "pointer" }}
                          >
                            Unirse →
                          </button>
                        )}
                        {sesion.status === "scheduled" && (
                          <button
                            onClick={() => navigate(`/taller/${slug}/modulo/${sesion.moduloId}/live`)}
                            style={{ background: "rgba(249,115,22,0.1)", color: "#f97316", fontWeight: 700, fontSize: "0.8rem", padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(249,115,22,0.25)", cursor: "pointer" }}
                          >
                            Ver detalle →
                          </button>
                        )}
                        {sesion.status === "recorded" && sesion.vimeoId && (
                          <button
                            onClick={() => navigate(`/taller/${slug}/modulo/${sesion.moduloId}/live`)}
                            style={{ background: "rgba(4,57,65,0.06)", color: "#043941", fontWeight: 700, fontSize: "0.8rem", padding: "8px 18px", borderRadius: 100, border: "1px solid rgba(4,57,65,0.12)", cursor: "pointer" }}
                          >
                            Ver grabación →
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Agenda (si existe) */}
                    {sesion.agenda && sesion.agenda.length > 0 && (
                      <div style={{ borderTop: "1px solid rgba(4,57,65,0.06)", padding: "0.75rem 1.5rem", background: "rgba(4,57,65,0.02)", display: "flex", gap: "0.5rem", flexWrap: "wrap" as const }}>
                        <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "rgba(4,57,65,0.4)", textTransform: "uppercase" as const, letterSpacing: "0.08em", alignSelf: "center", marginRight: 4 }}>Agenda:</span>
                        {sesion.agenda.map((item, i) => (
                          <span key={i} style={{ fontSize: "0.72rem", background: "#fff", border: "1px solid rgba(4,57,65,0.08)", color: "rgba(4,57,65,0.6)", padding: "2px 10px", borderRadius: 100 }}>
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

        {/* ── 2. SESIONES ASÍNCRONAS ──────────────────────────────────────── */}
        <section>
          <SectionTag label="A tu ritmo" />
          <h2 style={{ fontSize: "clamp(1.4rem,3vw,2rem)", fontWeight: 800, color: "#043941", letterSpacing: "-0.025em", marginBottom: "0.5rem" }}>
            Sesiones <span style={{ color: "#02d47e" }}>Asíncronas</span>
          </h2>
          <p style={{ fontSize: "0.85rem", color: "rgba(4,57,65,0.5)", marginBottom: "1.5rem", maxWidth: 520 }}>
            Videotutoriales y recursos disponibles en cualquier momento. Cada video corresponde a un módulo de la ruta de aprendizaje.
          </p>

          {videosAsincronos.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid rgba(4,57,65,0.08)", borderRadius: 14, padding: "2.5rem", textAlign: "center" as const, color: "rgba(4,57,65,0.4)" }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>🎬</div>
              <div style={{ fontSize: "0.9rem" }}>No hay videos asincrónicos disponibles aún.</div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "0.75rem" }}>
              {videosAsincronos.map((video, i) => (
                <div
                  key={video.id}
                  onClick={() => navigate(`/taller/${slug}/modulo/${video.moduloOrden}`)}
                  style={{
                    background: "#fff", border: "1px solid rgba(4,57,65,0.08)",
                    borderRadius: 12, padding: "1.1rem 1.25rem",
                    cursor: "pointer", transition: "all 0.2s",
                    display: "flex", flexDirection: "column" as const, gap: "0.5rem",
                  }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "#02d47e"; el.style.transform = "translateY(-3px)"; el.style.boxShadow = "0 6px 18px rgba(2,212,126,0.08)"; }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(4,57,65,0.08)"; el.style.transform = "translateY(0)"; el.style.boxShadow = "none"; }}
                >
                  {/* Thumbnail placeholder */}
                  <div style={{
                    background: `linear-gradient(135deg,#043941,#045f6c)`,
                    borderRadius: 8, height: 80,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative", overflow: "hidden",
                    marginBottom: "0.25rem",
                  }}>
                    <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg,rgba(2,212,126,0.04) 0,rgba(2,212,126,0.04) 1px,transparent 1px,transparent 20px)" }} />
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(2,212,126,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                      <span style={{ fontSize: "0.9rem", marginLeft: 2 }}>▶</span>
                    </div>
                    {video.duracion && (
                      <span style={{ position: "absolute", bottom: 6, right: 8, fontSize: "0.65rem", background: "rgba(0,0,0,0.5)", color: "#fff", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>
                        {video.duracion}
                      </span>
                    )}
                  </div>

                  {/* Módulo badge */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: "0.65rem", background: `${data.tallerAccent}15`, color: data.tallerAccent, padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
                      Módulo {String(video.moduloOrden).padStart(2,"0")}
                    </span>
                    <span style={{ fontSize: "0.65rem", background: "rgba(2,212,126,0.1)", color: "#02d47e", padding: "2px 8px", borderRadius: 100, fontWeight: 700 }}>
                      VIDEO
                    </span>
                  </div>

                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#043941", lineHeight: 1.3 }}>{video.titulo}</div>
                  <div style={{ fontSize: "0.75rem", color: "rgba(4,57,65,0.45)", lineHeight: 1.4 }}>{video.descripcion}</div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── CTA: Calendario ─────────────────────────────────────────────── */}
        <div style={{
          background: "linear-gradient(135deg,#043941,#045f6c)",
          borderRadius: 16, padding: "1.75rem 2rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          gap: "1.5rem", flexWrap: "wrap" as const,
        }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "1.5rem" }}>📅</span>
            <div>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "0.95rem" }}>¿Quieres recibir recordatorios?</div>
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>
                Inscríbete al calendario y recibe notificaciones antes de cada transmisión en vivo.
              </div>
            </div>
          </div>
          {proximaLive ? (
            <button
              onClick={() => navigate(`/taller/${slug}/modulo/${proximaLive.moduloId}/live`)}
              style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "10px 22px", borderRadius: 100, border: "none", cursor: "pointer", whiteSpace: "nowrap" as const }}
            >
              Ver próxima sesión →
            </button>
          ) : (
            <button style={{ background: "#02d47e", color: "#043941", fontWeight: 700, fontSize: "0.875rem", padding: "10px 22px", borderRadius: 100, border: "none", cursor: "pointer", whiteSpace: "nowrap" as const }}>
              Ver calendario completo →
            </button>
          )}
        </div>

      </div>
    </main>
  );
}
