// Datos de bienes importados del JSON
import bienesJson from './talleres-bienes.json';

export interface Bien {
  n: number;
  nombre: string;
  cantidad: number;
  zona: string;
  area: string;
  subarea: string;
  descripcion: string;
  usoPedagogico: string;
  marca: string;
  modelo: string;
  codigoEntidad: string;
  codigoInterno: string;
  tipo: string;
}

export interface TallerBienes {
  totalBienes: number;
  bienes: Bien[];
}

export const bienesData = bienesJson as Record<string, TallerBienes>;

// Helpers
export const getBienesByTaller = (tallerSlug: string): Bien[] => {
  return bienesData[tallerSlug]?.bienes || [];
};

export const getBienesByZona = (tallerSlug: string, zona: string): Bien[] => {
  const bienes = getBienesByTaller(tallerSlug);
  return bienes.filter(b => b.zona === zona);
};

export const getZonasUnicasByTaller = (tallerSlug: string): string[] => {
  const bienes = getBienesByTaller(tallerSlug);
  const zonas = new Set(bienes.map(b => b.zona));
  return Array.from(zonas);
};

export const getTotalBienesByTaller = (tallerSlug: string): number => {
  return bienesData[tallerSlug]?.totalBienes || 0;
};
