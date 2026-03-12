import { useParams, Link } from "react-router-dom";
import { useMemo, memo, useState } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import {
  getBienesByTaller,
  getZonasUnicasByTaller,
  getBienesByZona,
  getTotalBienesByTaller,
} from "@/data/bienesData";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  MapPin,
  Clock,
  FlaskConical,
  Lightbulb,
  Shield,
  ChevronDown,
  BookOpen,
  Video,
  Zap,
  CheckCircle,
  Radio,
  GraduationCap,
  Calendar,
  Users,
  PlayCircle,
  Layers,
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { buildModulosForTaller, getUpcomingLiveSession, getLiveSessionsForTaller } from "@/data/modulosConfig";

// ─── Constantes ───────────────────────────────────────────────
const zonaIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Zona Investigación": FlaskConical,
  "Zona Innovación": Lightbulb,
  "Seguridad": Shield,
};

const zonaDescriptions: Record<string, string> = {
  "Zona Investigación": "Equipos para identificar necesidades, analizar problemas y desarrollar competencias de investigación aplicada",
  "Zona Innovación": "Equipos para diseñar, crear prototipos y desarrollar soluciones innovadoras con tecnología",
  "Seguridad": "Equipamiento de protección personal y herramientas para garantizar un ambiente de trabajo seguro",
};

