import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, getTotalBienesByTaller } from "@/data/bienesData";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { RepositorioHome } from "@/components/RepositorioHome";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type Vista = "home" | "catalogo";

// ─── Mapa de tipos de documento ──────────────────────────────────────────────
const TIPO_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  VIDEO:        { label: "Video",        color: "#045f6c", bg: "#e3f8fb" },
  MANUAL:       { label: "Manual",       color: "#5b21b6", bg: "#f5f3ff" },
  IPERC:        { label: "IPERC",        color: "#991b1b", bg: "#fef2f2" },
  MANTENIMIENTO:{ label: "Mant.",        color: "#c2410c", bg: "#fff7ed" },
  PROVEEDOR:    { label: "Proveedor",    color: "#1d4ed8", bg: "#eff6ff" },
};

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────
export default function Repositorio() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [vista, setVista] = useState<Vista>(searchParams.get("vista") === "catalogo" ? "catalogo" : "home");
  const [busqueda, setBusqueda] = useState("");

  // Sync with URL param
  useEffect(() => {
    if (searchParams.get("vista") === "catalogo" && vista !== "catalogo") {
      setVista("catalogo");
    }
  }, [searchParams]);
  const [filtroTipo, setFiltroTipo] = useState<string | null>(null);
  const [filtroZona, setFiltroZona] = useState<string | null>(null);

  const taller      = getTallerBySlug(slug ?? "");
  const bienes      = useMemo(() => getBienesByTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);

  // Zonas únicas para el filtro
  const zonasUnicas = useMemo(
    () => [...new Set(bienes.map((b) => b.zona))].filter(Boolean),
    [bienes]
  );

  // Bienes filtrados
  const bienesFiltrados = useMemo(() => {
    return bienes.filter((b) => {
      const matchSearch =
        !busqueda ||
        b.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        b.zona?.toLowerCase().includes(busqueda.toLowerCase()) ||
        b.descripcion?.toLowerCase().includes(busqueda.toLowerCase());
      const matchZona = !filtroZona || b.zona === filtroZona;
      return matchSearch && matchZona;
    });
  }, [bienes, busqueda, filtroZona]);

  // Handlers desde el Home
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontFamily: "'Manrope', sans-serif" }}>
        <div style={{ background: "#e3f8fb", borderRadius: 20, padding: "3rem", textAlign: "center" }}>
          <p style={{ fontSize: "3rem" }}>🔧</p>
          <h2 style={{ fontWeight: 800, color: "#043941", marginBottom: 12 }}>Taller no encontrado</h2>
          <Link to="/" style={{ color: "#02d47e", fontWeight: 700, textDecoration: "none" }}>← Volver al Hub</Link>
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

  // ── Vista CATÁLOGO ──────────────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Manrope', sans-serif", background: "#f7fdfb", minHeight: "100%" }}>

      {/* ── Barra superior ───────────────────────────────────────────────────── */}
      <div style={{
        background: "#043941",
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "sticky",
        top: 0,
        zIndex: 30,
      }}>
        {/* Volver al home */}
        <button
          onClick={() => { setVista("home"); setBusqueda(""); setFiltroTipo(null); setFiltroZona(null); }}
          style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: 13, fontFamily: "'Manrope', sans-serif", display: "flex", alignItems: "center", gap: 4, padding: 0, flexShrink: 0 }}
        >
          ← Inicio
        </button>

        {/* Buscador inline */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1.5px solid rgba(2,212,126,0.2)", borderRadius: 100, padding: "7px 14px" }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
            <circle cx="6.5" cy="6.5" r="4.5" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5"/>
            <path d="M10 10L14 14" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setFiltroTipo(null); }}
            placeholder="Buscar equipo…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "'Manrope', sans-serif", fontSize: 13, color: "#fff" }}
          />
          {busqueda && (
            <button onClick={() => setBusqueda("")} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 16, padding: 0 }}>×</button>
          )}
        </div>

        {/* Contador */}
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", flexShrink: 0 }}>
          {bienesFiltrados.length} equipos
        </span>
      </div>

      {/* ── Chips de filtro por tipo ─────────────────────────────────────────── */}
      {filtroTipo && (
        <div style={{ padding: "12px 24px", background: "#fff", borderBottom: "1px solid rgba(4,57,65,0.06)", display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#8fa3a8", fontWeight: 600 }}>Filtro:</span>
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: TIPO_LABELS[filtroTipo]?.bg ?? "#e3f8fb",
            color: TIPO_LABELS[filtroTipo]?.color ?? "#043941",
            fontSize: 12,
            fontWeight: 700,
            padding: "4px 12px",
            borderRadius: 100,
          }}>
            {TIPO_LABELS[filtroTipo]?.label ?? filtroTipo}
            <button onClick={() => setFiltroTipo(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
          </div>
        </div>
      )}

      {/* ── Chips de zona ────────────────────────────────────────────────────── */}
      {zonasUnicas.length > 1 && !filtroTipo && (
        <div style={{ padding: "12px 24px", background: "#fff", borderBottom: "1px solid rgba(4,57,65,0.06)", display: "flex", gap: 6, flexWrap: "wrap" as const, alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#8fa3a8", fontWeight: 600, marginRight: 2 }}>Zona:</span>
          {zonasUnicas.map((zona) => (
            <button
              key={zona}
              onClick={() => setFiltroZona(filtroZona === zona ? null : zona)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 12px",
                borderRadius: 100,
                border: "1.5px solid",
                cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "all 0.15s",
                background: filtroZona === zona ? "#043941" : "transparent",
                color: filtroZona === zona ? "#02d47e" : "#043941",
                borderColor: filtroZona === zona ? "#043941" : "rgba(4,57,65,0.15)",
              }}
            >
              {zona}
            </button>
          ))}
          {filtroZona && (
            <button onClick={() => setFiltroZona(null)} style={{ fontSize: 11, color: "#02d47e", background: "none", border: "none", cursor: "pointer", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* ── Lista de bienes ──────────────────────────────────────────────────── */}
      <div style={{ padding: "16px 24px 40px", maxWidth: 680, margin: "0 auto" }}>

        {bienesFiltrados.length === 0 ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "#8fa3a8" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🔍</div>
            <p style={{ fontWeight: 600, fontSize: 15, color: "#043941", marginBottom: 4 }}>Sin resultados</p>
            <p style={{ fontSize: 13 }}>Intenta con otro término o limpia los filtros.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
            {bienesFiltrados.map((bien, i) => (
              <BienCard
                key={i}
                bien={bien}
                accent={data.tallerAccent}
                slug={slug ?? ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Card de bien ─────────────────────────────────────────────────────────────
function BienCard({ bien, accent, slug }: { bien: any; accent: string; slug: string }) {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      to={`/taller/${slug}/repositorio/bien/${bien.n}`}
      style={{ textDecoration: "none" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        background: hovered ? "#f0fdf8" : "#fff",
        border: `1.5px solid ${hovered ? "#02d47e" : "rgba(4,57,65,0.08)"}`,
        borderRadius: 14,
        padding: "14px 18px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        transition: "all 0.18s",
        transform: hovered ? "translateX(3px)" : "translateX(0)",
      }}>
        {/* Número */}
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 9,
          background: hovered ? `${accent}1a` : "rgba(4,57,65,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          fontWeight: 800,
          color: hovered ? accent : "rgba(4,57,65,0.4)",
          flexShrink: 0,
          transition: "all 0.18s",
        }}>
          {bien.n}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#043941",
            marginBottom: 2,
            whiteSpace: "nowrap" as const,
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {bien.nombre}
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" as const }}>
            {bien.zona && (
              <span style={{ fontSize: 11, color: "#8fa3a8", fontWeight: 500 }}>{bien.zona}</span>
            )}
            {bien.zona && bien.cantidad && (
              <span style={{ fontSize: 11, color: "rgba(4,57,65,0.2)" }}>·</span>
            )}
            {bien.cantidad > 1 && (
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                color: "#045f6c",
                background: "#e3f8fb",
                padding: "2px 8px",
                borderRadius: 100,
              }}>
                ×{bien.cantidad}
              </span>
            )}
          </div>
        </div>

        {/* Flecha */}
        <span style={{
          fontSize: 20,
          color: hovered ? "#02d47e" : "#c9d8d8",
          fontWeight: 300,
          transition: "color 0.15s",
          flexShrink: 0,
        }}>›</span>
      </div>
    </Link>
  );
}
