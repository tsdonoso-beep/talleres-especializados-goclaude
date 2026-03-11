import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { buildModulosForTaller } from "@/data/modulosConfig";

interface ContenidoEstado {
  completed: boolean;
  inProgress: boolean;
}

interface ProgressContextType {
  loading: boolean;
  getContenidoEstado: (contenidoId: string) => ContenidoEstado;
  markContenidoCompleted: (contenidoId: string) => void;
  markContenidoInProgress: (contenidoId: string) => void;
  getModuloProgreso: (tallerSlug: string, moduloNum: number) => { porcentaje: number; completados: number; total: number };
  getTallerProgreso: (tallerSlug: string) => { porcentaje: number; completados: number; total: number };
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be inside ProgressProvider");
  return ctx;
}

interface ProgressRecord {
  completed: boolean;
  inProgress: boolean;
}

const STORAGE_KEY = "navigator-progress";

function loadRecords(): Map<string, ProgressRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Record<string, ProgressRecord>;
    return new Map(Object.entries(parsed));
  } catch {
    return new Map();
  }
}

function saveRecords(records: Map<string, ProgressRecord>) {
  const obj = Object.fromEntries(records);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<Map<string, ProgressRecord>>(() => loadRecords());
  const [loading] = useState(false);

  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const getContenidoEstado = useCallback((contenidoId: string): ContenidoEstado => {
    const r = records.get(contenidoId);
    return { completed: r?.completed || false, inProgress: r?.inProgress || false };
  }, [records]);

  const markContenidoCompleted = useCallback((contenidoId: string) => {
    setRecords((prev) => {
      const next = new Map(prev);
      next.set(contenidoId, { completed: true, inProgress: false });
      return next;
    });
  }, []);

  const markContenidoInProgress = useCallback((contenidoId: string) => {
    setRecords((prev) => {
      const existing = prev.get(contenidoId);
      if (existing?.completed) return prev;
      const next = new Map(prev);
      next.set(contenidoId, { completed: false, inProgress: true });
      return next;
    });
  }, []);

  const getModuloProgreso = useCallback((tallerSlug: string, moduloNum: number) => {
    const modulos = buildModulosForTaller(tallerSlug);
    const modulo = modulos.find(m => m.orden === moduloNum);
    if (!modulo) return { porcentaje: 0, completados: 0, total: 0 };

    const allIds: string[] = [];
    modulo.contenidos.forEach(c => allIds.push(c.id));
    modulo.subSecciones?.forEach(s => s.contenidos.forEach(c => allIds.push(c.id)));

    const total = allIds.length;
    const completados = allIds.filter(id => records.get(id)?.completed).length;
    const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
    return { porcentaje, completados, total };
  }, [records]);

  const getTallerProgreso = useCallback((tallerSlug: string) => {
    const modulos = buildModulosForTaller(tallerSlug);
    const allIds: string[] = [];
    modulos.forEach(m => {
      m.contenidos.forEach(c => allIds.push(c.id));
      m.subSecciones?.forEach(s => s.contenidos.forEach(c => allIds.push(c.id)));
    });

    const total = allIds.length;
    const completados = allIds.filter(id => records.get(id)?.completed).length;
    const porcentaje = total > 0 ? Math.round((completados / total) * 100) : 0;
    return { porcentaje, completados, total };
  }, [records]);

  return (
    <ProgressContext.Provider
      value={{ loading, getContenidoEstado, markContenidoCompleted, markContenidoInProgress, getModuloProgreso, getTallerProgreso }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
