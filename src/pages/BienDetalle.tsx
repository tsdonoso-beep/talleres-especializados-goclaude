import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller } from "@/data/bienesData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, ArrowRight, ChevronLeft, Package, BookOpen,
  Tag, MapPin, Hash, Layers, Settings, GraduationCap,
  Play, FileText, Download, Wrench, Info,
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";

const zonaBadgeColors: Record<string, string> = {
  "Zona Investigación": "bg-g-light text-g-deep",
  "Zona Innovación":    "bg-tag-vid-bg text-tag-vid-text",
  "Seguridad":          "bg-tag-pdf-bg text-tag-pdf-text",
};

function getZonaBadge(zona: string): string {
  for (const [key, cls] of Object.entries(zonaBadgeColors)) {
    if (zona.toUpperCase().includes(key.replace("Zona ", "").toUpperCase().substring(0, 6)))
      return cls;
  }
  return zonaBadgeColors[zona] || "bg-muted text-muted-foreground";
}

// ── Frame de video vacío ──────────────────────────────────────────────────────
function VideoFrame({ title }: { title: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-border bg-card">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
        <Play className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-medium text-foreground">
          Video de Operatividad y Mantenimiento
        </span>
      </div>
      {/* Frame vacío con aspect ratio 16:9 */}
      <div className="relative w-full bg-muted/30" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div
            className="h-14 w-14 rounded-full flex items-center justify-center"
            style={{ background: "hsl(var(--grama-green) / 0.15)" }}
          >
            <Play className="h-6 w-6 ml-0.5" style={{ color: "hsl(var(--grama-green))" }} />
          </div>
          <div className="text-center px-8">
            <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
            <p className="text-xs text-muted-foreground">
              Video disponible próximamente
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Botones PDF ───────────────────────────────────────────────────────────────
function PdfButtons({ onDownload }: { onDownload: () => void }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Manual de Operatividad */}
      <button
        onClick={onDownload}
        className="group flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left"
        style={{
          borderColor: "hsl(var(--tag-pdf-bg))",
          background: "hsl(var(--tag-pdf-bg) / 0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--tag-pdf-text))";
          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--tag-pdf-bg) / 0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--tag-pdf-bg))";
          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--tag-pdf-bg) / 0.3)";
        }}
      >
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--tag-pdf-bg))" }}
        >
          <FileText className="h-5 w-5" style={{ color: "hsl(var(--tag-pdf-text))" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Manual de Operatividad</p>
          <p className="text-[11px] text-muted-foreground">Guía de uso del equipo</p>
        </div>
        <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </button>

      {/* Manual de Mantenimiento */}
      <button
        onClick={onDownload}
        className="group flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 text-left"
        style={{
          borderColor: "hsl(var(--tag-video-bg))",
          background: "hsl(var(--tag-video-bg) / 0.3)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--tag-video-text))";
          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--tag-video-bg) / 0.6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderColor = "hsl(var(--tag-video-bg))";
          (e.currentTarget as HTMLButtonElement).style.background = "hsl(var(--tag-video-bg) / 0.3)";
        }}
      >
        <div
          className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--tag-video-bg))" }}
        >
          <Wrench className="h-5 w-5" style={{ color: "hsl(var(--tag-video-text))" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">Manual de Mantenimiento</p>
          <p className="text-[11px] text-muted-foreground">Guía de mantención del equipo</p>
        </div>
        <Download className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
      </button>
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
const BienDetalle = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);

  const { bien, prevBien, nextBien, currentIndex } = useMemo(() => {
    const idx = bienes.findIndex((b) => b.n === Number(id));
    return {
      bien:         bienes[idx]     || null,
      prevBien:     bienes[idx - 1] || null,
      nextBien:     bienes[idx + 1] || null,
      currentIndex: idx + 1,
    };
  }, [bienes, id]);

  const handleDownload = () =>
    toast({
      title: "📄 Descarga disponible próximamente",
      description: "Los PDFs se conectarán cuando subas los archivos.",
    });

  if (!taller || !bien) {
    return (
      <>
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-card border border-border p-8 text-center rounded-xl">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Bien no encontrado</h2>
            <Link to={`/taller/${slug}/repositorio`} className="text-sm text-primary font-semibold hover:underline">
              ← Volver al repositorio
            </Link>
          </div>
        </div>
      </>
    );
  }

  const area    = (bien as any).area    || "";
  const subarea = (bien as any).subarea || "";

  return (
    <>
      <PageHeader>
        <button
          onClick={() => navigate(-1)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <span className="text-xs text-muted-foreground font-medium">{taller.nombreCorto}</span>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm font-semibold text-foreground truncate">Ficha #{bien.n}</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">
          {currentIndex} / {bienes.length}
        </span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Hub</Link>
            <span>/</span>
            <Link to={`/taller/${slug}`} className="hover:text-foreground transition-colors">{taller.nombreCorto}</Link>
            <span>/</span>
            <Link to={`/taller/${slug}/repositorio`} className="hover:text-foreground transition-colors">Repositorio</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Ficha #{bien.n}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Columna principal ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Banner verde oscuro */}
              <Card className="overflow-hidden border-border">
                <div className="bg-gradient-to-br from-dk-base to-dk-surface p-6">
                  {/* Tags zona / área / subárea */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getZonaBadge(bien.zona)}`}>
                      {bien.zona}
                    </span>
                    {area && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-dk-muted">
                        {area}
                      </span>
                    )}
                    {subarea && (
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-dk-muted">
                        {subarea}
                      </span>
                    )}
                    <span className="ml-auto font-mono text-sm text-dk-muted bg-black/20 px-2 py-1 rounded">
                      #{bien.n}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-dk-text leading-tight mb-2">
                    {bien.nombre}
                  </h1>
                  {(bien.marca || bien.modelo) && (
                    <p className="text-dk-muted text-sm">
                      {bien.marca}{bien.modelo && ` · ${bien.modelo}`}
                    </p>
                  )}
                  {bien.cantidad && (
                    <p className="text-dk-muted text-sm mt-1">
                      # Cantidad: {bien.cantidad}
                    </p>
                  )}
                </div>
              </Card>

              {/* Frame de video */}
              <VideoFrame title={bien.nombre} />

              {/* Botones PDF */}
              <PdfButtons onDownload={handleDownload} />

              {/* Info cards — Descripción / Uso Pedagógico */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" /> Descripción
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {bien.descripcion || <span className="italic opacity-50">Sin descripción disponible.</span>}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" /> Uso Pedagógico
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {bien.usoPedagogico || <span className="italic opacity-50">Sin información disponible.</span>}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Navegación anterior / siguiente */}
              <div className="flex items-center justify-between pt-2">
                {prevBien ? (
                  <Button variant="outline" className="gap-2"
                    onClick={() => navigate(`/taller/${slug}/bien/${prevBien.n}`)}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>
                ) : <div />}
                <Link to={`/taller/${slug}/repositorio`}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Ver todos los equipos
                  </Button>
                </Link>
                {nextBien ? (
                  <Button variant="outline" className="gap-2"
                    onClick={() => navigate(`/taller/${slug}/bien/${nextBien.n}`)}>
                    <span className="hidden sm:inline">Siguiente</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : <div />}
              </div>
            </div>

            {/* ── Sidebar ficha técnica ── */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" /> Especificaciones
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SpecRow icon={Hash}    label="N° Bien"   value={`#${bien.n}`} />
                  <SpecRow icon={Package} label="Cantidad"  value={`${bien.cantidad} und.`} />
                  {bien.marca  && <SpecRow icon={Tag}    label="Marca"  value={bien.marca} />}
                  {bien.modelo && <SpecRow icon={Layers} label="Modelo" value={bien.modelo} />}
                  <Separator />
                  <SpecRow icon={MapPin}  label="Zona"      value={bien.zona} />
                  {area    && <SpecRow icon={Layers}   label="Área"      value={area} />}
                  {subarea && <SpecRow icon={Settings} label="Sub Área"  value={subarea} />}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-primary" /> Contexto
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Taller</span>
                    <Badge variant="secondary" className="font-semibold">T{taller.numero}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Programa</span>
                    <span className="text-foreground text-right text-xs max-w-[140px] truncate" title={taller.nombre}>
                      {taller.nombreCorto}
                    </span>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">
                    Este bien forma parte del inventario de {taller.nombre}.
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </>
  );
};

function SpecRow({
  icon: Icon, label, value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground flex items-center gap-2">
        <Icon className="h-3.5 w-3.5" />{label}
      </span>
      <span className="text-foreground font-medium text-right max-w-[160px] truncate" title={value}>
        {value}
      </span>
    </div>
  );
}

export default BienDetalle;
