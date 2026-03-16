import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, getTotalBienesByTaller, Bien } from "@/data/bienesData";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { RepositorioHome } from "@/components/RepositorioHome";
import { Package } from "lucide-react";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Vista = "home" | "catalogo";

// ─── Colores por tipo ────────────────────────────────────────────────────────
const TIPO_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  EQUIPOS:       { bg: "bg-g-pale",           text: "text-g-deep",           border: "border-g-deep/20" },
  HERRAMIENTAS:  { bg: "bg-tag-vid-bg",       text: "text-tag-vid-text",     border: "border-tag-vid-text/20" },
  INSTRUMENTOS:  { bg: "bg-acc-lila-light",   text: "text-tag-3d-text",      border: "border-tag-3d-text/20" },
  MATERIALES:    { bg: "bg-tag-pdf-bg",       text: "text-tag-pdf-text",     border: "border-tag-pdf-text/20" },
  MOBILIARIO:    { bg: "bg-acc-yellow-light",  text: "text-secondary",       border: "border-secondary/20" },
};

const getTipoStyle = (tipo: string) =>
  TIPO_COLORS[tipo] || { bg: "bg-muted", text: "text-muted-foreground", border: "border-border" };

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Repositorio() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vista, setVista] = useState<Vista>(searchParams.get("vista") === "catalogo" ? "catalogo" : "home");
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);

  useEffect(() => {
    const v = searchParams.get("vista");
    if (v === "catalogo") {
      setVista("catalogo");
    } else {
      setVista("home");
      setBusqueda("");
    }
  }, [searchParams]);

  const taller      = getTallerBySlug(slug ?? "");
  const bienes      = useMemo(() => getBienesByTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);

  // Tipos únicos para filtro
  const tiposUnicos = useMemo(
    () => [...new Set(bienes.map((b) => b.tipo).filter(Boolean))].sort(),
    [bienes]
  );

  // Bienes filtrados
  const bienesFiltrados = useMemo(() => {
    return bienes.filter((b) => {
      const matchSearch =
        !busqueda ||
        b.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        b.subarea?.toLowerCase().includes(busqueda.toLowerCase()) ||
        b.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      const matchTipo = !filtroTipo || b.tipo === filtroTipo;
      return matchSearch && matchTipo;
    });
  }, [bienes, busqueda, filtroTipo]);

  // Handlers
  const handleBuscar = (q: string) => {
    setBusqueda(q);
    setFiltroTipo(null);
    setVista("catalogo");
  };

  const handleVerTodo = () => {
    setBusqueda("");
    setFiltroTipo(null);
    setVista("catalogo");
  };

  const handleFiltrar = (tipo: string) => {
    setFiltroTipo(tipo);
    setBusqueda("");
    setVista("catalogo");
  };

  if (!taller) {
    return (
      <div className="flex items-center justify-center h-full font-sans">
        <div className="bg-g-pale rounded-2xl p-12 text-center">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
          <h2 className="font-extrabold text-foreground mb-3">Taller no encontrado</h2>
          <Link to="/" className="text-primary font-bold hover:underline">← Volver al Hub</Link>
        </div>
      </div>
    );
  }

  // ── Vista HOME ──────────────────────────────────────────────────────────────
  if (vista === "home") {
    return (
      <RepositorioHome
        tallerNombre={taller.nombre}
        tallerSlug={slug ?? ""}
        totalBienes={totalBienes || bienes.length}
        tallerAccent={data.tallerAccent}
        onBuscar={handleBuscar}
        onVerTodo={handleVerTodo}
        onFiltrar={handleFiltrar}
      />
    );
  }

  // ── Vista CATÁLOGO (cards) ─────────────────────────────────────────────────
  return (
    <div className="font-sans bg-background min-h-full">

      {/* ── Barra superior ─────────────────────────────────────────────────── */}
      <div className="bg-secondary sticky top-0 z-30 px-6 py-3 flex items-center gap-3">
        <button
          onClick={() => { setVista("home"); setBusqueda(""); setFiltroTipo(null); }}
          className="text-secondary-foreground/50 hover:text-secondary-foreground text-sm font-semibold transition-colors shrink-0"
        >
          ← Inicio
        </button>

        <div className="flex-1 flex items-center gap-2 bg-white/[0.08] border border-g-mint/20 rounded-full px-4 py-2">
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" className="shrink-0">
            <circle cx="6.5" cy="6.5" r="4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <path d="M10 10L14 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setFiltroTipo(null); }}
            placeholder="Buscar equipo…"
            className="flex-1 bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40"
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} className="text-white/40 hover:text-white text-base">×</button>
          )}
        </div>

        <span className="text-[11px] text-secondary-foreground/40 shrink-0">
          {bienesFiltrados.length} equipos
        </span>
      </div>

      {/* ── Filtros por tipo ──────────────────────────────────────────────── */}
      <div className="px-6 py-3 bg-card border-b border-border flex gap-2 flex-wrap items-center">
        <span className="text-[11px] text-muted-foreground font-semibold mr-1">Tipo:</span>
        <button
          onClick={() => setFiltroTipo(null)}
          className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors ${
            !filtroTipo
              ? "bg-secondary text-g-mint border-secondary"
              : "bg-transparent text-foreground border-border hover:border-secondary/30"
          }`}
        >
          Todos
        </button>
        {tiposUnicos.map((tipo) => {
          const style = getTipoStyle(tipo);
          const active = filtroTipo === tipo;
          return (
            <button
              key={tipo}
              onClick={() => setFiltroTipo(active ? null : tipo)}
              className={`text-[11px] font-semibold px-3 py-1 rounded-full border transition-colors ${
                active
                  ? "bg-secondary text-g-mint border-secondary"
                  : `${style.bg} ${style.text} ${style.border} hover:opacity-80`
              }`}
            >
              {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      {/* ── Grid de cards ─────────────────────────────────────────────────── */}
      <div className="p-6 max-w-6xl mx-auto">
        {bienesFiltrados.length === 0 ? (
          <div className="text-center py-16">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-foreground mb-1">Sin resultados</p>
            <p className="text-sm text-muted-foreground">Intenta con otro término o limpia los filtros.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bienesFiltrados.map((bien) => (
              <BienCard key={bien.n} bien={bien} slug={slug ?? ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Card de bien ─────────────────────────────────────────────────────────────
function BienCard({ bien, slug }: { bien: Bien; slug: string }) {
  const tipoStyle = getTipoStyle(bien.tipo);

  return (
    <Link
      to={`/taller/${slug}/repositorio/bien/${bien.n}`}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-md hover:border-primary/30 transition-all group block"
    >
      {/* Header: número + tipo badge */}
      <div className="flex items-start justify-between mb-3">
        <span className="font-mono text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
          #{bien.n}
        </span>
        {bien.tipo && (
          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${tipoStyle.bg} ${tipoStyle.text}`}>
            {bien.tipo.charAt(0) + bien.tipo.slice(1).toLowerCase()}
          </span>
        )}
      </div>

      {/* Nombre */}
      <h3 className="font-bold text-sm text-foreground leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
        {bien.nombre}
      </h3>

      {/* Subarea */}
      {bien.subarea && (
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-1">
          📍 {bien.subarea}
        </p>
      )}
      {!bien.subarea && bien.area && (
        <p className="text-[11px] text-muted-foreground mb-3 line-clamp-1">
          📍 {bien.area}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border">
        {bien.cantidad > 1 ? (
          <span className="text-[10px] font-bold text-g-deep bg-g-pale px-2 py-0.5 rounded-full">
            ×{bien.cantidad}
          </span>
        ) : (
          <span />
        )}
        <span className="text-xs font-semibold text-primary group-hover:underline">Ver ficha →</span>
      </div>
    </Link>
  );
}
