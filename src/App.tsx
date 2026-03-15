import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AppLayout } from "./components/AppLayout";
import { ProgressProvider } from "./contexts/ProgressContext";

const Hub               = lazy(() => import("./pages/Hub"));
const TallerDashboard   = lazy(() => import("./pages/TallerDashboard"));
const Catalogo          = lazy(() => import("./pages/Catalogo"));
const BienDetalle       = lazy(() => import("./pages/BienDetalle"));
const ModuloPage        = lazy(() => import("./pages/ModuloPage"));
const LiveSessionPage   = lazy(() => import("./pages/LiveSessionPage"));
const Repositorio       = lazy(() => import("./pages/Repositorio"));
const RepoBienDetalle   = lazy(() => import("./pages/RepoBienDetalle"));
const RutaAprendizajePage = lazy(() => import("./pages/RutaAprendizajePage"));
const FormacionTecnicaPage = lazy(() => import("./pages/FormacionTecnicaPage"));
const SesionesDashboard = lazy(() => import("./pages/SesionesDashboard"));
const NotFound          = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

function PageFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground text-sm">Cargando...</div>
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ProgressProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Suspense fallback={<PageFallback />}><Hub /></Suspense>} />
              <Route path="/taller/:slug" element={<Suspense fallback={<PageFallback />}><TallerDashboard /></Suspense>} />
              <Route path="/taller/:slug/catalogo" element={<Suspense fallback={<PageFallback />}><Catalogo /></Suspense>} />
              <Route path="/taller/:slug/bien/:id" element={<Suspense fallback={<PageFallback />}><BienDetalle /></Suspense>} />
              <Route path="/taller/:slug/modulo/:num" element={<Suspense fallback={<PageFallback />}><ModuloPage /></Suspense>} />
              <Route path="/taller/:slug/modulo/:num/live" element={<Suspense fallback={<PageFallback />}><LiveSessionPage /></Suspense>} />
              <Route path="/taller/:slug/repositorio" element={<Suspense fallback={<PageFallback />}><Repositorio /></Suspense>} />
              <Route path="/taller/:slug/repositorio/bien/:id" element={<Suspense fallback={<PageFallback />}><RepoBienDetalle /></Suspense>} />
              <Route path="/taller/:slug/ruta" element={<Suspense fallback={<PageFallback />}><RutaAprendizajePage /></Suspense>} />
              <Route path="/taller/:slug/formacion" element={<Suspense fallback={<PageFallback />}><FormacionTecnicaPage /></Suspense>} />
              <Route path="/taller/:slug/sesiones" element={<Suspense fallback={<PageFallback />}><SesionesDashboard /></Suspense>} />
            </Route>
            <Route path="*" element={<Suspense fallback={<PageFallback />}><NotFound /></Suspense>} />
          </Routes>
        </BrowserRouter>
      </ProgressProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
