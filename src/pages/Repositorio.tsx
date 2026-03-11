import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, getZonasUnicasByTaller, type Bien } from "@/data/bienesData";
import {
  ArrowLeft, FileText, Download, Search, BookOpen,
  Wrench, ShieldCheck, Package, ChevronRight, ChevronDown,
  FolderOpen, Folder, LayoutGrid, List, Filter,
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";

// ── Tipos ──────────────────────────────────────────────────────────────────
interface Grupo {
  id: string;
  numero: number;
  nombre: string;
  zona: string;
  bienes: Bien[];
}

interface DocItem {
  id: string;
  bien: Bien;
  tipo: "Manual de Uso" | "Manual de Mantenimiento" | "Manual Pedagógico";
  codigo: string;
}

const TIPOS_DOC = ["Manual de Uso", "Manual de Mantenimiento", "Manual Pedagógico"] as const;

const ZONA_ICONS: Record<string, React.ReactNode> = {
  investigacion: <BookOpen className="h-4 w-4" />,
  innovacion: <Wrench className="h-4 w-4" />,
  seguridad: <ShieldCheck className="h-4 w-4" />,
};

const ZONA_LABELS: Record<string, string> = {
  investigacion: "Zona Investigación",
  innovacion: "Zona Innovación",
  seguridad: "Seguridad",
};

// ── Helpers ────────────────────────────────────────────────────────────────
function buildGrupos(bienes: Bien[]): Grupo[] {
  const zonaMap: Record<string, Bien[]> = {};
  bienes.forEach((b) => {
    const key = b.zona;
    if (!zonaMap[key]) zonaMap[key] = [];
    zonaMap[key].push(b);
  });
  return Object.entries(zonaMap).map(([zona, items], idx) => ({
    id: zona,
    numero: idx + 1,
    nombre: ZONA_LABELS[zona] ?? zona,
    zona,
    bienes: items,
  }));
}

function buildDocs(bienes: Bien[]): DocItem[] {
  return bienes.flatMap((bien) =>
    TIPOS_DOC.map((tipo) => ({
      id: `${bien.n}-${tipo}`,
      bien,
      tipo,
      codigo: `EPT-${String(bien.n).padStart(3, "0")}`,
    }))
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function DocCard({ doc, onDownload }: { doc: DocItem; onDownload: () => void }) {
  const tipoColor: Record<string, string> = {
    "Manual de Uso":          "hsl(var(--tag-pdf-bg)) / hsl(var(--tag-pdf-text))",
    "Manual de Mantenimiento":"hsl(var(--tag-video-bg)) / hsl(var(--tag-video-text))",
    "Manual Pedagógico":      "hsl(var(--tag-quiz-bg)) / hsl(var(--tag-quiz-text))",
  };
  const bgVar = doc.tipo === "Manual de Uso"
    ? "var(--tag-pdf-bg)"
    : doc.tipo === "Manual de Mantenimiento"
    ? "var(--tag-video-bg)"
    : "var(--tag-quiz-bg)";
  const textVar = doc.tipo === "Manual de Uso"
    ? "var(--tag-pdf-text)"
    : doc.tipo === "Manual de Mantenimiento"
    ? "var(--tag-video-text)"
    : "var(--tag-quiz-text)";

  return (
    <div className="group bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* Icono PDF */}
      <div
        className="h-14 w-14 rounded-lg flex items-center justify-center mx-auto"
        style={{ background: `hsl(${bgVar})` }}
      >
        <FileText className="h-7 w-7" style={{ color: `hsl(${textVar})` }} />
      </div>

      {/* Info */}
      <div className="text-center space-y-1">
        <p className="text-[10px] font-mono text-muted-foreground">{doc.codigo}</p>
        <h4 className="font-semibold text-sm text-foreground line-clamp-2 leading-snug">
          {doc.bien.nombre}
        </h4>
        <span
          className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ background: `hsl(${bgVar})`, color: `hsl(${textVar})` }}
        >
          {doc.tipo}
        </span>
        {doc.bien.marca && (
          <p className="text-[10px] text-muted-foreground">{doc.bien.marca}</p>
        )}
      </div>

      {/* Botón */}
      <button
        onClick={onDownload}
        className="mt-auto inline-flex items-center justify-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-border hover:border-primary/60 hover:bg-primary/5 transition-colors"
      >
        <Download className="h-3.5 w-3.5" />
        Descargar PDF
      </button>
    </div>
  );
}

function GrupoPanel({
  grupo,
  isOpen,
  onToggle,
  searchQuery,
  tipoFilter,
  onDownload,
}: {
  grupo: Grupo;
  isOpen: boolean;
  onToggle: () => void;
  searchQuery: string;
  tipoFilter: string;
  onDownload: () => void;
}) {
  const docs = useMemo(() => buildDocs(grupo.bienes), [grupo.bienes]);

  const filtered = docs.filter((d) => {
    const matchSearch =
      !searchQuery ||
      d.bien.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.bien.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.codigo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTipo = tipoFilter === "Todos" || d.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* Header del grupo */}
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-5 py-4 bg-card hover:bg-sidebar-accent transition-colors text-left"
      >
        <div
          className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "hsl(var(--grama-green) / 0.15)" }}
        >
          <span className="text-xs font-bold" style={{ color: "hsl(var(--grama-green))" }}>
            #{grupo.numero}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground truncate">{grupo.nombre}</p>
          <p className="text-[11px] text-muted-foreground">
            {grupo.bienes.length} equipos · {grupo.bienes.length * 3} documentos
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {isOpen ? (
            <FolderOpen className="h-4 w-4 text-primary" />
          ) : (
            <Folder className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Contenido expandible */}
      {isOpen && (
        <div className="border-t border-border bg-background/50 p-5">
          {filtered.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              No hay documentos con esos filtros.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filtered.map((doc) => (
                <DocCard key={doc.id} doc={doc} onDownload={onDownload} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Página principal ────────────────────────────────────────────────────────
const Repositorio = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);
  const grupos = useMemo(() => buildGrupos(bienes), [bienes]);

  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");
  const [openGrupos, setOpenGrupos] = useState<Record<string, boolean>>({
    [grupos[0]?.id ?? ""]: true,
  });

  const toggleGrupo = (id: string) =>
    setOpenGrupos((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    grupos.forEach((g) => (all[g.id] = true));
    setOpenGrupos(all);
  };

  const collapseAll = () => setOpenGrupos({});

  const handleDownload = () => {
    toast({
      title: "📄 Descarga disponible próximamente",
      description: "Los PDFs reales se conectarán cuando subas los archivos.",
    });
  };

  const totalDocs = bienes.length * 3;
  const totalFiltrados = grupos.reduce((acc, g) => {
    const docs = buildDocs(g.bienes).filter((d) => {
      const matchSearch =
        !searchQuery ||
        d.bien.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.bien.marca?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.codigo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchTipo = tipoFilter === "Todos" || d.tipo === tipoFilter;
      return matchSearch && matchTipo;
    });
    return acc + docs.length;
  }, 0);

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Taller no encontrado.</p>
          <button onClick={() => navigate("/")} className="text-primary text-sm mt-2">
            ← Volver
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <button
          onClick={() => navigate(`/taller/${slug}`)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">
          Repositorio de Productos
        </span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

          {/* ── Banner ── */}
          <div className="hero-gradient p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-5 w-5" style={{ color: "hsl(var(--dk-text))" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "hsl(var(--dk-muted))" }}>
                  v1.0 · Base de documentación técnica
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold" style={{ color: "hsl(var(--dk-text))" }}>
                Repositorio Técnico — {taller.nombre.toUpperCase()}
              </h1>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--dk-muted))" }}>
                Manuales de uso, mantenimiento y pedagogía por equipo
              </p>
            </div>
            {/* Estadísticas */}
            <div className="flex gap-4 shrink-0">
              {[
                { label: "Equipos", value: bienes.length },
                { label: "Documentos", value: totalDocs },
                { label: "Grupos", value: grupos.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: "hsl(var(--dk-text))" }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "hsl(var(--dk-muted))" }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Layout principal ── */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Panel izquierdo: Recursos rápidos + grupos ── */}
            <div className="w-full lg:w-64 shrink-0 space-y-4">

              {/* Recurso rápido */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
                  Recursos Rápidos
                </p>
                <p className="text-[10px] text-muted-foreground mb-3">(Descargas PDF)</p>
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left"
                >
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "hsl(var(--tag-pdf-bg))" }}>
                    <FileText className="h-5 w-5" style={{ color: "hsl(var(--tag-pdf-text))" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Manual General</p>
                    <p className="text-[10px] text-muted-foreground">PDF · Catálogo completo</p>
                  </div>
                </button>
              </div>

              {/* Lista de grupos */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">
                  {grupos.length} Grupos
                </p>
                <div className="space-y-1.5">
                  {grupos.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setOpenGrupos((prev) => ({ ...prev, [g.id]: true }));
                        setTimeout(() => {
                          document.getElementById(`grupo-${g.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                        }, 50);
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-sm transition-colors ${
                        openGrupos[g.id]
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      }`}
                    >
                      <span className="text-xs font-mono w-5 shrink-0">#{g.numero}</span>
                      <span className="truncate text-xs">{g.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtro tipo */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Tipo de Manual
                </p>
                {["Todos", ...TIPOS_DOC].map((t) => (
                  <label key={t} className="flex items-center gap-2 py-1 text-xs cursor-pointer">
                    <input
                      type="radio"
                      name="tipo"
                      checked={tipoFilter === t}
                      onChange={() => setTipoFilter(t)}
                      className="accent-primary"
                    />
                    <span className={tipoFilter === t ? "text-foreground font-medium" : "text-muted-foreground"}>
                      {t}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* ── Panel derecho: explorador de documentos ── */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Barra superior */}
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                {/* Buscador */}
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, marca, código..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                  />
                </div>
                {/* Controles expand/collapse */}
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={expandAll}
                    className="text-xs px-3 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                  >
                    Expandir todo
                  </button>
                  <button
                    onClick={collapseAll}
                    className="text-xs px-3 py-2 rounded-lg border border-border hover:border-border/80 transition-colors"
                  >
                    Colapsar
                  </button>
                </div>
              </div>

              {/* Contador */}
              <p className="text-xs text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{totalFiltrados}</span> de {totalDocs} documentos
              </p>

              {/* Grupos acordeón */}
              <div className="space-y-3">
                {grupos.map((grupo) => (
                  <div key={grupo.id} id={`grupo-${grupo.id}`}>
                    <GrupoPanel
                      grupo={grupo}
                      isOpen={!!openGrupos[grupo.id]}
                      onToggle={() => toggleGrupo(grupo.id)}
                      searchQuery={searchQuery}
                      tipoFilter={tipoFilter}
                      onDownload={handleDownload}
                    />
                  </div>
                ))}
              </div>

              {totalFiltrados === 0 && (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-sm">No se encontraron documentos.</p>
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
