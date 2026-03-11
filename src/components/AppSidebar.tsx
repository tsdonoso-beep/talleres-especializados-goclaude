import { useLocation, Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { talleresConfig } from "@/data/talleresConfig";
import { getTotalBienesByTaller } from "@/data/bienesData";
import { buildModulosForTaller, getActiveLiveSession, getUpcomingLiveSession } from "@/data/modulosConfig";
import { useMemo } from "react";
import {
  Car, Scissors, ChefHat, Hammer, Monitor, Cpu, UtensilsCrossed, Zap, Wrench,
  Home, Package, Radio, User, LogOut,
} from "lucide-react";
import logoGramaFull from "@/assets/logo-grama-full.png";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Car, Scissors, ChefHat, Hammer, Monitor, Cpu, UtensilsCrossed, Zap, Wrench,
};

const moduloEmojis = ["📦", "🔬", "💡", "🏪", "📋", "🚀"];

// ── Hub Sidebar (lista de talleres) ──
function HubSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Navegación
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Inicio">
                <NavLink to="/" end className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" activeClassName="bg-grama-green text-grama-green-foreground font-semibold">
                  <Home className="h-4 w-4 shrink-0" />
                  <span>Inicio</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Talleres
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {talleresConfig.map((taller) => {
              const Icon = iconMap[taller.icon];
              const isActive = location.pathname.startsWith(`/taller/${taller.slug}`);
              return (
                <SidebarMenuItem key={taller.id}>
                  <SidebarMenuButton asChild tooltip={taller.nombreCorto}>
                    <NavLink
                      to={`/taller/${taller.slug}`}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="bg-grama-green text-grama-green-foreground font-medium"
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="flex-1 truncate">{taller.nombreCorto}</span>
                      {!collapsed && (
                        <span className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-grama-green text-grama-green-foreground"}`}>
                          T{taller.numero}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

// ── Taller Sidebar (6 módulos + repositorio + live) ──
function TallerSidebar({ slug, taller }: { slug: string; taller: typeof talleresConfig[0] }) {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const modulos = useMemo(() => buildModulosForTaller(slug), [slug]);
  const activeLive = getActiveLiveSession(slug);
  const upcomingLive = getUpcomingLiveSession(slug);
  const hasLive = !!activeLive || !!upcomingLive;
  const TallerIcon = iconMap[taller.icon];

  return (
    <SidebarContent>
      {/* Navegación */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Navegación
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {/* Inicio global */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Inicio">
                <NavLink to="/" end
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-semibold">
                  <Home className="h-4 w-4 shrink-0" />
                  <span>Inicio</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            {/* Home del taller — NUEVO */}
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={taller.nombreCorto}>
                <NavLink
                  to={`/taller/${slug}`}
                  end
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-semibold"
                >
                  {TallerIcon && <TallerIcon className="h-4 w-4 shrink-0" />}
                  <span className="flex-1 truncate">{taller.nombreCorto}</span>
                  {!collapsed && (
                    <span className="shrink-0 text-[9px] font-bold text-sidebar-foreground/40">
                      T{taller.numero}
                    </span>
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Ruta de Aprendizaje */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Ruta de Aprendizaje
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {modulos.map((modulo) => {
              const isActive = location.pathname === `/taller/${slug}/modulo/${modulo.orden}`;
              return (
                <SidebarMenuItem key={modulo.id}>
                  <SidebarMenuButton asChild tooltip={`${modulo.orden}. ${modulo.nombre}`}>
                    <Link
                      to={`/taller/${slug}/modulo/${modulo.orden}`}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-grama-green text-grama-green-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}
                    >
                      {!collapsed && <span className="text-xs">{moduloEmojis[modulo.orden - 1]}</span>}
                      <span className="flex-1 truncate">{modulo.orden}. {modulo.nombre}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Repositorio */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Repositorio
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Repositorio de Productos">
                <NavLink
                  to={`/taller/${slug}/repositorio`}
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-medium"
                >
                  <Package className="h-4 w-4 shrink-0" />
                  <span>Repositorio de Productos</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* Sesiones en Vivo */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Sesiones
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sesiones en Vivo">
                <Link
                  to={`/taller/${slug}/modulo/1/live`}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                    location.pathname.includes("/live")
                      ? "bg-grama-green text-grama-green-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}
                >
                  <div className="relative">
                    <Radio className="h-4 w-4 shrink-0" />
                    {hasLive && (
                      <>
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full animate-ping" style={{ background: "hsl(var(--tag-pdf-text))" }} />
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full" style={{ background: "hsl(var(--tag-pdf-text))" }} />
                      </>
                    )}
                  </div>
                  <span>Sesiones en Vivo</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const tallerMatch = location.pathname.match(/^\/taller\/([^/]+)/);
  const currentSlug = tallerMatch ? tallerMatch[1] : null;
  const currentTaller = currentSlug ? talleresConfig.find((t) => t.slug === currentSlug) : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-3 py-4">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden group">
          <img src={logoGrama} alt="GRAMA" className="h-8 w-auto shrink-0 group-hover:opacity-80 transition-opacity" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-[11px] font-extrabold tracking-wide text-sidebar-foreground uppercase">GRAMA</p>
              <p className="text-[9px] font-semibold tracking-widest text-sidebar-foreground/50 uppercase">Proyectos Educativos</p>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {currentTaller && currentSlug ? (
        <TallerSidebar slug={currentSlug} taller={currentTaller} />
      ) : (
        <HubSidebar />
      )}

      {currentTaller && (
        <SidebarFooter className="border-t border-sidebar-border">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Mi Perfil">
                <NavLink to="/perfil"
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-medium">
                  <User className="h-4 w-4 shrink-0" />
                  <span>Mi Perfil</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Salir">
                <NavLink to="/"
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="">
                  <LogOut className="h-4 w-4 shrink-0" />
                  <span>Salir</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
