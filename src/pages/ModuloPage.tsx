import { useParams, useNavigate } from "react-router-dom";
import { getModuloByNumber } from "@/data/modulosConfig";
import { getTallerBySlug } from "@/data/talleresConfig";
import { useProgress } from "@/contexts/ProgressContext";
import { calcularTotalModulo, minutosATexto } from "@/lib/calcularTiempo";
import { ContenidoCard } from "@/components/ContenidoCard";
import { SubSeccionCard } from "@/components/SubSeccionCard";
import { TiempoEstimadoBadge } from "@/components/TiempoEstimadoBadge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

const ModuloPage = () => {
  const { slug, num } = useParams<{ slug: string; num: string }>();
  const navigate = useNavigate();
  const { getContenidoEstado, markContenidoCompleted, getModuloProgreso } = useProgress();

  const taller = getTallerBySlug(slug || "");
  const moduloNum = parseInt(num || "1", 10);
  const modulo = getModuloByNumber(slug || "", moduloNum);

  if (!taller || !modulo) {
    return (
      <>
        <PageHeader />
        <div className="p-8 text-center">
          <p className="text-muted-foreground">Módulo no encontrado.</p>
          <button onClick={() => navigate(`/taller/${slug}`)} className="text-primary text-sm mt-2">← Volver</button>
        </div>
      </>
    );
  }

  const { porcentaje } = getModuloProgreso(slug || "", moduloNum);
  const totalMin = calcularTotalModulo(modulo);
  const hasSubSecciones = modulo.subSecciones && modulo.subSecciones.length > 0;

  const handleContenidoClick = (contenidoId: string) => {
    markContenidoCompleted(contenidoId);
  };

  return (
    <>
      <PageHeader>
        <button
          onClick={() => navigate(`/taller/${slug}`)}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold text-foreground">{taller.nombreCorto}</span>
        <span className="text-xs text-muted-foreground">Módulo {modulo.orden}</span>
      </PageHeader>

      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="hero-gradient p-8" style={{ borderRadius: "var(--r-xl)" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase" style={{ color: "hsl(var(--dk-muted))" }}>
                Módulo {modulo.orden} de 6
              </span>
              <TiempoEstimadoBadge tiempo={`${minutosATexto(totalMin)} aprox.`} />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-2" style={{ color: "hsl(var(--dk-text))" }}>
              {modulo.icon} {modulo.nombre}
            </h1>
            <p className="text-sm mb-4" style={{ color: "hsl(var(--dk-muted))" }}>
              {modulo.descripcion}
            </p>
            <div className="flex items-center gap-3">
              <Progress value={porcentaje} className="h-2 flex-1 max-w-[300px]" />
              <span className="text-sm font-mono" style={{ color: "hsl(var(--dk-text))" }}>{porcentaje}% completado</span>
            </div>
          </div>

          {/* Sub-secciones (Módulo 1) or flat content list */}
          {hasSubSecciones ? (
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground font-semibold">
                Sub-secciones del módulo
              </p>
              {modulo.subSecciones!.map((sub, i) => (
                <SubSeccionCard
                  key={sub.id}
                  subSeccion={sub}
                  defaultOpen={i === 0}
                  onContenidoClick={handleContenidoClick}
                  getEstado={getContenidoEstado}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground font-semibold">
                Lista de contenidos del módulo
              </p>
              {modulo.contenidos
                .sort((a, b) => a.orden - b.orden)
                .map((item) => {
                  const estado = getContenidoEstado(item.id);
                  return (
                    <ContenidoCard
                      key={item.id}
                      item={item}
                      completed={estado.completed}
                      inProgress={estado.inProgress}
                      onClick={() => handleContenidoClick(item.id)}
                    />
                  );
                })}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ModuloPage;
