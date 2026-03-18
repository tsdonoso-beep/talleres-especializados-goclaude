import { useLocation, Link, useNavigate } from "react-router-dom";
import logoFull from "@/assets/logo-grama-full.png";
import logoIcon from "@/assets/logo-grama.png";
import { NavLink } from "@/components/NavLink";
import { talleresConfig } from "@/data/talleresConfig";
import { buildModulosForTaller, getActiveLiveSession, getUpcomingLiveSession } from "@/data/modulosConfig";
import { useMemo, useState } from "react";
import {
  Car, Scissors, ChefHat, Hammer, Monitor, Cpu,
  UtensilsCrossed, Zap, Wrench, Home, Radio,
  User, LogOut, FileText, Video, Shield,
  ChevronRight, BookOpen, BarChart2, Clock,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarHeader, SidebarFooter,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar,
} from "@/components/ui/sidebar";

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Car, Scissors, ChefHat, Hammer, Monitor, Cpu, UtensilsCrossed, Zap, Wrench,
};

// ── Logo GRAMA ────────────────────────────────────────────────────────────────
function LogoGrama({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", width: "100%", padding: collapsed ? "2px 0" : "4px 0" }}>
      {collapsed ? (
        <img src={logoIcon} alt="GRAMA" style={{ width: 26, height: 26, objectFit: "contain" }} />
      ) : (
        <img src={logoFull} alt="GRAMA Proyectos Educativos" style={{ maxWidth: "70%", objectFit: "contain" }} />
      )}
    </Link>
  );
}

// ── Sección colapsable con header navegable ───────────────────────────────────
function Seccion({
  label, collapsed, defaultOpen = false, onNavigate, active, children,
}: {
  label: string;
  collapsed: boolean;
  defaultOpen?: boolean;
  onNavigate: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) return <div style={{ paddingBottom: 4 }}>{children}</div>;

  return (
    <div style={{ marginTop: 4, flexShrink: 0 }}>
      <div style={{ display: "flex", alignItems: "center", padding: "2px 8px 2px 6px" }}>

        {/* Label clickeable → navega al dashboard */}
        <button
          onClick={onNavigate}
          style={{
            flex: 1, display: "flex", alignItems: "center",
            padding: "6px 8px", borderRadius: 8, cursor: "pointer",
            background: active ? "rgba(2,212,126,0.12)" : "none",
            border: "none", textAlign: "left",
            fontFamily: "'Manrope', sans-serif", transition: "background 0.15s",
          }}
          onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(2,212,126,0.07)"; }}
          onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "none"; }}
        >
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: active ? "#02d47e" : "rgba(2,212,126,0.6)",
            fontFamily: "'Manrope', sans-serif", transition: "color 0.15s",
          }}>
            {label}
          </span>
        </button>

        {/* Chevron → solo abre/cierra */}
        <button
          onClick={() => setOpen(v => !v)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "5px 6px", borderRadius: 5,
            color: "rgba(255,255,255,0.2)", lineHeight: 1,
            display: "flex", alignItems: "center", transition: "color 0.15s",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.2)"; }}
        >
          <ChevronRight style={{ width: 12, height: 12, transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.22s" }} />
        </button>
      </div>

      <div style={{ overflow: "hidden", maxHeight: open ? 600 : 0, transition: "max-height 0.28s ease" }}>
        {children}
      </div>
    </div>
  );
}

