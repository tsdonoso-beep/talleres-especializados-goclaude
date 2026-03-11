import { useParams, Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller } from "@/data/bienesData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft, ArrowRight, ChevronLeft, Package, BookOpen, Tag,
  MapPin, Hash, Layers, Settings, GraduationCap
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

const zonaBadgeColors: Record<string, string> = {
  "Zona Investigación": "bg-g-light text-g-deep",
  "Zona Innovación": "bg-tag-vid-bg text-tag-vid-text",
  "Seguridad": "bg-tag-pdf-bg text-tag-pdf-text",
};

const BienDetalle = () => {
  const { slug, id } = useParams<{ slug: string; id: string }>();
  const navigate = useNavigate();

  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);

  const { bien, prevBien, nextBien, currentIndex } = useMemo(() => {
    const idx = bienes.findIndex((b) => b.n === Number(id));
    return {
      bien: bienes[idx] || null,
      prevBien: bienes[idx - 1] || null,
      nextBien: bienes[idx + 1] || null,
      currentIndex: idx + 1,
    };
  }, [bienes, id]);

  if (!taller || !bien) {
    return (
      <>
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-card border border-border p-8 text-center rounded-xl">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Bien no encontrado</h2>
            <Link to={`/taller/${slug}/catalogo`} className="text-sm text-primary font-semibold hover:underline">← Volver al catálogo</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <Link to={`/taller/${slug}/catalogo`} className="text-muted-foreground hover:text-foreground transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <span className="text-xs text-muted-foreground font-medium">{taller.nombreCorto}</span>
        <Separator orientation="vertical" className="h-5" />
        <span className="text-sm font-semibold text-foreground truncate">Ficha #{bien.n}</span>
        <span className="ml-auto text-xs text-muted-foreground font-mono">{currentIndex} / {bienes.length}</span>
      </PageHeader>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Hub</Link>
            <span>/</span>
            <Link to={`/taller/${slug}`} className="hover:text-foreground transition-colors">{taller.nombreCorto}</Link>
            <span>/</span>
            <Link to={`/taller/${slug}/catalogo`} className="hover:text-foreground transition-colors">Catálogo</Link>
            <span>/</span>
            <span className="text-foreground font-medium">Ficha #{bien.n}</span>
          </nav>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="overflow-hidden border-border">
                <div className="bg-gradient-to-br from-dk-base to-dk-surface p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${zonaBadgeColors[bien.zona] || "bg-muted text-muted-foreground"}`}>{bien.zona}</span>
                    <span className="font-mono text-sm text-muted-foreground bg-muted/20 px-2 py-1 rounded">#{bien.n}</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-dk-text leading-tight mb-2">{bien.nombre}</h1>
                  {(bien.marca || bien.modelo) && (
                    <p className="text-dk-muted text-sm">{bien.marca}{bien.modelo && ` — ${bien.modelo}`}</p>
                  )}
                </div>
                <CardContent className="p-6 space-y-5">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                      <Layers className="h-4 w-4 text-primary" /> Descripción
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">{bien.descripcion}</p>
                  </div>
                  {bien.usoPedagogico && (
                    <div className="bg-g-light/30 border border-primary/20 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                        <GraduationCap className="h-4 w-4 text-primary" /> Uso Pedagógico
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">{bien.usoPedagogico}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                {prevBien ? (
                  <Button variant="outline" className="gap-2 transition-colors" onClick={() => navigate(`/taller/${slug}/bien/${prevBien.n}`)}>
                    <ArrowLeft className="h-4 w-4" /><span className="hidden sm:inline">Anterior</span>
                  </Button>
                ) : <div />}
                <Link to={`/taller/${slug}/catalogo`}>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Ver todos los bienes</Button>
                </Link>
                {nextBien ? (
                  <Button variant="outline" className="gap-2 transition-colors" onClick={() => navigate(`/taller/${slug}/bien/${nextBien.n}`)}>
                    <span className="hidden sm:inline">Siguiente</span><ArrowRight className="h-4 w-4" />
                  </Button>
                ) : <div />}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Settings className="h-4 w-4 text-primary" /> Ficha Técnica
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SpecRow icon={Hash} label="N° Bien" value={`#${bien.n}`} />
                  <SpecRow icon={Package} label="Cantidad" value={`${bien.cantidad} unidad(es)`} />
                  <SpecRow icon={MapPin} label="Zona" value={bien.zona} />
                  {bien.marca && <SpecRow icon={Tag} label="Marca" value={bien.marca} />}
                  {bien.modelo && <SpecRow icon={Layers} label="Modelo" value={bien.modelo} />}
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
                    <span className="text-foreground text-right text-xs max-w-[140px] truncate" title={taller.nombre}>{taller.nombreCorto}</span>
                  </div>
                  <Separator />
                  <div className="text-xs text-muted-foreground">Este bien forma parte del inventario del {taller.nombre}.</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

function SpecRow({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground flex items-center gap-2"><Icon className="h-3.5 w-3.5" />{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

export default BienDetalle;