const tipoBadge: Record<string, { label: string; className: string }> = {
  PDF:         { label: "PDF",         className: "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] border border-border" },
  VIDEO:       { label: "Video",       className: "bg-primary/10 text-primary border border-primary/20" },
  INTERACTIVO: { label: "Interactivo", className: "bg-cyan-500/10 text-cyan-600 border border-cyan-500/20" },
  QUIZ:        { label: "Quiz",        className: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20" },
  "EN VIVO":   { label: "EN VIVO",     className: "bg-red-500/10 text-red-500 border border-red-500/20" },
};

const tipoIcon: Record<string, React.ComponentType<{ className?: string }>> = {
  PDF:         BookOpen,
  VIDEO:       Video,
  INTERACTIVO: Zap,
  QUIZ:        CheckCircle,
  "EN VIVO":   Radio,
};

// ─── Componente ZonaCard (memoizado) ──────────────────────────
const ZonaCard = memo(({
  zona, Icon: ZIcon, count, description, slug,
}: {
  zona: string;
  Icon: React.ComponentType<{ className?: string }>;
  count: number;
  description: string;
  slug: string;
}) => (
  <Link to={`/taller/${slug}/catalogo?zona=${encodeURIComponent(zona)}`} className="group block">
    <div
      className="overflow-hidden bg-card border border-border text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 w-full"
      style={{ borderRadius: "var(--r-xl)" }}
    >
      <div className="hero-gradient p-6 pb-3">
        <ZIcon className="h-6 w-6 text-primary mb-2" />
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">
          {count} bienes
        </span>
        <h3 className="text-lg font-bold text-dk-text mt-2 leading-snug">{zona}</h3>
        <p className="text-dk-muted text-sm mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Progress value={0} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground font-mono">0%</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-3" />
      </div>
    </div>
  </Link>
));
ZonaCard.displayName = "ZonaCard";

// ─── Componente ModuloAccordion ────────────────────────────────
const ModuloAccordion = memo(({
  modulo, index, slug, isOpen, onToggle,
}: {
  modulo: ReturnType<typeof buildModulosForTaller>[0];
  index: number;
  slug: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const isFinal = modulo.orden === 6;
  const hasLive = modulo.contenidos.some(c => c.tipo === "EN VIVO") ||
    modulo.subSecciones?.some(s => s.contenidos.some(c => c.tipo === "EN VIVO"));

  // Aplanar todos los contenidos (incluyendo subsecciones)
  const allContenidos = [
    ...(modulo.subSecciones?.flatMap(s => s.contenidos) ?? []),
    ...modulo.contenidos,
  ];

  return (
    <div
      className={`border rounded-xl overflow-hidden transition-all duration-200 ${
        isOpen
          ? "border-primary/30 shadow-sm"
          : "border-border hover:border-primary/20"
      }`}
    >
      {/* Header clickeable */}
      <button
        className="w-full text-left"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4 p-5 bg-card">
          {/* Número */}
          <div
            className={`text-2xl font-extrabold w-10 shrink-0 ${
              isFinal ? "text-primary" : "text-muted-foreground/40"
            }`}
          >
            {String(index + 1).padStart(2, "0")}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground text-sm md:text-base">
                {modulo.icon} {modulo.nombre}
              </span>
              {isFinal && (
                <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">
                  🎓 Certifica
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
              {modulo.descripcion}
            </p>
          </div>

          {/* Chips + chevron */}
          <div className="flex items-center gap-2 shrink-0">
            {hasLive && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                En vivo
              </span>
            )}
            {modulo.subSecciones && (
              <span className="hidden sm:inline text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
                {modulo.subSecciones.length} temas
              </span>
            )}
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </div>
      </button>

      {/* Body expandible */}
      {isOpen && (
        <div className="border-t border-border bg-muted/30 px-5 py-4">
          <div className="space-y-2">
            {/* Si tiene subsecciones (módulo 1) */}
            {modulo.subSecciones
              ? modulo.subSecciones.map((sub) => (
                  <div key={sub.id}>
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 mt-3 first:mt-0">
                      {sub.titulo}
                    </div>
                    {sub.contenidos.map((c) => {
                      const badge = tipoBadge[c.tipo] ?? tipoBadge.PDF;
                      const Icon = tipoIcon[c.tipo] ?? BookOpen;
                      return (
                        <ContenidoRow key={c.id} badge={badge} Icon={Icon} contenido={c} slug={slug} moduloOrden={modulo.orden} />
                      );
                    })}
                  </div>
                ))
              : allContenidos.map((c) => {
                  const badge = tipoBadge[c.tipo] ?? tipoBadge.PDF;
                  const Icon = tipoIcon[c.tipo] ?? BookOpen;
                  return (
                    <ContenidoRow key={c.id} badge={badge} Icon={Icon} contenido={c} slug={slug} moduloOrden={modulo.orden} />
                  );
                })}
          </div>

          {/* CTA al módulo */}
          <div className="mt-4 pt-4 border-t border-border">
            <Link
              to={`/taller/${slug}/modulo/${modulo.orden}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <Layers className="h-4 w-4" />
              Ir al Módulo {modulo.orden}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
});
ModuloAccordion.displayName = "ModuloAccordion";

// ─── Fila de contenido dentro del accordion ───────────────────
const ContenidoRow = memo(({
  badge, Icon, contenido, slug, moduloOrden,
}: {
  badge: { label: string; className: string };
  Icon: React.ComponentType<{ className?: string }>;
  contenido: { id: string; titulo: string; tipo: string; duracion?: string; estimatedMinutes?: number; pages?: number; durationMinutes?: number; liveId?: string };
  slug: string;
  moduloOrden: number;
}) => {
  const isLive = contenido.tipo === "EN VIVO";
  const duration = contenido.duracion ?? (contenido.estimatedMinutes ? `${contenido.estimatedMinutes} min` : contenido.pages ? `${contenido.pages} pág.` : contenido.durationMinutes ? `${contenido.durationMinutes} min` : "");

  return (
    <div
      className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
        isLive ? "bg-red-500/5 border border-red-500/10" : "hover:bg-muted/50"
      }`}
    >
      <Icon className={`h-3.5 w-3.5 shrink-0 ${isLive ? "text-red-500" : "text-muted-foreground"}`} />
      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shrink-0 ${badge.className}`}>
        {badge.label}
        {duration ? ` · ${duration}` : ""}
      </span>
      <span className="text-xs text-foreground flex-1 line-clamp-1">{contenido.titulo}</span>
      {isLive && contenido.liveId && (
        <Link
          to={`/taller/${slug}/modulo/${moduloOrden}/live`}
          className="text-xs font-semibold text-red-500 hover:underline shrink-0"
        >
          Unirse →
        </Link>
      )}
    </div>
  );
});
ContenidoRow.displayName = "ContenidoRow";

// ─── Tarjeta de sesión en vivo ─────────────────────────────────
const SesionCard = memo(({
  session,
  slug,
}: {
  session: ReturnType<typeof getLiveSessionsForTaller>[0];
  slug: string;
}) => {
  const statusConfig = {
    active:    { label: "En vivo",  dotClass: "bg-red-500 animate-pulse",  badgeClass: "bg-red-500/15 text-red-500 border-red-500/20" },
    scheduled: { label: "Próxima",  dotClass: "bg-amber-400",              badgeClass: "bg-amber-400/15 text-amber-500 border-amber-400/20" },
    recorded:  { label: "Grabada",  dotClass: "bg-slate-400",              badgeClass: "bg-slate-400/15 text-slate-400 border-slate-400/20" },
  }[session.status];

  const dateLabel = session.status === "recorded"
    ? `Grabada · ${session.durationMinutes} min`
    : session.scheduledAt.toLocaleDateString("es-PE", { weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
      {/* Status badge */}
      <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border w-fit ${statusConfig.badgeClass}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
        {statusConfig.label}
      </span>

      <div className="flex-1">
        <h3 className="font-bold text-foreground text-sm leading-snug">{session.titulo}</h3>
        <p className="text-xs text-muted-foreground mt-1">{session.docente}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full font-medium">
          <Calendar className="h-3 w-3" />
          {dateLabel}
        </span>
        {session.participants > 0 && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <Users className="h-3 w-3" />
            {session.participants} inscritos
          </span>
        )}
      </div>

      {session.status !== "recorded" ? (
        <Link
          to={`/taller/${slug}/modulo/${session.moduloId}/live`}
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-white bg-primary hover:bg-primary/90 px-3 py-2 rounded-lg transition-colors w-full"
        >
          <Radio className="h-3.5 w-3.5" />
          {session.status === "active" ? "Unirse ahora" : "Ver detalles"}
        </Link>
      ) : (
        <button className="inline-flex items-center justify-center gap-2 text-xs font-semibold text-foreground bg-muted hover:bg-muted/70 px-3 py-2 rounded-lg transition-colors w-full">
          <PlayCircle className="h-3.5 w-3.5" />
          Ver grabación
        </button>
      )}
    </div>
  );
});
SesionCard.displayName = "SesionCard";

// ─── COMPONENTE PRINCIPAL ──────────────────────────────────────
const TallerDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const [openModulo, setOpenModulo] = useState<number | null>(0); // M1 abierto por defecto

  const taller      = getTallerBySlug(slug ?? "");
  const bienes      = useMemo(() => getBienesByTaller(slug ?? ""), [slug]);
  const zonasUnicas = useMemo(() => getZonasUnicasByTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const liveSessions = useMemo(() => getLiveSessionsForTaller(slug ?? "").slice(0, 4), [slug]);

  const zonasData = useMemo(
    () =>
      zonasUnicas.map((zona) => ({
        zona,
        Icon: zonaIcons[zona] || Package,
        count: getBienesByZona(slug ?? "", zona).length,
        description: zonaDescriptions[zona] ?? "",
      })),
    [zonasUnicas, slug]
  );

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="bg-card border border-border p-8 text-center"
            style={{ borderRadius: "var(--r-xl)" }}
          >
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Taller no encontrado</h2>
            <Link to="/" className="text-sm text-primary font-semibold hover:underline">
              ← Volver al Hub
            </Link>
          </div>
        </div>
      </>
    );
  }

  const stats = [
    { icon: Package,      label: "Total de bienes",  value: String(totalBienes || bienes.length) },
    { icon: MapPin,       label: "Zonas",             value: String(zonasUnicas.length) },
    { icon: Clock,        label: "Horas Programa",    value: "150h" },
    { icon: FlaskConical, label: "Estado",            value: "En progreso" },
  ];

  const totalContenidos = modulos.reduce((acc, m) => {
    const subCount = m.subSecciones?.reduce((a, s) => a + s.contenidos.length, 0) ?? 0;
    return acc + m.contenidos.length + subCount;
  }, 0);

  const sesionesVivo = modulos.reduce((acc, m) => {
    const fromSub = m.subSecciones?.reduce((a, s) => a + s.contenidos.filter(c => c.tipo === "EN VIVO").length, 0) ?? 0;
    return acc + m.contenidos.filter(c => c.tipo === "EN VIVO").length + fromSub;
  }, 0);

  return (
    <>
      <PageHeader>
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{taller.nombre}</span>
        <span className="text-xs text-muted-foreground">T{taller.numero}</span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">

          {/* ── HERO ─────────────────────────────────────────── */}
          <div className="hero-gradient p-8 text-dk-text" style={{ borderRadius: "var(--r-xl)" }}>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{taller.nombre}</h1>
            <p className="text-dk-muted text-sm md:text-base max-w-2xl">{taller.descripcion}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {zonasUnicas.map((zona) => (
                <span
                  key={zona}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary"
                >
                  {zona}
                </span>
              ))}
            </div>
          </div>

          {/* ── STATS ────────────────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-card border border-border p-4 text-center hover:shadow-sm transition-shadow"
                style={{ borderRadius: "var(--r-lg)" }}
              >
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── ZONAS DEL TALLER ─────────────────────────────── */}
          <div>
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Zonas del Taller
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {zonasData.map(({ zona, Icon: ZIcon, count, description }) => (
                <ZonaCard
                  key={zona}
                  zona={zona}
                  Icon={ZIcon}
                  count={count}
                  description={description}
                  slug={slug ?? ""}
                />
              ))}
            </div>
          </div>

          {/* ── CATÁLOGO CTA ─────────────────────────────────── */}
          <Link to={`/taller/${slug}/catalogo`} className="group block">
            <div
              className="overflow-hidden bg-card border border-border text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5"
              style={{ borderRadius: "var(--r-xl)" }}
            >
              <div className="hero-gradient p-6 flex items-center gap-5">
                <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-dk-text leading-snug">Catálogo Completo</h3>
                  <p className="text-dk-muted text-sm mt-1">
                    Explora los {totalBienes || bienes.length} bienes con fichas técnicas detalladas
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-dk-muted group-hover:text-primary transition-colors shrink-0" />
              </div>
            </div>
          </Link>

          {/* ── RUTA DE APRENDIZAJE ──────────────────────────── */}
          <div>
            <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-2">
                  {modulos.length} módulos · {sesionesVivo} sesiones en vivo
                </div>
                <h2 className="text-xl font-extrabold text-foreground">
                  Tu Ruta de <span className="text-primary">Aprendizaje</span>
                </h2>
              </div>
              <button
                onClick={() => setOpenModulo(openModulo === null ? 0 : null)}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
              >
                {openModulo !== null ? "Contraer todo" : "Expandir todo"}
              </button>
            </div>

            <div className="space-y-3">
              {modulos.map((modulo, index) => (
                <ModuloAccordion
                  key={modulo.id}
                  modulo={modulo}
                  index={index}
                  slug={slug ?? ""}
                  isOpen={openModulo === index}
                  onToggle={() => setOpenModulo(openModulo === index ? null : index)}
                />
              ))}
            </div>

            {/* CTA certificación */}
            <div
              className="mt-5 p-5 flex items-center justify-between flex-wrap gap-4"
              style={{
                background: "linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)))",
                borderRadius: "var(--r-xl)",
                border: "1px solid hsl(var(--border))",
              }}
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-8 w-8 text-primary shrink-0" />
                <div>
                  <p className="font-bold text-foreground text-sm">Certificación por módulo</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Se otorga un certificado al finalizar satisfactoriamente cada módulo desde el Módulo 1.
                  </p>
                </div>
              </div>
              <Link
                to={`/taller/${slug}/modulo/1`}
                className="inline-flex items-center gap-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 px-4 py-2.5 rounded-lg transition-colors shrink-0"
              >
                Iniciar Módulo 1
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── SESIONES EN VIVO ─────────────────────────────── */}
          {liveSessions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    En tiempo real
                  </div>
                  <h2 className="text-xl font-extrabold text-foreground">
                    Sesiones en <span className="text-primary">Vivo</span>
                  </h2>
                </div>
                <Link
                  to={`/taller/${slug}/modulo/1/live`}
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  Ver calendario
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {liveSessions.map((session) => (
                  <SesionCard key={session.id} session={session} slug={slug ?? ""} />
                ))}
              </div>
            </div>
          )}

          {/* ── REPOSITORIO QUICK ACCESS ─────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border mb-2">
                  Recursos didácticos
                </div>
                <h2 className="text-xl font-extrabold text-foreground">
                  Repositorio de <span className="text-primary">Materiales</span>
                </h2>
              </div>
              <Link
                to={`/taller/${slug}/repositorio`}
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Ver todo
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { icon: "📋", label: "Fichas Técnicas",       count: "+45", desc: "Procedimientos y protocolos" },
                { icon: "🎬", label: "Videotutoriales",        count: "+32", desc: "Demostraciones en video" },
                { icon: "📐", label: "Guías de Evaluación",    count: "+28", desc: "Rúbricas y listas de cotejo" },
                { icon: "🧪", label: "Proyectos Prácticos",    count: "16",  desc: "Proyectos por bimestre" },
                { icon: "📊", label: "Sesiones de Aprendizaje",count: "+60", desc: "Planificaciones editables" },
                { icon: "📚", label: "Material Estudiante",    count: "+80", desc: "Hojas de trabajo imprimibles" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={`/taller/${slug}/repositorio`}
                  className="group block"
                >
                  <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
                    <span className="text-2xl">{item.icon}</span>
                    <p className="font-bold text-foreground text-sm mt-2">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    <p className="text-xs font-semibold text-primary mt-2">
                      {item.count} disponibles
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
};

export default TallerDashboard;
