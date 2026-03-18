import { useParams, Link } from "react-router-dom";
import { useMemo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getTallerDashboardData } from "@/data/tallerDashboardData";
import { buildModulosForTaller } from "@/data/modulosConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getTotalBienesByTaller } from "@/data/bienesData";

// ── Helpers visuales ──
const SectionTag = ({ label }: { label: string }) => (
  <div className="grama-section-tag">{label}</div>
);

// ── Marco transversal — datos fijos MINEDU ──
const MARCO_TRANSVERSAL = [
  { icon: "🤖", label: "IA Generativa",        desc: "Uso ético de herramientas de inteligencia artificial en el taller" },
  { icon: "🔵", label: "Google Workspace",      desc: "Documentación colaborativa, Drive, Classroom y Meet" },
  { icon: "🏭", label: "Metodología 5S",         desc: "Orden, limpieza y eficiencia en el espacio de trabajo técnico" },
  { icon: "💡", label: "Design Thinking",        desc: "Resolución creativa de problemas orientada al usuario" },
  { icon: "🚀", label: "Running Lean",           desc: "Emprendimiento ágil y validación de ideas con recursos mínimos" },
];

const METAS = [
  { val: "1,440", label: "Horas de formación" },
  { val: "5",     label: "Grados" },
  { val: "Aux.",  label: "Nivel técnico" },
];

