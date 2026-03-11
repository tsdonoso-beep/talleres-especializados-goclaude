import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, type Bien } from "@/data/bienesData";
import {
  ArrowLeft, FileText, Download, Search, Package,
  ChevronRight, ChevronDown, FolderOpen, Folder,
  Filter, Layers, MapPin, Grid3x3,
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";
import { useToast } from "@/hooks/use-toast";

// ── Tipos ──────────────────────────────────────────────────────────────────
interface SubArea {
  nombre: string;
  bienes: Bien[];
}

interface Area {
  nombre: string;
  subareas: SubArea[];
  bienesDirectos: Bien[];
}

interface Zona {
  nombre: string;
  areas: Area[];
  bienesDirectos: Bien[];
}

const TIPOS_DOC = ["Manual de Uso", "Manual de Mantenimiento", "Manual Pedagógico"] as const;
type TipoDoc = typeof TIPOS_DOC[number];

interface DocItem {
  id: string;
  bien: Bien;
  tipo: TipoDoc;
  codigo: string;
}

const TIPO_STYLES: Record<TipoDoc, { bg: string; text: string }> = {
  "Manual de Uso":           { bg: "var(--tag-pdf-bg)",   text: "var(--tag-pdf-text)" },
  "Manual de Mantenimiento": { bg: "var(--tag-video-bg)", text: "var(--tag-video-text)" },
  "Manual Pedagógico":       { bg: "var(--tag-quiz-bg)",  text: "var(--tag-quiz-text)" },
};

const ZONA_COLORS = [
  { dot: "hsl(142 70% 45%)", badge: "hsl(142 70% 45% / 0.12)" },
  { dot: "hsl(200 70% 50%)", badge: "hsl(200 70% 50% / 0.12)" },
  { dot: "hsl(35 80% 50%)",  badge: "hsl(35 80% 50% / 0.12)"  },
  { dot: "hsl(270 60% 55%)", badge: "hsl(270 60% 55% / 0.12)" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function buildJerarquia(bienes: Bien[]): Zona[] {
  const norm = (s: string) => (s || "").trim();
  const zonaMap = new Map<string, Map<string, Map<string, Bien[]>>>();

  bienes.forEach((b) => {
    const zona    = norm(b.zona)              || "Sin Zona";
    const area    = norm((b as any).area)    || "";
    const subarea = norm((b as any).subarea) || "";

    if (!zonaMap.has(zona)) zonaMap.set(zona, new Map());
    const areaMap = zonaMap.get(zona)!;
    if (!areaMap.has(area)) areaMap.set(area, new Map());
    const subMap = areaMap.get(area)!;
    if (!subMap.has(subarea)) subMap.set(subarea, []);
    subMap.get(subarea)!.push(b);
  });

  return Array.from(zonaMap.entries()).map(([zonaNombre, areaMap]) => {
    let bienesDirectosZona: Bien[] = [];
    const areas: Area[] = [];

    Array.from(areaMap.entries()).forEach(([areaNombre, subMap]) => {
      let bienesDirectosArea: Bien[] = [];
      const subareas: SubArea[] = [];

      Array.from(subMap.entries()).forEach(([subareaNombre, bArr]) => {
        if (subareaNombre === "") bienesDirectosArea = bienesDirectosArea.concat(bArr);
        else subareas.push({ nombre: subareaNombre, bienes: bArr });
      });

      if (areaNombre === "") bienesDirectosZona = bienesDirectosZona.concat(bienesDirectosArea);
      else areas.push({ nombre: areaNombre, subareas, bienesDirectos: bienesDirectosArea });
    });

    return { nombre: zonaNombre, areas, bienesDirectos: bienesDirectosZona };
  });
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

function countBienes(zona: Zona): number {
  let t = zona.bienesDirectos.length;
  zona.areas.forEach((a) => {
    t += a.bienesDirectos.length;
    a.subareas.forEach((s) => (t += s.bienes.length));
  });
  return t;
}

function filterDocs(docs: DocItem[], q: string, tipo: string): DocItem[] {
  return docs.filter((d) => {
    const ql = q.toLowerCase();
    const matchSearch = !ql || d.bien.nombre.toLowerCase().includes(ql) ||
      (d.bien.marca || "").toLowerCase().includes(ql) || d.codigo.toLowerCase().includes(ql);
    const matchTipo = tipo === "Todos" || d.tipo === tipo;
    return matchSearch && matchTipo;
  });
}

// ── DocCard ────────────────────────────────────────────────────────────────
function DocCard({ doc, onDownload }: { doc: DocItem; onDownload: () => void }) {
  const s = TIPO_STYLES[doc.tipo];
  return (
    <div className="bg-card border border-border rounded-xl p-3.5 flex flex-col gap-2.5 hover:border-primary/40 hover:shadow-md transition-all duration-200">
      <div className="h-11 w-11 rounded-lg flex items-center justify-center mx-auto"
        style={{ background: `hsl(${s.bg})` }}>
        <FileText className="h-5 w-5" style={{ color: `hsl(${s.text})` }} />
      </div>
      <div className="text-center space-y-0.5">
        <p className="text-[10px] font-mono text-muted-foreground">{doc.codigo}</p>
        <h4 className="font-semibold text-[11px] text-foreground line-clamp-2 leading-snug">{doc.bien.nombre}</h4>
        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium"
          style={{ background: `hsl(${s.bg})`, color: `hsl(${s.text})` }}>
          {doc.tipo}
        </span>
        {doc.bien.marca && <p className="text-[10px] text-muted-foreground">{doc.bien.marca}</p>}
      </div>
      <button onClick={onDownload}
        className="mt-auto inline-flex items-center justify-center gap-1 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-border hover:border-primary/60 hover:bg-primary/5 transition-colors">
        <Download className="h-3 w-3" /> Descargar
      </button>
    </div>
  );
}

// ── DocGrid ────────────────────────────────────────────────────────────────
function DocGrid({ bienes, searchQuery, tipoFilter, onDownload }:
  { bienes: Bien[]; searchQuery: string; tipoFilter: string; onDownload: () => void }) {
  const docs = useMemo(() => buildDocs(bienes), [bienes]);
  const filtered = filterDocs(docs, searchQuery, tipoFilter);
  if (filtered.length === 0) return null;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-3">
      {filtered.map((doc) => <DocCard key={doc.id} doc={doc} onDownload={onDownload} />)}
    </div>
  );
}

// ── SubArea Panel ──────────────────────────────────────────────────────────
function SubAreaPanel({ subarea, searchQuery, tipoFilter, onDownload }:
  { subarea: SubArea; searchQuery: string; tipoFilter: string; onDownload: () => void }) {
  const [open, setOpen] = useState(false);
  const docs = useMemo(() => buildDocs(subarea.bienes), [subarea.bienes]);
  const visible = filterDocs(docs, searchQuery, tipoFilter);
  if (visible.length === 0 && (searchQuery || tipoFilter !== "Todos")) return null;

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-background hover:bg-sidebar-accent/40 transition-colors text-left">
        <Grid3x3 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="flex-1 text-xs font-medium text-foreground truncate">{subarea.nombre}</span>
        <span className="text-[10px] text-muted-foreground shrink-0">{subarea.bienes.length} equipos</span>
        {open ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
               : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-border/50 bg-background/60">
          <DocGrid bienes={subarea.bienes} searchQuery={searchQuery} tipoFilter={tipoFilter} onDownload={onDownload} />
        </div>
      )}
    </div>
  );
}

// ── Area Panel ─────────────────────────────────────────────────────────────
function AreaPanel({ area, searchQuery, tipoFilter, onDownload }:
  { area: Area; searchQuery: string; tipoFilter: string; onDownload: () => void }) {
  const [open, setOpen] = useState(true);
  const total = area.bienesDirectos.length + area.subareas.reduce((a, s) => a + s.bienes.length, 0);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-sidebar-accent transition-colors text-left">
        <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 bg-primary/10">
          <Layers className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{area.nombre}</p>
          <p className="text-[10px] text-muted-foreground">
            {total} equipos{area.subareas.length > 0 && ` · ${area.subareas.length} sub áreas`}
          </p>
        </div>
        {open ? <><ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /><FolderOpen className="h-4 w-4 text-primary shrink-0" /></>
              : <><ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" /><Folder className="h-4 w-4 text-muted-foreground shrink-0" /></>}
      </button>
      {open && (
        <div className="border-t border-border bg-background/50 p-4 space-y-2.5">
          {area.subareas.map((sub) => (
            <SubAreaPanel key={sub.nombre} subarea={sub} searchQuery={searchQuery} tipoFilter={tipoFilter} onDownload={onDownload} />
          ))}
          {area.bienesDirectos.length > 0 && (
            <div>
              {area.subareas.length > 0 && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 mt-1">Sin sub área</p>
              )}
              <DocGrid bienes={area.bienesDirectos} searchQuery={searchQuery} tipoFilter={tipoFilter} onDownload={onDownload} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Zona Panel ─────────────────────────────────────────────────────────────
function ZonaPanel({ zona, colorIdx, searchQuery, tipoFilter, onDownload }:
  { zona: Zona; colorIdx: number; searchQuery: string; tipoFilter: string; onDownload: () => void }) {
  const [open, setOpen] = useState(true);
  const color = ZONA_COLORS[colorIdx % ZONA_COLORS.length];
  const total = countBienes(zona);

  return (
    <div className="border-2 rounded-2xl overflow-hidden" style={{ borderColor: color.dot + "50" }}>
      <button onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
        style={{ background: color.badge }}>
        <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color.dot + "20", border: `1.5px solid ${color.dot}60` }}>
          <MapPin className="h-4 w-4" style={{ color: color.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground leading-snug">{zona.nombre}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {total} equipos{zona.areas.length > 0 && ` · ${zona.areas.length} áreas`}
          </p>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
              : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>
      {open && (
        <div className="p-4 space-y-3 bg-background">
          {zona.areas.map((area) => (
            <AreaPanel key={area.nombre} area={area} searchQuery={searchQuery} tipoFilter={tipoFilter} onDownload={onDownload} />
          ))}
          {zona.bienesDirectos.length > 0 && (
            <div>
              {zona.areas.length > 0 && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Sin área asignada</p>
              )}
              <DocGrid bienes={zona.bienesDirectos} searchQuery={searchQuery} tipoFilter={tipoFilter} onDownload={onDownload} />
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
  const jerarquia = useMemo(() => buildJerarquia(bienes), [bienes]);

  const [searchQuery, setSearchQuery] = useState("");
  const [tipoFilter, setTipoFilter] = useState("Todos");

  const handleDownload = () =>
    toast({ title: "📄 Descarga disponible próximamente", description: "Los PDFs se conectarán cuando subas los archivos." });

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

  return (
    <>
      <PageHeader>
        <button onClick={() => navigate(`/taller/${slug}`)} className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">Repositorio de Productos</span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

          {/* Banner */}
          <div className="hero-gradient p-6 md:p-8 rounded-2xl flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4" style={{ color: "hsl(var(--dk-text))" }} />
                <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "hsl(var(--dk-muted))" }}>
                  v1.0 · Base de documentación técnica
                </span>
              </div>
              <h1 className="text-xl md:text-2xl font-extrabold" style={{ color: "hsl(var(--dk-text))" }}>
                Repositorio Técnico — {taller.nombre.toUpperCase()}
              </h1>
              <p className="text-sm mt-1" style={{ color: "hsl(var(--dk-muted))" }}>
                Estructura jerárquica: Zona → Área → Sub Área → Documentos
              </p>
            </div>
            <div className="flex gap-6 shrink-0">
              {[
                { label: "Equipos",    value: bienes.length },
                { label: "Documentos", value: bienes.length * 3 },
                { label: "Zonas",      value: jerarquia.length },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-2xl font-extrabold" style={{ color: "hsl(var(--dk-text))" }}>{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wider" style={{ color: "hsl(var(--dk-muted))" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Layout */}
          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar */}
            <div className="w-full lg:w-56 shrink-0 space-y-4">

              {/* Descarga rápida */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Recursos Rápidos</p>
                <button onClick={handleDownload}
                  className="w-full flex items-center gap-3 p-3 rounded-lg border-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-colors text-left">
                  <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "hsl(var(--tag-pdf-bg))" }}>
                    <FileText className="h-5 w-5" style={{ color: "hsl(var(--tag-pdf-text))" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Manual General</p>
                    <p className="text-[10px] text-muted-foreground">PDF · Catálogo completo</p>
                  </div>
                </button>
              </div>

              {/* Zonas nav */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3">Zonas</p>
                <div className="space-y-1">
                  {jerarquia.map((zona, idx) => {
                    const color = ZONA_COLORS[idx % ZONA_COLORS.length];
                    return (
                      <button key={zona.nombre}
                        onClick={() => setTimeout(() => document.getElementById(`zona-${idx}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 50)}
                        className="w-full flex items-center gap-2 p-2 rounded-lg text-left hover:bg-sidebar-accent transition-colors">
                        <span className="h-2 w-2 rounded-full shrink-0" style={{ background: color.dot }} />
                        <span className="text-xs text-foreground truncate leading-snug">{zona.nombre}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtro tipo */}
              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground mb-3 flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Tipo de Manual
                </p>
                {["Todos", ...TIPOS_DOC].map((t) => (
                  <label key={t} className="flex items-center gap-2 py-1 text-xs cursor-pointer">
                    <input type="radio" name="tipo" checked={tipoFilter === t} onChange={() => setTipoFilter(t)} className="accent-primary" />
                    <span className={tipoFilter === t ? "text-foreground font-medium" : "text-muted-foreground"}>{t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0 space-y-4">

              {/* Buscador */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="text" placeholder="Buscar por nombre, marca, código EPT..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition" />
              </div>

              {/* Breadcrumb niveles */}
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3" /><span>Zona</span>
                <ChevronRight className="h-3 w-3" />
                <Layers className="h-3 w-3" /><span>Área</span>
                <ChevronRight className="h-3 w-3" />
                <Grid3x3 className="h-3 w-3" /><span>Sub Área</span>
                <ChevronRight className="h-3 w-3" />
                <FileText className="h-3 w-3" /><span>Documentos</span>
              </div>

              {/* Zonas */}
              <div className="space-y-4">
                {jerarquia.map((zona, idx) => (
                  <div key={zona.nombre} id={`zona-${idx}`}>
                    <ZonaPanel zona={zona} colorIdx={idx} searchQuery={searchQuery} tipoFilter={tipoFilter} onDownload={handleDownload} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Repositorio;
