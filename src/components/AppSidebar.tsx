import { useLocation, Link, useNavigate } from "react-router-dom";
import logoFull from "@/assets/logo-grama-full.png";
import logoIcon from "@/assets/logo-grama.png";
import { NavLink } from "@/components/NavLink";
import { talleresConfig } from "@/data/talleresConfig";
import { talleres, type TallerId } from "@/lib/tokens";
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

// ── Logo GRAMA ──
function LogoGrama({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/" className="flex items-center justify-center no-underline w-full" style={{ padding: collapsed ? "2px 0" : "4px 0" }}>
      {collapsed ? (
        <img src={logoIcon} alt="GRAMA" className="w-[26px] h-[26px] object-contain" />
      ) : (
        <img src={logoFull} alt="GRAMA Proyectos Educativos" className="max-w-[70%] object-contain" />
      )}
    </Link>
  );
}

// ── Sección colapsable con header navegable ──
function Seccion({
  label, collapsed, defaultOpen = false, onNavigate, active, children,
}: {
  label: string; collapsed: boolean; defaultOpen?: boolean;
  onNavigate: () => void; active?: boolean; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  if (collapsed) return <div className="pb-1">{children}</div>;

  return (
    <div className="mt-1 flex-shrink-0">
      <div className="flex items-center px-2 pl-1.5">
        <button
          onClick={onNavigate}
          className="flex-1 flex items-center px-2 py-1.5 rounded-lg cursor-pointer border-none text-left font-brand transition-colors"
          style={{ background: active ? "rgba(2,212,126,0.12)" : "none" }}
          onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "rgba(2,212,126,0.07)"; }}
          onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "none"; }}
        >
          <span className="text-[9px] font-bold tracking-[0.12em] uppercase font-brand transition-colors"
            style={{ color: active ? "#02d47e" : "rgba(2,212,126,0.6)" }}>
            {label}
          </span>
        </button>

        <button
          onClick={() => setOpen(v => !v)}
          className="bg-transparent border-none cursor-pointer p-1.5 rounded flex items-center text-white/20 leading-none transition-colors hover:text-white/45"
        >
          <ChevronRight className="w-3 h-3 transition-transform" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }} />
        </button>
      </div>

      <div className="overflow-hidden transition-all" style={{ maxHeight: open ? 600 : 0, transitionDuration: "280ms", transitionTimingFunction: "ease" }}>
        {children}
      </div>
    </div>
  );
}

// ── Item genérico del sidebar ──
function SbItem({
  label, icon: Icon, num, badge, active, onClick, to,
}: {
  label: string; icon?: React.ComponentType<{ style?: React.CSSProperties }>;
  num?: string; badge?: React.ReactNode; active?: boolean;
  onClick?: () => void; to?: string;
}) {
  const cls = "flex items-center gap-2 px-2.5 py-1.5 cursor-pointer mb-px border-none w-full text-left font-brand no-underline transition-colors";

  const inner = (
    <>
      {Icon && <Icon style={{ width: 14, height: 14, flexShrink: 0, color: active ? "#02d47e" : "rgba(255,255,255,0.38)" }} />}
      {num && <span className="w-5 text-[10px] font-extrabold flex-shrink-0 text-right" style={{ color: active ? "#02d47e" : "rgba(255,255,255,0.28)" }}>{num}</span>}
      <span className="text-[11.5px] font-medium flex-1 leading-snug" style={{ color: active ? "#02d47e" : "rgba(255,255,255,0.65)" }}>{label}</span>
      {badge}
    </>
  );

  const activeStyle: React.CSSProperties = {
    background: "rgba(2,212,126,0.15)",
    borderLeft: "2.5px solid #02d47e",
    borderRadius: "0 7px 7px 0",
  };
  const inactiveStyle: React.CSSProperties = {
    background: "transparent",
    borderLeft: "2.5px solid transparent",
    borderRadius: "0 7px 7px 0",
  };
  const hoverBg = "rgba(255,255,255,0.06)";

  if (to) return (
    <Link to={to} className={cls} style={active ? activeStyle : inactiveStyle}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = hoverBg; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
      {inner}
    </Link>
  );
  return (
    <button className={cls} onClick={onClick} style={active ? activeStyle : inactiveStyle}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = hoverBg; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}>
      {inner}
    </button>
  );
}

const Divider = () => <div className="h-px bg-white/[0.05] mx-3 my-1" />;

// ── Hub Sidebar ──
function HubSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [showAll, setShowAll] = useState(false);

  const VISIBLE_COUNT = 3;
  const visibleTalleres = showAll ? talleresConfig : talleresConfig.slice(0, VISIBLE_COUNT);
  const remaining = talleresConfig.length - VISIBLE_COUNT;

  return (
    <div className="flex-1 overflow-y-auto p-2 pl-1.5">
      {!collapsed && (
        <span className="text-[9px] font-bold tracking-[0.13em] uppercase text-white/40 px-3 pt-1.5 pb-1 block">
          Talleres
        </span>
      )}
      {visibleTalleres.map(taller => {
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
                ? (() => {
                    const tid = `T${taller.numero}` as TallerId;
                    const t = talleres[tid];
                    return (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-ds-pill flex-shrink-0"
                        style={{
                          background: t.accent,
                          color: t.textOnAccent,
                        }}>T{taller.numero}</span>
                    );
                  })()
                : undefined
            }
          />
        );
      })}
      {!collapsed && !showAll && remaining > 0 && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full text-left px-2.5 py-1.5 text-[11px] text-white/40 hover:text-white/60 font-medium bg-transparent border-none cursor-pointer font-brand transition-colors"
        >
          + {remaining} talleres más...
        </button>
      )}
    </div>
  );
}