// ── COMPONENTE PRINCIPAL ──
export default function FormacionTecnicaPage() {
  const { slug } = useParams<{ slug: string }>();
  const taller      = getTallerBySlug(slug ?? "");
  const data        = useMemo(() => getTallerDashboardData(slug ?? ""), [slug]);
  const modulos     = useMemo(() => buildModulosForTaller(slug ?? ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug ?? ""), [slug]);

  if (!taller) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Link to="/" className="text-g-mint font-bold no-underline">← Volver al Hub</Link>
      </div>
    );
  }

  return (
    <main className="grama-page" style={{ background: "#f7fdfb" }}>

      {/* ── HERO ── */}
      <section className="grama-hero" style={{ padding: "clamp(2.5rem,6vw,4rem) clamp(1.5rem,5vw,4rem)" }}>
        {/* Extra decorative */}
        <div className="absolute top-[-80px] right-[-80px] w-60 h-60 bg-g-mint/[0.06] rounded-xl rotate-45 pointer-events-none" />

        <div>
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-5">
            <SidebarTrigger className="text-white/50 hover:text-white hover:bg-white/10 -ml-1" />
            <Link to={`/taller/${slug}`} className="grama-breadcrumb grama-breadcrumb-muted no-underline" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              {taller.nombre}
            </Link>
            <span className="text-white/20 text-[0.7rem]">›</span>
            <span className="grama-breadcrumb grama-breadcrumb-active" style={{ fontSize: "0.7rem", letterSpacing: "0.08em" }}>
              Formación Técnica MINEDU
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-g-mint/10 border border-g-mint/20 text-g-mint rounded-ds-pill px-3 py-1 text-[0.68rem] font-bold tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: data.tallerAccent }} />
            Secundaria con Formación Técnica · SFT
          </div>

          <h1 className="font-extrabold text-white leading-[1.05] mb-3" style={{ fontSize: "clamp(1.8rem,3.5vw,2.6rem)", letterSpacing: "-0.03em" }}>
            Programa <span className="text-g-mint">Formativo</span><br />
            <span style={{ color: data.tallerAccent }}>{taller.nombre}</span>
          </h1>
          <p className="text-[0.9rem] text-white/55 leading-relaxed max-w-[520px] mb-7">
            {data.presentacion}
          </p>

          {/* Stats */}
          <div className="flex gap-8 pt-6 border-t border-white/[0.07] flex-wrap">
            {[
              { val: String(totalBienes || "–"), label: "Bienes del taller" },
              { val: String(modulos.length),       label: "Módulos" },
              { val: data.horasFormacion,           label: "Horas formación" },
              { val: data.nivelEgreso,              label: "Nivel de egreso" },
            ].map(s => (
              <div key={s.label}>
                <div className="grama-stat-val" style={{ fontSize: "1.4rem" }}>{s.val}</div>
                <div className="grama-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NAV INTERNA ── */}
      <nav className="bg-white border-b border-secondary/[0.08] sticky top-0 z-30 flex gap-1 overflow-x-auto" style={{ padding: "0 clamp(1.5rem,5vw,4rem)" }}>
        {[
          { label: "Programa formativo", href: `#programa` },
          { label: "Perfil de egreso",   href: `#perfil` },
          { label: "Competencias",        href: `#competencias` },
          { label: "Marco transversal",   href: `#marco` },
          { label: "Zonas del taller",    href: `#zonas` },
        ].map(item => (
          <a key={item.label} href={item.href}
            className="text-[0.8rem] font-semibold text-secondary/50 py-3.5 px-3 border-b-2 border-transparent no-underline whitespace-nowrap transition-all hover:text-g-mint hover:border-g-mint/40">
            {item.label}
          </a>
        ))}
      </nav>

      <div style={{ padding: "clamp(2rem,5vw,3.5rem) clamp(1.5rem,5vw,4rem)" }} className="flex flex-col gap-12">

        {/* ── 1. PROGRAMA FORMATIVO ── */}
        <section id="programa">
          <SectionTag label="Formación Técnica MINEDU" />
          <h2 className="font-extrabold text-secondary tracking-tight mb-6" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
            Programa <span className="text-g-mint">Formativo</span>
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {METAS.map(m => (
              <div key={m.label} className="bg-secondary rounded-[14px] p-6 flex flex-col gap-1">
                <div className="text-3xl font-extrabold text-g-mint tracking-tighter leading-none">{m.val}</div>
                <div className="text-[0.72rem] text-white/45 uppercase tracking-widest">{m.label}</div>
              </div>
            ))}
            <div className="rounded-[14px] p-6 flex flex-col gap-1 border" style={{ background: `${data.tallerAccent}18`, borderColor: `${data.tallerAccent}30` }}>
              <div className="text-3xl font-extrabold tracking-tighter leading-none" style={{ color: data.tallerAccent }}>{totalBienes || "–"}</div>
              <div className="text-[0.72rem] text-secondary/50 uppercase tracking-widest">Bienes del taller</div>
            </div>
          </div>

          {/* Descripción del programa */}
          <div className="bg-white border border-secondary/[0.08] rounded-[14px] p-6">
            <div className="text-[0.7rem] font-bold uppercase tracking-widest text-g-mint mb-3">Sobre el programa</div>
            <p className="text-[0.9rem] text-secondary/70 leading-relaxed">
              Programa del <strong>Ministerio de Educación del Perú</strong> dentro del modelo{" "}
              <em>Secundaria con Formación Técnica (SFT)</em>. Forma al estudiante como{" "}
              <strong>{data.nivelEgreso}</strong> en {taller.nombre} con{" "}
              <strong>{data.horasFormacion} horas</strong> de formación a lo largo de 5 grados.
            </p>
            <div className="mt-5 pt-5 border-t border-secondary/[0.06]">
              <Link to={`/taller/${slug}/catalogo`} className="grama-btn-primary inline-flex items-center gap-1.5 text-[0.8rem] py-2 px-5 no-underline">
                Ver catálogo completo →
              </Link>
            </div>
          </div>
        </section>

        {/* ── 2. PERFIL DE EGRESO ── */}
        <section id="perfil">
          <SectionTag label="Perfil de egreso" />
          <h2 className="font-extrabold text-secondary tracking-tight mb-6" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
            ¿Qué sabe hacer el <span className="text-g-mint">egresado?</span>
          </h2>

          <div className="flex flex-col gap-3">
            {data.perfilEgreso.map((item, i) => (
              <div key={i} className="grama-card p-4 flex items-start gap-4">
                <span className="text-xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <p className="text-sm text-secondary/70 leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── 3. UNIDADES DE COMPETENCIA ── */}
        <section id="competencias">
          <SectionTag label="Competencias MINEDU" />
          <h2 className="font-extrabold text-secondary tracking-tight mb-6" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
            Unidades de <span className="text-g-mint">Competencia</span>
          </h2>

          <div className="flex flex-col gap-2.5">
            {data.unidadesCompetencia.map((uc, i) => (
              <div key={i} className="grama-card p-4 flex items-center gap-5">
                <div className="w-9 h-9 rounded-ds-md flex-shrink-0 flex items-center justify-center text-[0.78rem] font-extrabold"
                  style={{ background: `${data.tallerAccent}15`, color: data.tallerAccent }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p className="text-sm text-secondary font-medium leading-relaxed flex-1">{uc}</p>
                <div className="text-[0.65rem] bg-secondary/[0.06] text-secondary/40 px-2 py-0.5 rounded-ds-pill font-bold flex-shrink-0">
                  UC {String(i + 1).padStart(2, "0")}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 4. MARCO TRANSVERSAL ── */}
        <section id="marco" className="bg-secondary rounded-[20px] p-10">
          <div className="mb-6">
            <SectionTag label="Competencias transversales" />
            <h2 className="font-extrabold text-white tracking-tight" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
              Marco <span className="text-g-mint">Transversal</span>
            </h2>
            <p className="text-[0.85rem] text-white/45 mt-2 max-w-[520px]">
              Competencias que atraviesan todos los módulos del programa y preparan al estudiante para el mundo laboral del siglo XXI.
            </p>
          </div>

          <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
            {MARCO_TRANSVERSAL.map((item) => (
              <div key={item.label} className="bg-white/[0.05] border border-g-mint/10 rounded-ds-lg p-5 transition-all hover:bg-white/[0.08] hover:border-g-mint/30">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="text-[0.85rem] font-bold text-white mb-1.5">{item.label}</div>
                <div className="text-[0.75rem] text-white/45 leading-relaxed">{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 5. ZONAS DEL TALLER ── */}
        <section id="zonas">
          <SectionTag label="Infraestructura" />
          <h2 className="font-extrabold text-secondary tracking-tight mb-6" style={{ fontSize: "clamp(1.4rem,3vw,2rem)" }}>
            Zonas del <span className="text-g-mint">Taller</span>
          </h2>

          <div className="flex flex-col gap-3">
            {data.inventoryZones.map((zone, i) => (
              <div key={i} className="grama-card p-5 flex items-center gap-5">
                <div className="w-11 h-11 rounded-ds-md flex items-center justify-center text-xl flex-shrink-0" style={{ background: `${data.tallerAccent}15` }}>
                  {zone.icon}
                </div>
                <div className="flex-1">
                  <div className="text-[0.9rem] font-bold text-secondary">{zone.name}</div>
                  <div className="text-[0.8rem] text-secondary/50 mt-0.5">{zone.desc}</div>
                </div>
                <div className="bg-g-light text-secondary text-[0.7rem] font-bold px-3 py-1 rounded-ds-pill flex-shrink-0 whitespace-nowrap">
                  {zone.count} bienes
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA: ir al catálogo ── */}
        <div className="grama-cta-bar">
          <div>
            <div className="font-bold text-white text-base">¿Listo para explorar el programa?</div>
            <div className="text-[0.8rem] text-white/50 mt-0.5">
              Accede al catálogo completo de unidades didácticas, sesiones y recursos por módulo.
            </div>
          </div>
          <Link to={`/taller/${slug}/catalogo`} className="grama-btn-primary text-sm py-2.5 px-6 no-underline whitespace-nowrap">
            Ver catálogo →
          </Link>
        </div>

      </div>
    </main>
  );
}
