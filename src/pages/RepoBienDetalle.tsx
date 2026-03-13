import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller } from "@/data/bienesData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  ArrowLeft, ArrowRight, ChevronLeft, Package, BookOpen,
  Tag, MapPin, Hash, Layers, Settings, GraduationCap,
  FileText, Wrench, PlayCircle, Download,
} from "lucide-react";

// ── Colores zona ───────────────────────────────────────────────────────────
const zonaBadgeColors: Record<string, string> = {
  "ZONA DE INVESTIGACIÓN, GESTIÓN Y DISEÑO": "bg-g-light text-g-deep",
  "ZONA DE INNOVACIÓN":                       "bg-tag-vid-bg text-tag-vid-text",
  "DEPÓSITO / ALMACÉN / SEGURIDAD":           "bg-tag-pdf-bg text-tag-pdf-text",
};

// ── Componente VideoFrame ──────────────────────────────────────────────────
function VideoFrame({ nombreBien }: { nombreBien: string }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <PlayCircle className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Video de Operatividad y Mantenimiento</span>
      </div>
      {/* Frame placeholder — reemplazar src cuando tengas el enlace */}
      <div className="relative bg-gradient-to-br from-dk-base to-dk-surface aspect-video flex flex-col items-center justify-center gap-3">
        <div className="h-16 w-16 rounded-full bg-white/10 flex items-center justify-center">
          <PlayCircle className="h-8 w-8 text-white/60" />
        </div>
        <p className="text-white/50 text-sm font-medium text-center px-6">{nombreBien}</p>
        <p className="text-white/30 text-xs">Video disponible próximamente</p>
        {/* Cuando tengas el enlace, reemplaza este div por:
            <iframe
              src="TU_URL_DE_VIDEO"
              className="w-full h-full absolute inset-0"
              allow="autoplay; fullscreen"
              frameBorder="0"
            />
        */}
      </div>
    </div>
  );
}

// ── Botones PDF ────────────────────────────────────────────────────────────
function PdfButtons() {
  const handleDownload = (tipo: string) => {
    // Aquí conectarás la URL real del PDF
    alert(`PDF "${tipo}" disponible próximamente.`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <button
        onClick={() => handleDownload("Manual de Operatividad")}
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 hover:border-primary/60 transition-all group"
      >
        <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--tag-pdf-bg))" }}>
          <FileText className="h-5 w-5" style={{ color: "hsl(var(--tag-pdf-text))" }} />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Manual de Operatividad
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Download className="h-3 w-3" /> Descargar PDF
          </p>
        </div>
      </button>

      <button
        onClick={() => handleDownload("Manual de Mantenimiento")}
        className="flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 border-border hover:border-primary/40 bg-card hover:bg-sidebar-accent transition-all group"
      >
        <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--tag-video-bg))" }}>
          <Wrench className="h-5 w-5" style={{ color: "hsl(var(--tag-video-text))" }} />
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            Manual de Mantenimiento
          </p>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
            <Download className="h-3 w-3" /> Descargar PDF
          </p>
        </div>
      </button>
    </div>
  );
}

