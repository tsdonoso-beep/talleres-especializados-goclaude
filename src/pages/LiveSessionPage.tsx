import { useParams, useNavigate } from "react-router-dom";
import { getModuloByNumber, getLiveSessionsForTaller } from "@/data/modulosConfig";
import { getTallerBySlug } from "@/data/talleresConfig";
import { useProgress } from "@/contexts/ProgressContext";
import { VimeoPlaceholder } from "@/components/VimeoPlaceholder";
import { CountdownTimer } from "@/components/CountdownTimer";
import { ArrowLeft, Users, Calendar, Download, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

const LiveSessionPage = () => {
  const { slug, num } = useParams<{ slug: string; num: string }>();
  const navigate = useNavigate();
  const { markContenidoCompleted, getContenidoEstado } = useProgress();

  const taller = getTallerBySlug(slug || "");
  const moduloNum = parseInt(num || "1", 10);
  const modulo = getModuloByNumber(slug || "", moduloNum);

  // Find live content item
  const allContenidos = [
    ...(modulo?.contenidos || []),
    ...(modulo?.subSecciones?.flatMap(s => s.contenidos) || []),
  ];
  const liveItem = allContenidos.find(c => c.tipo === "EN VIVO");
  const sessions = getLiveSessionsForTaller(slug || "");
  const session = liveItem?.liveId ? sessions.find(s => s.id === liveItem.liveId) : sessions[0];

  if (!taller || !modulo || !session) {
    return (
      <>
        <PageHeader />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Sesión no encontrada.</p>
          <button onClick={() => navigate(`/taller/${slug}`)} className="text-primary text-sm mt-2">← Volver</button>
        </div>
      </>
    );
  }

  const estado = liveItem ? getContenidoEstado(liveItem.id) : { completed: false, inProgress: false };

  const handleMarkAttended = () => {
    if (liveItem) markContenidoCompleted(liveItem.id);
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString("es-PE", { weekday: "long", day: "numeric", month: "long" });
  const formatTime = (d: Date) =>
    d.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <PageHeader>
        <button
          onClick={() => navigate(`/taller/${slug}/modulo/${num}`)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">Sesión en Vivo</span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
          {/* Header banner */}
          <div className="hero-gradient p-8" style={{ borderRadius: "var(--r-xl)" }}>
            <div className="flex items-center gap-3 mb-3">
              {session.status === "active" && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "hsl(var(--tag-pdf-text))" }} />
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "hsl(var(--tag-pdf-text))" }} />
                </span>
              )}
              <span className="text-xs font-bold uppercase tracking-wider" style={{
                color: session.status === "active" ? "hsl(var(--tag-pdf-text))" :
                  session.status === "recorded" ? "hsl(var(--dk-muted))" : "hsl(var(--tag-vid-text))"
              }}>
                {session.status === "active" ? "EN VIVO AHORA" :
                  session.status === "scheduled" ? "PRÓXIMA SESIÓN" : "GRABACIÓN DISPONIBLE"}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold mb-1" style={{ color: "hsl(var(--dk-text))" }}>
              {session.titulo}
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--dk-muted))" }}>
              {modulo.nombre} · Docente: {session.docente}
            </p>
            {session.status === "active" && session.participants > 0 && (
              <div className="flex items-center gap-1 mt-2 text-xs" style={{ color: "hsl(var(--dk-muted))" }}>
                <Users className="h-3 w-3" /> {session.participants} participantes conectados
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {(session.status === "active" || session.status === "recorded") && (
                <VimeoPlaceholder
                  label={session.status === "active" ? "La sesión en vivo se transmitirá aquí" : "Grabación de la sesión"}
                />
              )}

              {session.status === "scheduled" && (
                <div className="bg-card border border-border rounded-xl p-8 text-center space-y-4">
                  <p className="text-sm text-muted-foreground">La sesión comienza en:</p>
                  <CountdownTimer targetDate={session.scheduledAt} />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-foreground capitalize">{formatDate(session.scheduledAt)}</p>
                    <p>{formatTime(session.scheduledAt)} — {session.durationMinutes} min</p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button className="inline-flex items-center gap-1.5 text-xs border border-border rounded-lg px-3 py-2 hover:border-primary/50 transition-colors">
                      <Calendar className="h-3.5 w-3.5" /> Agregar al calendario
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {session.status === "recorded" && (
                  <button className="inline-flex items-center gap-1.5 text-sm border border-border rounded-lg px-4 py-2 hover:border-primary/50 transition-colors">
                    <Download className="h-4 w-4" /> Descargar diapositivas
                  </button>
                )}
                <button
                  onClick={handleMarkAttended}
                  disabled={estado.completed}
                  className={`inline-flex items-center gap-1.5 text-sm rounded-lg px-4 py-2 font-medium transition-all ${
                    estado.completed
                      ? "bg-primary/10 text-primary cursor-default"
                      : "bg-primary text-primary-foreground btn-glow"
                  }`}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {estado.completed
                    ? session.status === "active" ? "Asistencia registrada" : "Marcado como visto"
                    : session.status === "active" ? "Marcar como asistido" : "Marcar como visto"}
                </button>
              </div>
            </div>

            {/* Sidebar — Agenda */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <h3 className="font-bold text-sm text-foreground mb-3">📋 Agenda</h3>
                <ol className="space-y-2">
                  {session.agenda.map((a, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <span className="text-muted-foreground font-mono text-xs w-14 flex-shrink-0">{a.tiempo}</span>
                      <span className="text-foreground">{a.tema}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {session.status === "recorded" && (
                <div className="bg-card border border-border rounded-xl p-5 text-sm text-muted-foreground">
                  <p>Grabado el: <strong className="text-foreground capitalize">{formatDate(session.scheduledAt)}</strong></p>
                  <p>Duración: {session.durationMinutes} min</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LiveSessionPage;
