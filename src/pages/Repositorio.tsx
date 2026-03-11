import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useMemo, memo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, type Bien } from "@/data/bienesData";
import {
  ArrowLeft, Search, Package, BookOpen, MapPin,
  ChevronRight, ChevronDown, FolderOpen, Folder, Layers, Grid3x3,
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

// ── Tipos de jerarquía ──────────────────────────────────────────────────────
interface SubArea { nombre: string; bienes: Bien[] }
interface Area    { nombre: string; subareas: SubArea[]; bienesDirectos: Bien[] }
interface Zona    { nombre: string; areas: Area[];       bienesDirectos: Bien[] }

// ── Colores de zona (idénticos al Catálogo) ─────────────────────────────────
const zonaBadgeColors: Record<string, string> = {
  "ZONA DE INVESTIGACIÓN, GESTIÓN Y DISEÑO": "bg-g-light text-g-deep",
  "ZONA DE INNOVACIÓN":                      "bg-tag-vid-bg text-tag-vid-text",
  "DEPÓSITO / ALMACÉN / SEGURIDAD":          "bg-tag-pdf-bg text-tag-pdf-text",
};

function zonaBadge(zona: string): string {
  // busca coincidencia parcial
  for (const [key, cls] of Object.entries(zonaBadgeColors)) {
    if (zona.toUpperCase().includes(key.replace("ZONA DE ", "").substring(0, 8))) return cls;
  }
  return zonaBadgeColors[zona] || "bg-muted text-muted-foreground";
}

const ZONA_BORDER_COLORS = [
  { border: "hsl(142 70% 45% / 0.4)", bg: "hsl(142 70% 45% / 0.08)", dot: "hsl(142 70% 40%)" },
  { border: "hsl(200 70% 50% / 0.4)", bg: "hsl(200 70% 50% / 0.08)", dot: "hsl(200 70% 40%)" },
  { border: "hsl(35 80% 50% / 0.4)",  bg: "hsl(35 80% 50% / 0.08)",  dot: "hsl(35 75% 40%)"  },
  { border: "hsl(270 60% 55% / 0.4)", bg: "hsl(270 60% 55% / 0.08)", dot: "hsl(270 60% 45%)" },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
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
  zona.areas.forEach((a) => {
    t += a.bienesDirectos.length;
    a.subareas.forEach((s) => (t += s.bienes.length));
  });
  return t;
}

// ── BienCard — IDÉNTICA al Catálogo ─────────────────────────────────────────
const BienCard = memo(({ bien, slug }: { bien: Bien; slug: string }) => (
  <Link
    to={`/taller/${slug}/bien/${bien.n}`}
    className="bg-card border border-border p-4 hover:shadow-sm hover:border-primary/20 transition-shadow group text-left w-full block"
    style={{ borderRadius: "var(--r-lg)" }}
  >
    <div className="flex items-start justify-between mb-2">
      <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
        #{bien.n}
      </span>
      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${zonaBadge(bien.zona)}`}>
        {bien.zona}
      </span>
    </div>
    <h3 className="font-semibold text-sm text-foreground leading-snug mb-2 group-hover:text-primary transition-colors">
      {bien.nombre}
    </h3>
    <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
      {bien.descripcion}
    </p>
    <div className="flex flex-wrap gap-1.5 mb-3">
      {bien.marca && (
        <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-tag-3d-bg text-tag-3d-text">
          {bien.marca}
        </span>
      )}
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        <BookOpen className="h-2.5 w-2.5" /> x{bien.cantidad}
      </span>
    </div>
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">
        {bien.modelo ? `Mod: ${bien.modelo}` : ""}
      </span>
      <span className="text-xs font-semibold text-primary group-hover:underline">Ver ficha →</span>
    </div>
  </Link>
));
BienCard.displayName = "BienCard";

// ── Grid de bienes ───────────────────────────────────────────────────────────
function BienesGrid({ bienes, slug, searchQuery }: { bienes: Bien[]; slug: string; searchQuery: string }) {
  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return bienes;
    const q = searchQuery.toLowerCase();
    return bienes.filter(
      (b) =>
        b.nombre.toLowerCase().includes(q) ||
        b.descripcion.toLowerCase().includes(q) ||
        (b.marca || "").toLowerCase().includes(q)
    );
  }, [bienes, searchQuery]);

  if (filtered.length === 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
      {filtered.map((b) => (
        <BienCard key={b.n} bien={b} slug={slug} />
      ))}
    </div>
  );
}

// ── SubÁrea panel ─────────────────────────────────────────────────────────────
function SubAreaPanel({ subarea, slug, searchQuery }: { subarea: SubArea; slug: string; searchQuery: string }) {
  const [open, setOpen] = useState(false);

  const visibleCount = useMemo(() => {
    if (!searchQuery.trim()) return subarea.bienes.length;
    const q = searchQuery.toLowerCase();
    return subarea.bienes.filter(
      (b) => b.nombre.toLowerCase().includes(q) || (b.marca || "").toLowerCase().includes(q)
    ).length;
  }, [subarea.bienes, searchQuery]);

  if (visibleCount === 0 && searchQuery) return null;

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-background hover:bg-sidebar-accent/40 transition-colors text-left"
      >
        <Grid3x3 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <span className="flex-1 text-xs font-medium text-foreground truncate">{subarea.nombre}</span>
        <span className="text-[10px] text-muted-foreground shrink-0">{subarea.bienes.length} equipos</span>
        {open
          ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-background/60">
          <BienesGrid bienes={subarea.bienes} slug={slug} searchQuery={searchQuery} />
        </div>
      )}
    </div>
  );
}

// ── Área panel ────────────────────────────────────────────────────────────────
function AreaPanel({ area, slug, searchQuery }: { area: Area; slug: string; searchQuery: string }) {
  const [open, setOpen] = useState(true);
  const total = area.bienesDirectos.length + area.subareas.reduce((a, s) => a + s.bienes.length, 0);

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-sidebar-accent transition-colors text-left"
      >
        <div className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 bg-primary/10">
          <Layers className="h-3.5 w-3.5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{area.nombre}</p>
          <p className="text-[10px] text-muted-foreground">
            {total} equipos{area.subareas.length > 0 && ` · ${area.subareas.length} sub áreas`}
          </p>
        </div>
        {open
          ? <><ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" /><FolderOpen className="h-4 w-4 text-primary shrink-0" /></>
          : <><ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" /><Folder className="h-4 w-4 text-muted-foreground shrink-0" /></>}
      </button>
      {open && (
        <div className="border-t border-border bg-background/50 p-4 space-y-2.5">
          {area.subareas.map((sub) => (
            <SubAreaPanel key={sub.nombre} subarea={sub} slug={slug} searchQuery={searchQuery} />
          ))}
          {area.bienesDirectos.length > 0 && (
            <div>
              {area.subareas.length > 0 && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2 mt-1">
                  Sin sub área asignada
                </p>
              )}
              <BienesGrid bienes={area.bienesDirectos} slug={slug} searchQuery={searchQuery} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Zona panel ────────────────────────────────────────────────────────────────
function ZonaPanel({ zona, colorIdx, slug, searchQuery }: {
  zona: Zona; colorIdx: number; slug: string; searchQuery: string
}) {
  const [open, setOpen] = useState(true);
  const color = ZONA_BORDER_COLORS[colorIdx % ZONA_BORDER_COLORS.length];
  const total = countBienes(zona);

  return (
    <div
      className="border-2 rounded-2xl overflow-hidden"
      style={{ borderColor: color.border }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-colors"
        style={{ background: color.bg }}
      >
        <div
          className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: color.bg, border: `1.5px solid ${color.border}` }}
        >
          <MapPin className="h-4 w-4" style={{ color: color.dot }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-foreground leading-snug">{zona.nombre}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {total} equipos{zona.areas.length > 0 && ` · ${zona.areas.length} áreas`}
          </p>
        </div>
        {open
          ? <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
          : <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />}
      </button>

      {/* Contenido */}
      {open && (
        <div className="p-4 space-y-3 bg-background">
          {zona.areas.map((area) => (
            <AreaPanel key={area.nombre} area={area} slug={slug} searchQuery={searchQuery} />
          ))}
          {zona.bienesDirectos.length > 0 && (
            <div>
              {zona.areas.length > 0 && (
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                  Sin área asignada
                </p>
              )}
              <BienesGrid bienes={zona.bienesDirectos} slug={slug} searchQuery={searchQuery} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
const Repositorio = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const taller   = getTallerBySlug(slug || "");
  const bienes   = useMemo(() => getBienesByTaller(slug || ""), [slug]);
  const jerarquia = useMemo(() => buildJerarquia(bienes), [bienes]);

  const [searchQuery, setSearchQuery] = useState("");

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
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-6">

          {/* Header */}
          <div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Repositorio de Productos
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {bienes.length} equipos en {taller.nombre} — organizado por Zona · Área · Sub Área
            </p>
          </div>

          {/* Buscador */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
            />
          </div>

          {/* Breadcrumb niveles */}
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="h-3 w-3" /><span>Zona</span>
            <ChevronRight className="h-3 w-3" />
            <Layers className="h-3 w-3" /><span>Área</span>
            <ChevronRight className="h-3 w-3" />
            <Grid3x3 className="h-3 w-3" /><span>Sub Área</span>
            <ChevronRight className="h-3 w-3" />
            <Package className="h-3 w-3" /><span>Equipos</span>
          </div>

          {/* Zonas */}
          <div className="space-y-5">
            {jerarquia.map((zona, idx) => (
              <ZonaPanel
                key={zona.nombre}
                zona={zona}
                colorIdx={idx}
                slug={slug || ""}
                searchQuery={searchQuery}
              />
            ))}
          </div>

        </div>
      </main>
    </>
  );
};

export default Repositorio;