// ── Taller Sidebar ──
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
    <div className="flex-1 overflow-y-auto">

      {/* Badge taller */}
      {!collapsed && (
        <div
          onClick={() => navigate(`/taller/${slug}`)}
          className="mx-2.5 mt-2.5 p-2 px-3 bg-g-mint/[0.07] border border-g-mint/15 rounded-ds-md flex items-center gap-2 cursor-pointer transition-colors hover:bg-g-mint/[0.14]"
        >
          {TallerIcon && (
            <div className="w-[26px] h-[26px] rounded-ds-sm bg-g-mint/[0.12] flex items-center justify-center flex-shrink-0">
              <TallerIcon style={{ width: 14, height: 14, color: "#02d47e" } as React.CSSProperties} />
            </div>
          )}
          <div>
            <div className="text-[11px] font-bold text-white leading-tight">{taller.nombre}</div>
            <div className="text-[8.5px] text-g-mint/70 font-semibold mt-px">T{taller.numero} · MINEDU SFT</div>
          </div>
        </div>
      )}

      {/* 1. Presentación del taller */}
      <Seccion label="Formación Técnica MINEDU" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/formacion`)} active={exact(`/taller/${slug}/formacion`) || exact(`/taller/${slug}`)}>
        <div className="px-1.5 py-0.5 pb-1.5">
          <SbItem label="Inicio del taller"    icon={Home}     active={false} onClick={() => {}} />
          <SbItem label="Programa formativo"   icon={FileText}  active={exact(`/taller/${slug}/formacion`)} to={`/taller/${slug}/formacion`} />
          <SbItem label="Marco transversal"    icon={BookOpen}  active={false} onClick={() => {}} />
          <SbItem label="Competencias"         icon={BarChart2} active={false} onClick={() => {}} />
        </div>
      </Seccion>

      <Divider />

      {/* 2. Ruta de Aprendizaje */}
      <Seccion label="Ruta de Aprendizaje" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/ruta`)} active={starts(`/taller/${slug}/ruta`) || starts(`/taller/${slug}/modulo`)}>
        <div className="px-1.5 py-0.5 pb-1.5">
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

      {/* 3. Repositorio del taller */}
      <Seccion label="Repositorio del taller" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/repositorio`)} active={starts(`/taller/${slug}/repositorio`)}>
        <div className="px-1.5 py-0.5 pb-1.5">
          <SbItem label="Ver todo sobre un equipo" active={location.pathname.startsWith(`/taller/${slug}/catalogo`)} to={`/taller/${slug}/catalogo`} />
          <SbItem label="Ver videos de uso"        icon={Video}    active={false} onClick={() => {}} />
          <SbItem label="Manual de uso"            icon={FileText} active={false} onClick={() => {}} />
          <SbItem label="Ficha IPERC"              icon={Shield}   active={false} onClick={() => {}} />
          <SbItem label="Manual de mantenimiento"  icon={Wrench}   active={false} onClick={() => {}} />
          <SbItem label="Ficha de proveedor"       icon={FileText} active={false} onClick={() => {}} />
        </div>
      </Seccion>

      <Divider />

      {/* 4. Sesiones */}
      <Seccion label="Sesiones" collapsed={collapsed} onNavigate={() => navigate(`/taller/${slug}/sesiones`)} active={starts(`/taller/${slug}/sesiones`) || location.pathname.includes("/live")}>
        <div className="px-1.5 py-0.5 pb-2">
          <SbItem
            label="Sesiones en Vivo"
            icon={Radio}
            active={location.pathname.includes("/live")}
            to={`/taller/${slug}/modulo/1/live`}
            badge={hasLive
              ? <span className="text-[8px] font-bold px-1.5 py-px rounded-ds-pill bg-destructive/20 text-destructive/80 flex-shrink-0">● Live</span>
              : undefined
            }
          />
          <SbItem label="Sesiones asíncronas" active={false} onClick={() => {}} />
        </div>
      </Seccion>

    </div>
  );
}

// ── AppSidebar principal ──
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed  = state === "collapsed";
  const location   = useLocation();

  const tallerMatch  = location.pathname.match(/^\/taller\/([^/]+)/);
  const currentSlug  = tallerMatch ? tallerMatch[1] : null;
  const currentTaller = currentSlug ? talleresConfig.find(t => t.slug === currentSlug) : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-sidebar border-b border-white/[0.06] px-3.5 py-3.5">
        <LogoGrama collapsed={collapsed} />
      </SidebarHeader>

      <SidebarContent className="bg-sidebar">
        {currentTaller && currentSlug
          ? <TallerSidebar slug={currentSlug} taller={currentTaller} />
          : <HubSidebar />
        }
      </SidebarContent>

      <SidebarFooter className="bg-sidebar border-t border-white/[0.05]">
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