// ── Item genérico del sidebar ─────────────────────────────────────────────────
function SbItem({
  label, icon: Icon, num, badge, active, onClick, to,
}: {
  label: string;
  icon?: React.ComponentType<{ style?: React.CSSProperties }>;
  num?: string;
  badge?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  to?: string;
}) {
  const style: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 8,
    padding: "6px 9px", borderRadius: 7, cursor: "pointer",
    marginBottom: 1, border: "none", width: "100%", textAlign: "left",
    fontFamily: "'Manrope', sans-serif", textDecoration: "none",
    background: active ? "#02d47e" : "none", transition: "background 0.13s",
  };

  const onEnter = (e: React.MouseEvent<HTMLElement>) => {
    if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
  };
  const onLeave = (e: React.MouseEvent<HTMLElement>) => {
    if (!active) (e.currentTarget as HTMLElement).style.background = "none";
  };

  const inner = (
    <>
      {Icon && <Icon style={{ width: 14, height: 14, flexShrink: 0, color: active ? "#043941" : "rgba(255,255,255,0.38)" }} />}
      {num  && <span style={{ width: 20, fontSize: 10, fontWeight: 800, color: active ? "#043941" : "rgba(255,255,255,0.28)", flexShrink: 0, textAlign: "right" }}>{num}</span>}
      <span style={{ fontSize: 11.5, color: active ? "#043941" : "rgba(255,255,255,0.65)", fontWeight: 500, flex: 1, lineHeight: 1.3 }}>{label}</span>
      {badge}
    </>
  );

  if (to) return <Link to={to} style={style} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</Link>;
  return <button style={style} onClick={onClick} onMouseEnter={onEnter} onMouseLeave={onLeave}>{inner}</button>;
}

const Divider = () => <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "4px 12px" }} />;

// ── Hub Sidebar ───────────────────────────────────────────────────────────────
function HubSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: "8px 6px" }}>
      {!collapsed && (
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase" as const, color: "rgba(2,212,126,0.55)", padding: "6px 12px 4px", display: "block" }}>
          Talleres
        </span>
      )}
      {talleresConfig.map(taller => {
        const Icon = iconMap[taller.icon];
        const isActive = location.pathname.startsWith(`/taller/${taller.slug}`);
        return (
          <SbItem
            key={taller.id}
            label={taller.nombreCorto}
            icon={Icon}
            active={isActive}
            to={`/taller/${taller.slug}`}
            badge={
              !collapsed
                ? <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 100, background: isActive ? "rgba(4,57,65,0.2)" : "rgba(2,212,126,0.12)", color: isActive ? "#043941" : "#02d47e", flexShrink: 0 }}>T{taller.numero}</span>
                : undefined
            }
          />
        );
      })}
    </div>
  );
}

