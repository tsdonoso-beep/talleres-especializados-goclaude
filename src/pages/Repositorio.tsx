import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo, memo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, type Bien } from "@/data/bienesData";
import {
  ArrowLeft, Search, Package, BookOpen, MapPin,
  ChevronRight, ChevronDown, FolderOpen, Folder, Layers, Grid3x3,
  FileText, Download, Wrench, GraduationCap, Users,
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";

// ── Tipos de jerarquía ──────────────────────────────────────────────────────
interface SubArea { nombre: string; bienes: Bien[] }
interface Area    { nombre: string; subareas: SubArea[]; bienesDirectos: Bien[] }
interface Zona    { nombre: string; areas: Area[];       bienesDirectos: Bien[] }

// ── Tipos para Manuales por Grupos ──────────────────────────────────────────
interface ManualGrupo {
  codigo: string;
  descripcion: string;
  categoria: "USO" | "MANTTO" | "PEDAG";
  url?: string;
}
interface GrupoManuales {
  nombre: string;
  manuales: ManualGrupo[];
}

// ── Colores de zona ─────────────────────────────────────────────────────────
const zonaBadgeColors: Record<string, string> = {
  "ZONA DE INVESTIGACIÓN, GESTIÓN Y DISEÑO": "bg-g-light text-g-deep",
  "ZONA DE INNOVACIÓN":                      "bg-tag-vid-bg text-tag-vid-text",
  "DEPÓSITO / ALMACÉN / SEGURIDAD":          "bg-tag-pdf-bg text-tag-pdf-text",
};
function zonaBadge(zona: string): string {
  for (const [key, cls] of Object.entries(zonaBadgeColors)) {
    if (zona.toUpperCase().includes(key.replace("ZONA DE ", "").substring(0, 8))) return cls;
  }
  return "bg-muted text-muted-foreground";
}

const ZONA_COLORS = [
  { border: "hsl(142 70% 45% / 0.4)", badge: "hsl(142 70% 45% / 0.12)", bg: "hsl(142 70% 45% / 0.08)", dot: "hsl(142 70% 40%)" },
  { border: "hsl(200 70% 50% / 0.4)", badge: "hsl(200 70% 50% / 0.12)", bg: "hsl(200 70% 50% / 0.08)", dot: "hsl(200 70% 40%)" },
  { border: "hsl(35 80% 50% / 0.4)",  badge: "hsl(35 80% 50% / 0.12)",  bg: "hsl(35 80% 50% / 0.08)",  dot: "hsl(35 75% 40%)"  },
  { border: "hsl(270 60% 55% / 0.4)", badge: "hsl(270 60% 55% / 0.12)", bg: "hsl(270 60% 55% / 0.08)", dot: "hsl(270 60% 45%)" },
];

// Estilos por categoría de manual
const CAT_STYLES = {
  USO:    { bg: "bg-tag-pdf-bg",   text: "text-tag-pdf-text",   icon: FileText,       label: "Manual de Uso"         },
  MANTTO: { bg: "bg-tag-vid-bg",   text: "text-tag-vid-text",   icon: Wrench,         label: "Mantenimiento"         },
  PEDAG:  { bg: "bg-tag-quiz-bg",  text: "text-tag-quiz-text",  icon: GraduationCap,  label: "Pedagógico"            },
};

// ── Helpers jerarquía ────────────────────────────────────────────────────────
function buildJerarquia(bienes: Bien[]): Zona[] {
  const norm = (s: string) => (s || "").trim();
  const zonaMap = new Map<string, Map<string, Map<string, Bien[]>>>();
  bienes.forEach((b) => {
    const zona    = norm(b.zona)              || "Sin Zona";
    const area    = norm((b as any).area)    || "";
    const subarea = norm((b as any).subarea) || "";
    if (!zonaMap.has(zona)) zonaMap.set(zona, new Map());
    const aM = zonaMap.get(zona)!;
    if (!aM.has(area)) aM.set(area, new Map());
    const sM = aM.get(area)!;
    if (!sM.has(subarea)) sM.set(subarea, []);
    sM.get(subarea)!.push(b);
  });
  return Array.from(zonaMap.entries()).map(([zonaN, aM]) => {
    let bDZ: Bien[] = [];
    const areas: Area[] = [];
    Array.from(aM.entries()).forEach(([areaN, sM]) => {
      let bDA: Bien[] = [];
      const subareas: SubArea[] = [];
      Array.from(sM.entries()).forEach(([subN, bArr]) => {
        if (subN === "") bDA = bDA.concat(bArr);
        else subareas.push({ nombre: subN, bienes: bArr });
      });
      if (areaN === "") bDZ = bDZ.concat(bDA);
      else areas.push({ nombre: areaN, subareas, bienesDirectos: bDA });
    });
    return { nombre: zonaN, areas, bienesDirectos: bDZ };
  });
}

function countBienes(zona: Zona): number {
  let t = zona.bienesDirectos.length;
  zona.areas.forEach((a) => { t += a.bienesDirectos.length; a.subareas.forEach((s) => (t += s.bienes.length)); });
  return t;
}

// ── BienCard ─────────────────────────────────────────────────────────────────
const BienCard = memo(({ bien, slug }: { bien: Bien; slug: string }) => (
  <Link
    to={`/taller/${slug}/bien/${bien.n}`}
    className="bg-card border border-border p-4 hover:shadow-sm hover:border-primary/20 transition-shadow group text-left w-full block"
    style={{ borderRadius: "var(--r-lg)" }}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">#{bien.n}</span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full truncate max-w-[130px] ${zonaBadge(bien.zona)}`}>{bien.zona}</span>
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

// ── BienesGrid ───────────────────────────────────────────────────────────────
function BienesGrid({ bienes, slug, searchQuery }: { bienes: Bien[]; slug: string; searchQuery: string }) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return bienes;
    const q = searchQuery.toLowerCase();
    return bienes.filter(b => b.nombre.toLowerCase().includes(q) || b.descripcion.toLowerCase().includes(q) || (b.marca || "").toLowerCase().includes(q));
  }, [bienes, searchQuery]);
  if (filtered.length === 0) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
      {filtered.map(b => <BienCard key={b.n} bien={b} slug={slug} />)}
    </div>
  );
}

