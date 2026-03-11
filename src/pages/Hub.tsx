import { useState, memo } from "react";
import { Link } from "react-router-dom";
import { talleresConfig, TallerConfig } from "@/data/talleresConfig";
import { Search, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/AppLayout";

const Hub = () => {
  const [search, setSearch] = useState("");

  const filtered = talleresConfig.filter((t) =>
    t.nombre.toLowerCase().includes(search.toLowerCase()) ||
    t.descripcion.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <PageHeader>
        <span className="text-sm font-semibold text-foreground">Inicio</span>
      </PageHeader>
      <main className="flex-1 overflow-y-auto">
        <div className="px-6 md:px-10 pt-8 pb-5">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Bienvenido, Docente&nbsp;👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5">
            Explora los 9 talleres de capacitación&nbsp;·&nbsp;150 horas de formación
          </p>
          <div className="flex items-center gap-3 mt-5">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar talleres, materiales..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 shadow-sm transition-shadow"
              />
            </div>
            <span className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-primary text-primary-foreground shadow-sm">
              Todos
            </span>
          </div>
        </div>
        <div className="px-6 md:px-10 pb-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((taller, i) => (
              <TallerCard key={taller.id} taller={taller} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No se encontraron talleres con ese criterio</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

const TallerCard = memo(({ taller, index }: { taller: TallerConfig; index: number }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <Link
      to={`/taller/${taller.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex flex-col rounded-2xl border bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5">
        <div className="relative h-44 overflow-hidden bg-muted">
          {!imgError ? (
            <img
              src={taller.imagen}
              alt={taller.nombre}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, hsl(${taller.color} / 0.3), hsl(${taller.color} / 0.6))` }}
            >
              <span className="text-5xl opacity-40 text-white">{taller.numero}</span>
            </div>
          )}
          <span className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shadow">
            T{taller.numero}
          </span>
        </div>
        <div className="flex flex-col flex-1 p-4">
          <h3 className="font-bold text-base text-foreground leading-tight mb-1.5 group-hover:text-primary transition-colors">
            {taller.nombre}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {taller.descripcion}
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">6 módulos · 150h</p>
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-2 flex-1 mr-3">
              <div className="h-1.5 flex-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: "0%" }} />
              </div>
              <span className="text-[10px] text-muted-foreground font-mono">0%</span>
            </div>
            <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:shadow-md transition-shadow" aria-label={`Ir a ${taller.nombre}`}>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
});
TallerCard.displayName = "TallerCard";

export default Hub;
