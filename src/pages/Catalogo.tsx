import { useParams, useSearchParams, Link } from "react-router-dom";
import { useState, useMemo, memo, useCallback } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, Bien } from "@/data/bienesData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Search, Package, BookOpen, X
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

const ITEMS_PER_PAGE = 30;

// Badge colors por tipo
const tipoBadgeColors: Record<string, string> = {
  EQUIPOS:     "bg-g-light text-g-deep",
  MOBILIARIO:  "bg-tag-vid-bg text-tag-vid-text",
  PEDAGOGICO:  "bg-tag-pdf-bg text-tag-pdf-text",
  "PRODUCCIÓN": "bg-tag-3d-bg text-tag-3d-text",
  HERRAMIENTAS: "bg-accent text-accent-foreground",
  SEGURIDAD:   "bg-destructive/10 text-destructive",
};

const Catalogo = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const tipoFilter = searchParams.get("tipo") || "all";
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);

  // Extraer tipos únicos del JSON dinámicamente
  const tipoFilters = useMemo(() => {
    const tipos = new Set(bienes.map((b) => b.tipo).filter(Boolean));
    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
    return [
      { key: "all", label: "Todos" },
      ...Array.from(tipos).sort().map((t) => ({ key: t, label: capitalize(t) })),
    ];
  }, [bienes]);

  const filtered = useMemo(() => {
    let result = bienes;
    if (tipoFilter !== "all") result = result.filter((b) => b.tipo === tipoFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((b) =>
        b.nombre.toLowerCase().includes(q) ||
        b.descripcion.toLowerCase().includes(q) ||
        b.marca?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [bienes, tipoFilter, search]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleTipoChange = useCallback((key: string) => {
    setVisibleCount(ITEMS_PER_PAGE);
    if (key === "all") setSearchParams({});
    else setSearchParams({ tipo: key });
  }, [setSearchParams]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setVisibleCount(ITEMS_PER_PAGE);
  }, []);

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-card border border-border p-8 text-center" style={{ borderRadius: "var(--r-xl)" }}>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Taller no encontrado</h2>
            <Link to="/" className="text-sm text-primary font-semibold hover:underline">← Volver al Hub</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <Link to={`/taller/${slug}`} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">Catálogo — {taller.nombre}</span>
      </PageHeader>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" /> Catálogo de Bienes
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Revisa las {bienes.length} fichas de {taller.nombre}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar por nombre, marca..." value={search} onChange={handleSearchChange} className="pl-10 bg-card" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {tipoFilters.map((f) => (
                <button key={f.key} onClick={() => handleTipoChange(f.key)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors ${tipoFilter === f.key ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:bg-accent"}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground">
            {filtered.length} bienes
            {tipoFilter !== "all" && (
              <button onClick={() => handleTipoChange("all")} className="ml-2 text-primary font-semibold hover:underline inline-flex items-center gap-1">
                <X className="h-3 w-3" /> Limpiar filtro
              </button>
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleItems.map((bien) => (
              <BienCard key={bien.n} bien={bien} slug={slug || ""} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center pt-4">
              <Button variant="outline" onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}>
                Cargar más ({filtered.length - visibleCount} restantes)
              </Button>
            </div>
          )}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
              <p className="text-muted-foreground">No se encontraron bienes con ese criterio</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const BienCard = memo(({ bien, slug }: { bien: Bien; slug: string }) => (
  <Link
    to={`/taller/${slug}/bien/${bien.n}`}
    className="bg-card border border-border p-4 hover:shadow-sm hover:border-primary/20 transition-shadow group text-left w-full block"
    style={{ borderRadius: "var(--r-lg)" }}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">#{bien.n}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tipoBadgeColors[bien.tipo] || "bg-muted text-muted-foreground"}`}>{bien.tipo}</span>
    </div>
    <h3 className="font-semibold text-sm text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">{bien.nombre}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">{bien.descripcion}</p>
    <div className="flex flex-wrap gap-1.5 mb-3">
      {bien.marca && <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-tag-3d-bg text-tag-3d-text">{bien.marca}</span>}
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        <BookOpen className="h-2.5 w-2.5" /> x{bien.cantidad}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{bien.modelo ? `Mod: ${bien.modelo}` : ""}</span>
      <span className="text-xs font-semibold text-primary group-hover:underline">Ver ficha →</span>
    </div>
  </Link>
));
BienCard.displayName = "BienCard";

export default Catalogo;
