import { useParams, Link } from "react-router-dom";
import { useMemo, memo } from "react";
import { getTallerBySlug } from "@/data/talleresConfig";
import { getBienesByTaller, getZonasUnicasByTaller, getBienesByZona, getTotalBienesByTaller } from "@/data/bienesData";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft, ArrowRight, Package, MapPin, Clock,
  FlaskConical, Lightbulb, Shield
} from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

const zonaIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Zona Investigación": FlaskConical,
  "Zona Innovación": Lightbulb,
  "Seguridad": Shield,
};

const zonaDescriptions: Record<string, string> = {
  "Zona Investigación": "Equipos para identificar necesidades, analizar problemas y desarrollar competencias de investigación aplicada",
  "Zona Innovación": "Equipos para diseñar, crear prototipos y desarrollar soluciones innovadoras con tecnología",
  "Seguridad": "Equipamiento de protección personal y herramientas para garantizar un ambiente de trabajo seguro",
};

const TallerDashboard = () => {
  const { slug } = useParams<{ slug: string }>();
  const taller = getTallerBySlug(slug || "");
  const bienes = useMemo(() => getBienesByTaller(slug || ""), [slug]);
  const zonasUnicas = useMemo(() => getZonasUnicasByTaller(slug || ""), [slug]);
  const totalBienes = useMemo(() => getTotalBienesByTaller(slug || ""), [slug]);

  const zonasData = useMemo(() =>
    zonasUnicas.map((zona) => ({
      zona,
      Icon: zonaIcons[zona] || Package,
      count: getBienesByZona(slug || "", zona).length,
      description: zonaDescriptions[zona] || "",
    })),
    [zonasUnicas, slug]
  );

  if (!taller) {
    return (
      <>
        <PageHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-card border border-border p-8 text-center" style={{ borderRadius: "var(--r-xl)" }}>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
            <h2 className="font-bold text-foreground mb-2">Taller no encontrado</h2>
            <Link to="/" className="text-sm text-primary font-semibold hover:underline">← Volver al Hub</Link>
          </div>
        </div>
      </>
    );
  }

  const stats = [
    { icon: Package, label: "Total de bienes", value: String(totalBienes || bienes.length) },
    { icon: MapPin, label: "Zonas", value: String(zonasUnicas.length) },
    { icon: Clock, label: "Horas Programa", value: "150h" },
    { icon: FlaskConical, label: "Estado", value: "En progreso" },
  ];

  return (
    <>
      <PageHeader>
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="text-sm font-semibold text-foreground">{taller.nombre}</span>
        <span className="text-xs text-muted-foreground">T{taller.numero}</span>
      </PageHeader>
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
          {/* Hero */}
          <div className="hero-gradient p-8 text-dk-text" style={{ borderRadius: "var(--r-xl)" }}>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2">{taller.nombre}</h1>
            <p className="text-dk-muted text-sm md:text-base max-w-2xl">{taller.descripcion}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {zonasUnicas.map((zona) => (
                <span key={zona} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                  {zona}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-card border border-border p-4 text-center hover:shadow-sm transition-shadow" style={{ borderRadius: "var(--r-lg)" }}>
                <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                <p className="text-lg font-extrabold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Zone Cards */}
          <div>
            <h2 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" /> Zonas del Taller
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {zonasData.map(({ zona, Icon: ZIcon, count, description }) => (
                <ZonaCard key={zona} zona={zona} Icon={ZIcon} count={count} description={description} slug={slug || ""} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link to={`/taller/${slug}/catalogo`} className="group block">
            <div className="overflow-hidden bg-card border border-border text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5" style={{ borderRadius: "var(--r-xl)" }}>
              <div className="hero-gradient p-6 flex items-center gap-5">
                <div className="h-14 w-14 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                  <Package className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-dk-text leading-snug">Catálogo Completo</h3>
                  <p className="text-dk-muted text-sm mt-1">Explora los {totalBienes || bienes.length} bienes con fichas técnicas detalladas</p>
                </div>
                <ArrowRight className="h-5 w-5 text-dk-muted group-hover:text-primary transition-colors shrink-0" />
              </div>
            </div>
          </Link>
        </div>
      </main>
    </>
  );
};

const ZonaCard = memo(({ zona, Icon: ZIcon, count, description, slug }: {
  zona: string;
  Icon: React.ComponentType<{ className?: string }>;
  count: number;
  description: string;
  slug: string;
}) => (
  <Link to={`/taller/${slug}/catalogo?zona=${encodeURIComponent(zona)}`} className="group block">
    <div className="overflow-hidden bg-card border border-border text-left transition-all duration-200 hover:shadow-md hover:border-primary/30 hover:-translate-y-0.5 w-full" style={{ borderRadius: "var(--r-xl)" }}>
      <div className="hero-gradient p-6 pb-3">
        <ZIcon className="h-6 w-6 text-primary mb-2" />
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary">{count} bienes</span>
        <h3 className="text-lg font-bold text-dk-text mt-2 leading-snug">{zona}</h3>
        <p className="text-dk-muted text-sm mt-1 line-clamp-2">{description}</p>
      </div>
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <Progress value={0} className="h-1.5 flex-1" />
          <span className="text-xs text-muted-foreground font-mono">0%</span>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors ml-3" />
      </div>
    </div>
  </Link>
));
ZonaCard.displayName = "ZonaCard";

export default TallerDashboard;