// ── SubÁrea panel ─────────────────────────────────────────────────────────────
function SubAreaPanel({ subarea, slug, searchQuery }: { subarea: SubArea; slug: string; searchQuery: string }) {
  const [open, setOpen] = useState(false);
  const visibleCount = useMemo(() => {
    if (!searchQuery.trim()) return subarea.bienes.length;
    const q = searchQuery.toLowerCase();
    return subarea.bienes.filter(b => b.nombre.toLowerCase().includes(q) || (b.marca || "").toLowerCase().includes(q)).length;
  }, [subarea.bienes, searchQuery]);
  if (visibleCount === 0 && searchQuery) return null;
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-background hover:bg-sidebar-accent/40 transition-colors text-left">
        <Grid3x3 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="flex-1 text-xs font-medium text-foreground truncate">{subarea.nombre}</span>
        <span className="text-[10px] text-muted-foreground shrink-0">{subarea.bienes.length} equipos</span>
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-background/60"><BienesGrid bienes={subarea.bienes} slug={slug} searchQuery={searchQuery} /></div>}
    </div>
  );
}

// ── Área panel ────────────────────────────────────────────────────────────────
function AreaPanel({ area, slug, searchQuery }: { area: Area; slug: string; searchQuery: string }) {
  const [open, setOpen] = useState(true);
  const total = area.bienesDirectos.length + area.subareas.reduce((a, s) => a + s.bienes.length, 0);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-sidebar-accent transition-colors text-left">
        <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 bg-primary/10"><Layers className="h-3.5 w-3.5 text-primary" /></div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{area.nombre}</p>
          <p className="text-[10px] text-muted-foreground">{total} equipos{area.subareas.length > 0 && ` · ${area.subareas.length} sub áreas`}</p>
        </div>
        {open ? <><ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /><FolderOpen className="h-4 w-4 text-primary shrink-0" /></>
              : <><ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" /><Folder className="h-4 w-4 text-muted-foreground shrink-0" /></>}
      </button>
      {open && (
        <div className="border-t border-border bg-background/50 p-4 space-y-2.5">
          {area.subareas.map(sub => <SubAreaPanel key={sub.nombre} subarea={sub} slug={slug} searchQuery={searchQuery} />)}
          {area.bienesDirectos.length > 0 && (
            <div>
              {area.subareas.length > 0 && <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 mt-1">Sin sub área asignada</p>}
              <BienesGrid bienes={area.bienesDirectos} slug={slug} searchQuery={searchQuery} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Zona panel ────────────────────────────────────────────────────────────────
function ZonaPanel({ zona, colorIdx, slug, searchQuery }: { zona: Zona; colorIdx: number; slug: string; searchQuery: string }) {
  const [open, setOpen] = useState(true);
  const color = ZONA_COLORS[colorIdx % ZONA_COLORS.length];
  const total = countBienes(zona);
  return (
    <div className="border-2 rounded-2xl overflow-hidden" style={{ borderColor: color.border }}>
      <button onClick={() => setOpen(p => !p)} className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors" style={{ background: color.bg }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: color.bg, border: `1.5px solid ${color.border}` }}>
          <MapPin className="h-4 w-4" style={{ color: color.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground leading-snug">{zona.nombre}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{total} equipos{zona.areas.length > 0 && ` · ${zona.areas.length} áreas`}</p>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-background">
          {zona.areas.map(area => <AreaPanel key={area.nombre} area={area} slug={slug} searchQuery={searchQuery} />)}
          {zona.bienesDirectos.length > 0 && (
            <div>
              {zona.areas.length > 0 && <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Sin área asignada</p>}
              <BienesGrid bienes={zona.bienesDirectos} slug={slug} searchQuery={searchQuery} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ── TAB 2: Manuales por Grupos ───────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════

function ManualRow({ manual, onDownload }: { manual: ManualGrupo; onDownload: () => void }) {
  const cat = CAT_STYLES[manual.categoria];
  const Icon = cat.icon;
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 hover:bg-sidebar-accent/40 transition-colors">
      <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${cat.bg}`}>
        <Icon className={`h-4 w-4 ${cat.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-foreground leading-snug">{manual.descripcion}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{manual.codigo}</span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${cat.bg} ${cat.text}`}>{manual.categoria}</span>
        </div>
      </div>
      <button
        onClick={onDownload}
        className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-lg border border-border bg-card hover:bg-primary/5 hover:border-primary/40 hover:text-primary transition-all shrink-0"
      >
        <Download className="h-3 w-3" /> PDF
      </button>
    </div>
  );
}

function GrupoAccordion({ grupo, catFilter, searchQ, onDownload }: {
  grupo: GrupoManuales; catFilter: string; searchQ: string; onDownload: () => void;
}) {
  const [open, setOpen] = useState(false);

  const manualesFiltrados = useMemo(() => {
    return grupo.manuales.filter(m => {
      const matchCat = catFilter === "all" || m.categoria === catFilter;
      const matchQ = !searchQ || m.descripcion.toLowerCase().includes(searchQ.toLowerCase()) || m.codigo.toLowerCase().includes(searchQ.toLowerCase());
      return matchCat && matchQ;
    });
  }, [grupo.manuales, catFilter, searchQ]);

  if (manualesFiltrados.length === 0) return null;

  const cats = [...new Set(grupo.manuales.map(m => m.categoria))];

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(p => !p)}
        className="w-full flex items-center gap-3 px-4 py-3.5 bg-card hover:bg-sidebar-accent transition-colors text-left"
      >
        <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 bg-primary/10">
          <Users className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{grupo.nombre}</p>
          <p className="text-[10px] text-muted-foreground">{grupo.manuales.length} manuales</p>
        </div>
        {/* Indicadores de categorías disponibles */}
        <div className="flex gap-1 shrink-0">
          {cats.map(c => {
            const s = CAT_STYLES[c];
            return <span key={c} className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${s.bg} ${s.text}`}>{c}</span>;
          })}
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="border-t border-border bg-background/50">
          {manualesFiltrados.map(m => <ManualRow key={m.codigo} manual={m} onDownload={onDownload} />)}
        </div>
      )}
    </div>
  );
}

// Placeholder de grupos (reemplazar con datos reales del JSON / config)
function getGruposByTaller(slug: string): GrupoManuales[] {
  // TODO: conectar con un archivo gruposManualesData.ts con los datos reales del spreadsheet
  // Estructura de ejemplo — REEMPLAZAR con los datos reales
  return [
    {
      nombre: "Identificar Necesidades y Problemas Utilizando los Equipos",
      manuales: [
        { codigo: "MAT-303", descripcion: "Manual de uso por cada equipo", categoria: "USO" },
        { codigo: "MAT-245", descripcion: "Manual de mantenimiento por cada equipo", categoria: "MANTTO" },
        { codigo: "MAT-375", descripcion: "Manual pedagógico para identificar necesidades y problemas utilizando los equipos", categoria: "PEDAG" },
      ],
    },
    {
      nombre: "Análisis y Diseño de la Propuesta de Valor",
      manuales: [
        { codigo: "MAT-309", descripcion: "Manual de uso por cada equipo de análisis y diseño de la propuesta de valor", categoria: "USO" },
        { codigo: "MAT-255", descripcion: "Manual de mantenimiento por cada equipo de análisis y diseño de la propuesta de valor", categoria: "MANTTO" },
        { codigo: "MAT-370", descripcion: "Manual pedagógico para diseñar la propuesta de valor utilizando los equipos", categoria: "PEDAG" },
      ],
    },
  ];
}

function TabManualesGrupos({ slug, onDownload }: { slug: string; onDownload: () => void }) {
  const [catFilter, setCatFilter] = useState("all");
  const [searchQ, setSearchQ]     = useState("");

  const grupos = useMemo(() => getGruposByTaller(slug), [slug]);

  const cats: { key: string; label: string; color: string }[] = [
    { key: "all",    label: "Todos",           color: "" },
    { key: "USO",    label: "Manual de Uso",   color: "text-tag-pdf-text" },
    { key: "MANTTO", label: "Mantenimiento",   color: "text-tag-vid-text" },
    { key: "PEDAG",  label: "Pedagógico",      color: "text-tag-quiz-text" },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">

      {/* Sidebar filtros */}
      <div className="w-full lg:w-56 shrink-0 space-y-4 lg:sticky lg:top-4">

        {/* Descarga rápida */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Recursos Rápidos</p>
          <button
            onClick={onDownload}
            className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-left group"
          >
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-tag-pdf-bg">
              <FileText className="h-5 w-5 text-tag-pdf-text" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">Manual General</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Download className="h-2.5 w-2.5" /> PDF · Kit completo</p>
            </div>
          </button>
        </div>

        {/* Filtro por categoría */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Categoría</p>
          <div className="space-y-1">
            {cats.map(c => (
              <button
                key={c.key}
                onClick={() => setCatFilter(c.key)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors font-medium ${
                  catFilter === c.key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                }`}
              >
                {c.key !== "all" && (
                  <span className={`h-2 w-2 rounded-full shrink-0 ${
                    c.key === "USO" ? "bg-tag-pdf-text" : c.key === "MANTTO" ? "bg-tag-vid-text" : "bg-tag-quiz-text"
                  }`} />
                )}
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-card border border-border rounded-xl p-4">
          <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-2">Acerca de</p>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Manuales temáticos independientes de los equipos individuales. Disponibles solo como descarga directa PDF.
          </p>
        </div>
      </div>

      {/* Panel principal */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar grupo, descripción, código MAT-..."
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
          />
        </div>

        {/* Grupos */}
        <div className="space-y-3">
          {grupos.map(g => (
            <GrupoAccordion key={g.nombre} grupo={g} catFilter={catFilter} searchQ={searchQ} onDownload={onDownload} />
          ))}
        </div>

        {/* Aviso placeholder */}
        <div className="text-center py-6 border border-dashed border-border rounded-xl">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-30" />
          <p className="text-xs text-muted-foreground">
            Conecta el archivo <code className="bg-muted px-1 rounded text-[10px]">gruposManualesData.ts</code> con los datos reales del spreadsheet para poblar todos los grupos.
          </p>
        </div>

      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ── Página principal ──────────────────────────────────────────────────────────
// ════════════════════════════════════════════════════════════════════════════
const Repositorio = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const taller    = getTallerBySlug(slug || "");
  const bienes    = useMemo(() => getBienesByTaller(slug || ""), [slug]);
  const jerarquia = useMemo(() => buildJerarquia(bienes), [bienes]);

  // Tabs
  const [activeTab, setActiveTab] = useState<"equipos" | "grupos">("equipos");

  // Estado Tab Equipos
  const [searchQuery, setSearchQuery] = useState("");
  const [zonaFilter, setZonaFilter]   = useState("all");

  const jerarquiaFiltrada = useMemo(() => {
    if (zonaFilter === "all") return jerarquia;
    return jerarquia.filter(z => z.nombre === zonaFilter);
  }, [jerarquia, zonaFilter]);

  const handleDownload = () =>
    toast({ title: "📄 Descarga próximamente", description: "El PDF se conectará cuando subas el archivo." });

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-card border border-border p-8 text-center" style={{ borderRadius: "var(--r-xl)" }}>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Taller no encontrado</h2>
            <button onClick={() => navigate("/")} className="text-primary text-sm font-semibold hover:underline">← Volver</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader>
        <button onClick={() => navigate(`/taller/${slug}`)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">Repositorio — {taller.nombre}</span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Repositorio de Documentación
            </h1>
            <p className="text-muted-foreground text-sm mt-1">{taller.nombre}</p>
          </div>

          {/* ── TABS ── */}
          <div className="flex gap-1 p-1 bg-muted rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("equipos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "equipos"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Package className="h-4 w-4" />
              Manuales por Equipo
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${activeTab === "equipos" ? "bg-primary/10 text-primary" : "bg-background/50 text-muted-foreground"}`}>
                {bienes.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab("grupos")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === "grupos"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              Manuales por Grupos
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${activeTab === "grupos" ? "bg-primary/10 text-primary" : "bg-background/50 text-muted-foreground"}`}>
                KIT
              </span>
            </button>
          </div>

          {/* ── TAB: EQUIPOS ── */}
          {activeTab === "equipos" && (
            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* Sidebar */}
              <div className="w-full lg:w-56 shrink-0 space-y-5 lg:sticky lg:top-4">
                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-1">Recursos Rápidos</p>
                  <p className="text-[10px] text-muted-foreground mb-3">(Descargas PDF)</p>
                  <button onClick={handleDownload} className="w-full flex items-center gap-3 p-3 rounded-xl border-2 border-primary/25 bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all text-left group">
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-tag-pdf-bg">
                      <FileText className="h-5 w-5 text-tag-pdf-text" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">Manual General</p>
                      <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5"><Download className="h-2.5 w-2.5" /> PDF · Catálogo completo</p>
                    </div>
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">{jerarquia.length} Grupos</p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setZonaFilter("all")}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-xs transition-colors font-medium ${zonaFilter === "all" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"}`}
                    >
                      Todos
                    </button>
                    {jerarquia.map((zona, idx) => {
                      const color = ZONA_COLORS[idx % ZONA_COLORS.length];
                      const isActive = zonaFilter === zona.nombre;
                      return (
                        <button key={zona.nombre} onClick={() => setZonaFilter(isActive ? "all" : zona.nombre)}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all"
                          style={isActive ? { background: color.badge, border: `1.5px solid ${color.border}` } : { border: "1.5px solid transparent" }}>
                          <span className="text-[10px] font-bold shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: color.badge, color: color.dot }}>#{idx + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium leading-snug truncate" style={isActive ? { color: color.dot } : {}}>
                              {zona.nombre.replace("ZONA DE ", "").replace(", GESTIÓN Y DISEÑO", "")}
                            </p>
                            <p className="text-[10px] text-muted-foreground">{countBienes(zona)} equipos</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Panel derecho */}
              <div className="flex-1 min-w-0 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="Buscar por nombre, marca..."
                    value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /><span>Zona</span>
                  <ChevronRight className="h-3 w-3" />
                  <Layers className="h-3 w-3" /><span>Área</span>
                  <ChevronRight className="h-3 w-3" />
                  <Grid3x3 className="h-3 w-3" /><span>Sub Área</span>
                  <ChevronRight className="h-3 w-3" />
                  <Package className="h-3 w-3" /><span>Equipos</span>
                </div>
                <div className="space-y-5">
                  {jerarquiaFiltrada.map(zona => {
                    const originalIdx = jerarquia.findIndex(z => z.nombre === zona.nombre);
                    return <ZonaPanel key={zona.nombre} zona={zona} colorIdx={originalIdx} slug={slug || ""} searchQuery={searchQuery} />;
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ── TAB: GRUPOS ── */}
          {activeTab === "grupos" && (
            <TabManualesGrupos slug={slug || ""} onDownload={handleDownload} />
          )}

        </div>
      </main>
    </>
  );
};

export default Repositorio;