// ── Página principal ───────────────────────────────────────────────────────
const RepoBienDetalle = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();

  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);

  const { bien, prevBien, nextBien, currentIndex } = useMemo(() => {
    const idx = bienes.findIndex((b) => b.n === Number(id));
    return {
      bien:          bienes[idx]     || null,
      prevBien:      bienes[idx - 1] || null,
      nextBien:      bienes[idx + 1] || null,
      currentIndex:  idx + 1,
    };
  }, [bienes, id]);

  if (!taller || !bien) {
    return (
      <>
        <div style={{ background: "#043941", height: 48, display: "flex", alignItems: "center", padding: "0 24px", gap: 12 }}>
          <SidebarTrigger className="text-white/50 hover:text-white" />
          <Link to={`/taller/${slug}/repositorio`} style={{ color: "rgba(255,255,255,0.5)", fontSize: 13, textDecoration: "none" }}>← Repositorio</Link>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-card border border-border p-8 text-center rounded-xl">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Bien no encontrado</h2>
            <Link to={`/taller/${slug}/repositorio`} className="text-sm text-primary font-semibold hover:underline">
              ← Volver al Repositorio
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
      {/* Barra superior — misma línea visual que el catálogo del Repositorio */}
      <div
        style={{
          background: "#043941",
          padding: "0 24px",
          height: 48,
          display: "flex",
          alignItems: "center",
          gap: 12,
          position: "sticky",
          top: 0,
          zIndex: 30,
          fontFamily: "'Manrope', sans-serif",
        }}
      >
        <SidebarTrigger className="text-white/50 hover:text-white" />

        <Link
          to={`/taller/${slug}/repositorio`}
          style={{
            background: "none",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: 13,
            fontFamily: "'Manrope', sans-serif",
            display: "flex",
            alignItems: "center",
            gap: 4,
            textDecoration: "none",
          }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Repositorio</span>
        </Link>

        <span style={{ width: 1, height: 20, background: "rgba(255,255,255,0.12)" }} />

        <span style={{ fontSize: 13, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const, flex: 1 }}>
          {bien.nombre}
        </span>

        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>
          {currentIndex} / {bienes.length}
        </span>
      </div>

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
            <span className="text-foreground font-medium truncate max-w-[200px]">{bien.nombre}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">

            {/* ── Columna principal ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Banner oscuro con nombre y tags */}
              <div className="bg-gradient-to-br from-dk-base to-dk-surface p-6 rounded-2xl">
                {/* Tags superiores */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-[10px] font-mono bg-white/10 text-white/60 px-2 py-1 rounded">
                    EPT-{String(bien.n).padStart(3, "0")}
                  </span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${zonaBadgeColors[bien.zona] || "bg-muted text-muted-foreground"}`}>
                    {bien.zona}
                  </span>
                  {area && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/70">
                      {area}
                    </span>
                  )}
                  {subarea && (
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-white/60">
                      {subarea}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-dk-text leading-tight mb-2">
                  {bien.nombre}
                </h1>
                <div className="flex flex-wrap gap-3 text-dk-muted text-sm">
                  {bien.marca  && <span>· {bien.marca}</span>}
                  {bien.modelo && <span>· {bien.modelo}</span>}
                  <span>· Cantidad: {bien.cantidad}</span>
                  <span>· Ítem #{bien.n}</span>
                </div>
              </div>

              {/* Frame de video */}
              <VideoFrame nombreBien={bien.nombre} />

              {/* Botones PDF */}
              <PdfButtons />

              {/* Info cards 2x2 */}
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Descripción */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4 text-primary" /> Descripción
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bien.descripcion || <span className="italic opacity-50">Sin descripción disponible.</span>}
                  </p>
                </div>

                {/* Uso pedagógico */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <GraduationCap className="h-4 w-4 text-primary" /> Uso Pedagógico
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {bien.usoPedagogico || <span className="italic opacity-50">Sin información disponible.</span>}
                  </p>
                </div>

                {/* Mantenimiento */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Wrench className="h-4 w-4 text-amber-500" /> Mantenimiento
                  </h3>
                  <p className="text-sm text-muted-foreground italic opacity-60">
                    Información de mantenimiento disponible próximamente.
                  </p>
                </div>

                {/* Especificaciones */}
                <div className="bg-card border border-border rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-primary" /> Especificaciones
                  </h3>
                  <div className="space-y-2">
                    {[
                      { label: "Marca",    value: bien.marca    },
                      { label: "Modelo",   value: bien.modelo   },
                      { label: "Cantidad", value: bien.cantidad ? `${bien.cantidad} und.` : null },
                      { label: "Zona",     value: bien.zona     },
                      { label: "Área",     value: area || null  },
                    ].filter(r => r.value).map(row => (
                      <div key={row.label} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{row.label}</span>
                        <span className="text-foreground font-medium text-right max-w-[180px] truncate">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navegación prev / next */}
              <div className="flex items-center justify-between pt-2">
                {prevBien ? (
                  <Button variant="outline" className="gap-2" onClick={() => navigate(`/taller/${slug}/repositorio/bien/${prevBien.n}`)}>
                    <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Anterior</span>
                  </Button>
                ) : <div />}
                <Link to={`/taller/${slug}/repositorio`}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    Ver todos los bienes
                  </Button>
                </Link>
                {nextBien ? (
                  <Button variant="outline" className="gap-2" onClick={() => navigate(`/taller/${slug}/repositorio/bien/${nextBien.n}`)}>
                    <span className="hidden sm:inline">Siguiente</span><ArrowRight className="h-4 w-4" />
                  </Button>
                ) : <div />}
              </div>
            </div>

            {/* ── Sidebar derecho ── */}
            <div className="space-y-4">

              {/* Ficha técnica */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" /> Ficha Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SpecRow icon={Hash}    label="N° Bien"   value={`#${bien.n}`} />
                  <SpecRow icon={Package} label="Cantidad"  value={`${bien.cantidad} unidad(es)`} />
                  <SpecRow icon={MapPin}  label="Zona"      value={bien.zona} />
                  {area    && <SpecRow icon={Layers} label="Área"     value={area} />}
                  {subarea && <SpecRow icon={Layers} label="Sub Área" value={subarea} />}
                  {bien.marca  && <SpecRow icon={Tag}    label="Marca"  value={bien.marca} />}
                  {bien.modelo && <SpecRow icon={Layers} label="Modelo" value={bien.modelo} />}
                </CardContent>
              </Card>

              {/* Contexto */}
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
                    Este bien forma parte del inventario del {taller.nombre}.
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

function SpecRow({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between text-sm gap-2">
      <span className="text-muted-foreground flex items-center gap-2 shrink-0">
        <Icon className="h-3.5 w-3.5" />{label}
      </span>
      <span className="text-foreground font-medium text-right break-words max-w-[160px]">{value}</span>
    </div>
  );
}

export default RepoBienDetalle;
