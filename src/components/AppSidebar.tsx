import { useLocation, Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { talleresConfig } from "@/data/talleresConfig";
import { getTotalBienesByTaller } from "@/data/bienesData";
import { buildModulosForTaller, getActiveLiveSession, getUpcomingLiveSession } from "@/data/modulosConfig";
import { useMemo } from "react";
import {
  Car, Scissors, ChefHat, Hammer, Monitor, Cpu,
  UtensilsCrossed, Zap, Wrench, Home, Package, Radio,
  User, LogOut, FileText, Clock, BarChart2, BookOpen,
  Video, Shield, Grid,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Car, Scissors, ChefHat, Hammer, Monitor, Cpu, UtensilsCrossed, Zap, Wrench,
};

const moduloEmojis = ["📦", "🔬", "💡", "🏪", "📋", "🚀"];

// ── Logo GRAMA — SVG fiel al manual de marca ──────────────────────────────────
function LogoGrama({ collapsed }: { collapsed: boolean }) {
  return (
    <Link to="/" className="flex items-center overflow-hidden group">
      <div style={{ display: "flex", alignItems: "center", gap: collapsed ? 0 : 9, transition: "gap 0.2s" }}>

        {/* Isotipo: G geométrica — versión blanca/menta sobre fondo oscuro */}
        <svg
          width="28"
          height="28"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ flexShrink: 0, opacity: 0.92 }}
          className="group-hover:opacity-100 transition-opacity"
        >
          {/*
            Reconstrucción del isotipo GRAMA basado en el manual:
            - G geométrica estilo tangram
            - Colores: verde menta #02d47e (principal) + verde claro #d2ffe1 (reflejo)
            - Sobre fondo oscuro #043941
          */}

          {/* Cuerpo principal de la G — arco exterior */}
          <path
            d="M15 50 C15 29 29 15 50 15 C66 15 79 24 85 37 L68 37 C64 31 57 27 50 27 C36 27 27 36 27 50 C27 64 36 73 50 73 C60 73 68 67 72 58 L52 58 L52 46 L85 46 L85 58 C79 76 66 85 50 85 C29 85 15 71 15 50 Z"
            fill="#02d47e"
          />

          {/* Triángulo reflejo (tangram) — verde claro 1 */}
          <path
            d="M27 50 L27 30 L48 50 Z"
            fill="#d2ffe1"
            opacity="0.85"
          />

          {/* Triángulo oscuro interior para darle profundidad */}
          <path
            d="M27 30 L48 50 L27 50 Z"
            fill="#00c16e"
            opacity="0.5"
          />
        </svg>

        {/* Wordmark — solo visible cuando no está colapsado */}
        {!collapsed && (
          <div style={{ display: "flex", flexDirection: "column", gap: 1, lineHeight: 1 }}>
            {/* "GRAMA" en verde menta, Manrope ExtraBold */}
            <span style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: "#02d47e",
              letterSpacing: "0.06em",
              lineHeight: 1,
            }}>
              GRAMA
            </span>
            {/* "PROYECTOS EDUCATIVOS" subtítulo */}
            <span style={{
              fontFamily: "'Manrope', sans-serif",
              fontWeight: 500,
              fontSize: 7,
              color: "rgba(255,255,255,0.38)",
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              lineHeight: 1,
              marginTop: 2,
            }}>
              Proyectos Educativos
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

// ── Hub Sidebar ───────────────────────────────────────────────────────────────
function HubSidebar() {
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
                <NavLink to="/" end
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-semibold">
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
              return (
                <SidebarMenuItem key={taller.id}>
                  <SidebarMenuButton asChild tooltip={taller.nombreCorto}>
                    <NavLink to={`/taller/${taller.slug}`}
                      className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      activeClassName="bg-grama-green text-grama-green-foreground font-medium">
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="flex-1 truncate">{taller.nombreCorto}</span>
                      {!collapsed && (
                        <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold bg-grama-green text-grama-green-foreground">
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

// ── Taller Sidebar ────────────────────────────────────────────────────────────
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

      {/* Badge del taller activo — solo en modo expandido */}
      {!collapsed && (
        <div style={{
          margin: "10px 10px 0",
          padding: "9px 11px",
          background: "rgba(2,212,126,0.06)",
          border: "1px solid rgba(2,212,126,0.15)",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          gap: 9,
        }}>
          {TallerIcon && (
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "rgba(2,212,126,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <TallerIcon className="h-4 w-4" style={{ color: "#02d47e" }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
              {taller.nombre}
            </div>
            <div style={{ fontSize: 9, color: "rgba(2,212,126,0.7)", fontWeight: 600, marginTop: 1 }}>
              T{taller.numero} · MINEDU SFT
            </div>
          </div>
        </div>
      )}

      {/* ── Presentación del taller ── */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Presentación del taller
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Inicio">
                <NavLink to={`/taller/${slug}`} end
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-semibold">
                  {TallerIcon
                    ? <TallerIcon className="h-4 w-4 shrink-0" />
                    : <Home className="h-4 w-4 shrink-0" />}
                  <span className="flex-1 truncate">{taller.nombreCorto}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Programa formativo">
                <NavLink to={`/taller/${slug}/catalogo`}
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="bg-grama-green text-grama-green-foreground font-medium">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span>Programa formativo</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* ── Ruta de Aprendizaje ── */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Ruta de aprendizaje
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {modulos.map((modulo) => {
              const isActive = location.pathname === `/taller/${slug}/modulo/${modulo.orden}`;
              const isFinal = modulo.orden === modulos.length;
              return (
                <SidebarMenuItem key={modulo.id}>
                  <SidebarMenuButton asChild tooltip={`${modulo.orden}. ${modulo.nombre}`}>
                    <Link to={`/taller/${slug}/modulo/${modulo.orden}`}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                        isActive
                          ? "bg-grama-green text-grama-green-foreground font-medium"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      }`}>
                      {!collapsed && (
                        <span style={{
                          fontSize: 10,
                          fontWeight: 800,
                          color: isActive ? "inherit" : isFinal ? "#02d47e" : "rgba(255,255,255,0.3)",
                          width: 18,
                          textAlign: "right",
                          flexShrink: 0,
                        }}>
                          {String(modulo.orden).padStart(2, "0")}
                        </span>
                      )}
                      <span className="flex-1 truncate">{modulo.nombre}</span>
                      {isFinal && !collapsed && (
                        <span style={{
                          fontSize: 8,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 100,
                          background: "rgba(2,212,126,0.15)",
                          color: "#02d47e",
                          flexShrink: 0,
                        }}>
                          🎓
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* ── Repositorio ── */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Repositorio
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {[
              { label: "Ver todos los equipos", icon: Grid,     to: `repositorio` },
              { label: "Videos de uso",          icon: Video,    to: `repositorio` },
              { label: "Manuales",               icon: FileText, to: `repositorio` },
              { label: "Fichas IPERC",           icon: Shield,   to: `repositorio` },
            ].map(({ label, icon: Icon, to }) => (
              <SidebarMenuItem key={label}>
                <SidebarMenuButton asChild tooltip={label}>
                  <NavLink to={`/taller/${slug}/${to}`}
                    className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    activeClassName="bg-grama-green text-grama-green-foreground font-medium">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {/* ── Sesiones ── */}
      <SidebarGroup>
        <SidebarGroupLabel className="text-[9px] font-bold tracking-[0.18em] text-sidebar-foreground/40 uppercase">
          Sesiones
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sesiones en Vivo">
                <Link to={`/taller/${slug}/modulo/1/live`}
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-sm transition-colors ${
                    location.pathname.includes("/live")
                      ? "bg-grama-green text-grama-green-foreground font-medium"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  }`}>
                  <div className="relative">
                    <Radio className="h-4 w-4 shrink-0" />
                    {hasLive && (
                      <>
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full animate-ping bg-red-400" />
                        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-400" />
                      </>
                    )}
                  </div>
                  <span>Sesiones en vivo</span>
                  {hasLive && !collapsed && (
                    <span style={{
                      fontSize: 8, fontWeight: 700, padding: "2px 6px",
                      borderRadius: 100, background: "rgba(239,68,68,0.18)",
                      color: "#f87171", flexShrink: 0,
                    }}>
                      ● Live
                    </span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Sesiones grabadas">
                <NavLink to={`/taller/${slug}/repositorio`}
                  className="text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  activeClassName="">
                  <Video className="h-4 w-4 shrink-0" />
                  <span>Sesiones grabadas</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

    </SidebarContent>
  );
}

// ── AppSidebar principal ──────────────────────────────────────────────────────
export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  const tallerMatch = location.pathname.match(/^\/taller\/([^/]+)/);
  const currentSlug = tallerMatch ? tallerMatch[1] : null;
  const currentTaller = currentSlug ? talleresConfig.find((t) => t.slug === currentSlug) : null;

  return (
    <Sidebar collapsible="icon">

      {/* ── Header con logo oficial GRAMA ── */}
      <SidebarHeader
        className="border-b border-sidebar-border"
        style={{ background: "#043941", padding: "14px 14px" }}
      >
        <LogoGrama collapsed={collapsed} />
      </SidebarHeader>

      {/* ── Contenido según contexto ── */}
      {currentTaller && currentSlug
        ? <TallerSidebar slug={currentSlug} taller={currentTaller} />
        : <HubSidebar />
      }

      {/* ── Footer ── */}
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

    </Sidebar>
  );
}