// ── Taller Sidebar ────────────────────────────────────────────────────────────
function TallerSidebar({ slug, taller }: { slug: string; taller: typeof talleresConfig[0] }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const modulos  = useMemo(() => buildModulosForTaller(slug), [slug]);
  const activeLive   = getActiveLiveSession(slug);
  const upcomingLive = getUpcomingLiveSession(slug);
  const hasLive = !!activeLive || !!upcomingLive;
  const TallerIcon = iconMap[taller.icon];

  const exact  = (p: string) => location.pathname === p;
  const starts = (p: string) => location.pathname.startsWith(p);

  return (
    <div style={{ flex: 1, overflowY: "auto" }}>

      {/* Badge taller */}
      {!collapsed && (
        <div
          onClick={() => navigate(`/taller/${slug}`)}
          style={{ margin: "10px 10px 0", padding: "8px 11px", background: "rgba(2,212,126,0.07)", border: "1px solid rgba(2,212,126,0.15)", borderRadius: 10, display: "flex", alignItems: "center", gap: 9, cursor: "pointer", transition: "background 0.15s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(2,212,126,0.14)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(2,212,126,0.07)"; }}
        >
          {TallerIcon && (
            <div style={{ width: 26, height: 26, borderRadius: 6, background: "rgba(2,212,126,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <TallerIcon style={{ width: 14, height: 14, color: "#02d47e" } as React.CSSProperties} />
            </div>
          )}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{taller.nombre}</div>
            <div style={{ fontSize: 8.5, color: "rgba(2,212,126,0.7)", fontWeight: 600, marginTop: 1 }}>T{taller.numero} · MINEDU SFT</div>
          </div>
        </div>
      )}

      {/* ── 1. Presentación del taller ── */}
      <Seccion label="Formación Técnica MINEDU" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/formacion`)} active={exact(`/taller/${slug}/formacion`) || exact(`/taller/${slug}`)}>
        <div style={{ padding: "2px 6px 6px" }}>
          <SbItem label="Inicio del taller"    icon={Home}     active={false} onClick={() => {}} />
          <SbItem label="Programa formativo"   icon={FileText}  active={exact(`/taller/${slug}/formacion`)} to={`/taller/${slug}/formacion`} />
          <SbItem label="Marco transversal"    icon={BookOpen}  active={false} onClick={() => {}} />
          <SbItem label="Competencias"         icon={BarChart2} active={false} onClick={() => {}} />
        </div>
      </Seccion>

      <Divider />

      {/* ── 2. Ruta de Aprendizaje ── */}
      <Seccion label="Ruta de Aprendizaje" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/ruta`)} active={starts(`/taller/${slug}/ruta`) || starts(`/taller/${slug}/modulo`)}>
        <div style={{ padding: "2px 6px 6px" }}>
          {modulos.map(modulo => (
            <SbItem
              key={modulo.id}
              label={modulo.nombre}
              num={String(modulo.orden).padStart(2, "0")}
              active={exact(`/taller/${slug}/modulo/${modulo.orden}`)}
              to={`/taller/${slug}/modulo/${modulo.orden}`}
            />
          ))}
          <SbItem label="Progreso de la ruta" icon={Clock} active={false} onClick={() => {}} />
        </div>
      </Seccion>

      <Divider />

      {/* ── 3. Repositorio del taller ── */}
      <Seccion label="Repositorio del taller" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/repositorio`)} active={starts(`/taller/${slug}/repositorio`)}>
        <div style={{ padding: "2px 6px 6px" }}>
          <SbItem label="Ver todo sobre un equipo" active={location.pathname.startsWith(`/taller/${slug}/catalogo`)} to={`/taller/${slug}/catalogo`} />
          <SbItem label="Ver videos de uso"        icon={Video}    active={false} onClick={() => {}} />
          <SbItem label="Manual de uso"            icon={FileText} active={false} onClick={() => {}} />
          <SbItem label="Ficha IPERC"              icon={Shield}   active={false} onClick={() => {}} />
          <SbItem label="Manual de mantenimiento"  icon={Wrench}   active={false} onClick={() => {}} />
          <SbItem label="Ficha de proveedor"       icon={FileText} active={false} onClick={() => {}} />
        </div>
      </Seccion>

      <Divider />

      {/* ── 4. Sesiones ── */}
      <Seccion label="Sesiones" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/sesiones`)} active={starts(`/taller/${slug}/sesiones`) || location.pathname.includes("/live")}>
        <div style={{ padding: "2px 6px 8px" }}>
          <SbItem
            label="Sesiones en Vivo"
            icon={Radio}
            active={location.pathname.includes("/live")}
            to={`/taller/${slug}/modulo/1/live`}
            badge={hasLive
              ? <span style={{ fontSize: 8, fontWeight: 700, padding: "1px 6px", borderRadius: 100, background: "rgba(239,68,68,0.2)", color: "#f87171", flexShrink: 0 }}>● Live</span>
              : undefined
            }
          />
          <SbItem label="Sesiones asíncronas" active={false} onClick={() => {}} />
        </div>
      </Seccion>

    </div>
  );
}

// ── AppSidebar principal ──────────────────────────────────────────────────────
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed  = state === "collapsed";
  const location   = useLocation();

  const tallerMatch  = location.pathname.match(/^\/taller\/([^/]+)/);
  const currentSlug  = tallerMatch ? tallerMatch[1] : null;
  const currentTaller = currentSlug ? talleresConfig.find(t => t.slug === currentSlug) : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader style={{ background: "#043941", padding: "14px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <LogoGrama collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent style={{ background: "#043941" }}>
        {currentTaller && currentSlug
          ? <TallerSidebar slug={currentSlug} taller={currentTaller} />
          : <HubSidebar />
        }
      </SidebarContent>

      <SidebarFooter style={{ background: "#043941", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Mi Perfil">
              <NavLink to="/perfil" className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" activeClassName="bg-grama-green text-grama-green-foreground font-medium">
                <User className="h-4 w-4 shrink-0" /><span>Mi Perfil</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Salir">
              <NavLink to="/" className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" activeClassName="">
                <LogOut className="h-4 w-4 shrink-0" /><span>Salir</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
