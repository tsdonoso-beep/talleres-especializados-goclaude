import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, type Bien } from "@/data/bienesData";
import { ArrowLeft, FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";

interface DocPlaceholder {
  id: string;
  bienNombre: string;
  bienCodigo: string;
  tipo: "Manual de uso" | "Manual de mantenimiento";
  zona: string;
}

const Repositorio = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);

  const [zonaFilter, setZonaFilter] = useState<string>("Todos");
  const [tipoFilter, setTipoFilter] = useState<string>("Todos");

  const zonas = useMemo(() => {
    const set = new Set(bienes.map(b => b.zona));
    return ["Todos", ...Array.from(set)];
  }, [bienes]);

  const docs: DocPlaceholder[] = useMemo(() => {
    return bienes.flatMap((bien) => [
      {
        id: `${bien.n}-uso`,
        bienNombre: bien.nombre,
        bienCodigo: `EPT-${String(bien.n).padStart(3, "0")}`,
        tipo: "Manual de uso" as const,
        zona: bien.zona,
      },
      {
        id: `${bien.n}-mant`,
        bienNombre: bien.nombre,
        bienCodigo: `EPT-${String(bien.n).padStart(3, "0")}`,
        tipo: "Manual de mantenimiento" as const,
        zona: bien.zona,
      },
    ]);
  }, [bienes]);

  const filtered = docs.filter(d => {
    if (zonaFilter !== "Todos" && d.zona !== zonaFilter) return false;
    if (tipoFilter !== "Todos" && d.tipo !== tipoFilter) return false;
    return true;
  });

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Taller no encontrado.</p>
          <button onClick={() => navigate("/")} className="text-primary text-sm mt-2">← Volver</button>
        </div>
      </>
    );
  }

  const handleDownload = () => {
    toast({ title: "📄 Descarga disponible próximamente", description: "Los PDFs reales se conectarán después." });
  };

  const tipoOptions = ["Todos", "Manual de uso", "Manual de mantenimiento"];

  return (
    <>
      <PageHeader>
        <button onClick={() => navigate(`/taller/${slug}`)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">Repositorio de Productos</span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="hero-gradient p-8" style={{ borderRadius: "var(--r-xl)" }}>
            <h1 className="text-2xl font-extrabold mb-1" style={{ color: "hsl(var(--dk-text))" }}>
              📥 Repositorio de Productos
            </h1>
            <p className="text-sm" style={{ color: "hsl(var(--dk-muted))" }}>
              {taller.nombre} — Manuales y documentación oficial descargable
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Filters sidebar */}
            <div className="w-full md:w-56 shrink-0 space-y-4">
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Filtrar por zona</p>
                {zonas.map(z => (
                  <label key={z} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                    <input type="radio" name="zona" checked={zonaFilter === z} onChange={() => setZonaFilter(z)} className="accent-primary" />
                    <span className={zonaFilter === z ? "text-foreground font-medium" : "text-muted-foreground"}>{z}</span>
                  </label>
                ))}
              </div>
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Filtrar por tipo</p>
                {tipoOptions.map(t => (
                  <label key={t} className="flex items-center gap-2 py-1 text-sm cursor-pointer">
                    <input type="radio" name="tipo" checked={tipoFilter === t} onChange={() => setTipoFilter(t)} className="accent-primary" />
                    <span className={tipoFilter === t ? "text-foreground font-medium" : "text-muted-foreground"}>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-3">{filtered.length} documentos</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filtered.map((doc) => (
                  <div key={doc.id} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                    <div className="h-16 w-16 rounded-lg flex items-center justify-center mx-auto" style={{ background: "hsl(var(--tag-pdf-bg))" }}>
                      <FileText className="h-8 w-8" style={{ color: "hsl(var(--tag-pdf-text))" }} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-mono text-muted-foreground">{doc.bienCodigo}</p>
                      <h4 className="font-semibold text-sm text-foreground mt-0.5 line-clamp-2">{doc.tipo} — {doc.bienNombre}</h4>
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                        {doc.zona}
                      </span>
                    </div>
                    <button
                      onClick={handleDownload}
                      className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border hover:border-primary/50 transition-colors"
                    >
                      <Download className="h-3.5 w-3.5" /> Descargar PDF
                    </button>
                  </div>
                ))}
              </div>
              {filtered.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground">No se encontraron documentos con esos filtros</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Repositorio;
